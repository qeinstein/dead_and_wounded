# Dead & Wounded — A Concurrent Code-Breaking Deduction Game

## CSC 210 — Java Concurrency & Web Systems Project

---

## Table of Contents

1. [Abstract](#abstract)
2. [Problem Statement](#problem-statement)
3. [System Architecture](#system-architecture)
4. [Concurrency Model](#concurrency-model)
5. [Game Logic & Algorithm](#game-logic--algorithm)
6. [REST API Contract](#rest-api-contract)
7. [Data Model](#data-model)
8. [Scheduled Task Execution](#scheduled-task-execution)
9. [Frontend Client](#frontend-client)
10. [Input Validation & Error Handling](#input-validation--error-handling)
11. [Build & Run Instructions](#build--run-instructions)
12. [Deployment Architecture](#deployment-architecture)
13. [Testing Strategy](#testing-strategy)
14. [Project Structure](#project-structure)
15. [References](#references)

---

## Abstract

**Dead & Wounded** (also known as *Bulls & Cows*) is a web-based logic deduction game in which a player attempts to determine a secret four-digit numerical sequence through iterative guessing with positional feedback. The system is implemented as a distributed client-server application: a **Java 17 / Spring Boot 3** REST API backend that manages concurrent game sessions using thread-safe data structures, and a **React / Next.js 14** frontend that provides a responsive, mobile-first user interface.

This project demonstrates practical application of core Java concurrency primitives — specifically `ConcurrentHashMap` for lock-free session storage and `synchronized` method-level locking for atomic state transitions — in a real-time, multi-session web service context.

---

## Problem Statement

The objective is to design and implement a stateful web service capable of:

1. Managing **multiple independent game sessions** concurrently without race conditions or state corruption.
2. Enforcing **strict turn-based alternation** in a two-player mode where both players share a single device (pass-and-play), ensuring that guess evaluation, turn switching, and win-condition detection execute as an **atomic operation**.
3. Providing **sub-100ms API response latency** for guess evaluations under concurrent load.
4. Maintaining **zero state desynchronization** between the server-side game model and the client-side representation.

---

## System Architecture

The system follows a standard **three-tier architecture**:

```
┌─────────────────────────────────────────────┐
│              CLIENT TIER                     │
│         Next.js 14 (React 18)                │
│    Vercel Edge / Static Deployment           │
└──────────────────┬──────────────────────────┘
                   │  HTTP/JSON (REST)
                   │  CORS-enabled
                   ▼
┌─────────────────────────────────────────────┐
│            APPLICATION TIER                  │
│       Spring Boot 3.3.4 (Java 17)            │
│                                              │
│  ┌───────────────────────────────────────┐   │
│  │         GameController (REST)         │   │
│  │   POST /api/v1/games                  │   │
│  │   GET  /api/v1/games/{id}             │   │
│  │   POST /api/v1/games/{id}/guess       │   │
│  └───────────────┬───────────────────────┘   │
│                  │                            │
│  ┌───────────────▼───────────────────────┐   │
│  │   GameService (synchronized methods)  │   │
│  │   State management & turn logic       │   │
│  └───────────────┬───────────────────────┘   │
│                  │                            │
│  ┌───────────────▼───────────────────────┐   │
│  │     GameLogicService (stateless)      │   │
│  │   Validation, evaluation, RNG         │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌───────────────────────────────────────┐   │
│  │  PingScheduler (@Scheduled thread)    │   │
│  │  Periodic self-ping every 30 seconds  │   │
│  └───────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              DATA TIER                       │
│    ConcurrentHashMap<String, Game>            │
│    In-memory, per-JVM-instance               │
└─────────────────────────────────────────────┘
```

---

## Concurrency Model

### Session Storage: `ConcurrentHashMap`

All active game sessions are stored in a `ConcurrentHashMap<String, Game>`, chosen for the following properties:

| Property | Benefit |
|---|---|
| **Lock-free reads** | `get()` operations do not acquire any lock, ensuring O(1) read latency for game state retrieval regardless of concurrent writes. |
| **Segment-level locking** (Java 8+ bucket-level CAS) | `put()` operations use compare-and-swap at the bucket level, allowing concurrent creation of independent game sessions without contention. |
| **Thread-safe iteration** | Weakly consistent iterators do not throw `ConcurrentModificationException`, which is safe for our read-heavy access pattern. |
| **Null-safety** | Neither null keys nor null values are permitted, preventing a class of `NullPointerException` bugs. |

**Why not `HashMap` with external synchronization?**

A `Collections.synchronizedMap(new HashMap<>())` wrapper would serialize all operations — both reads and writes — behind a single monitor lock. Under concurrent load (multiple active game sessions), this creates a bottleneck where a `GET /api/v1/games/{id}` read for Game A blocks behind a `POST /api/v1/games/{id}/guess` write for unrelated Game B. `ConcurrentHashMap` eliminates this contention entirely for cross-session operations.

### Guess Submission: `synchronized` Method

```java
public synchronized GuessResult submitGuess(String id, String guessStr) {
    // 1. Retrieve game state
    // 2. Validate guess input
    // 3. Evaluate dead/wounded feedback
    // 4. Append to history
    // 5. Check win condition
    // 6. Switch turn (if 2-player)
    // 7. Update game status
    // 8. Return result
}
```

The `submitGuess` method is declared `synchronized` on the `GameService` instance to guarantee that the compound operation of *evaluate → append → check-win → switch-turn* executes **atomically**. Without this synchronization, two concurrent HTTP requests for the same game session could interleave in a manner that produces:

- **Lost updates**: Two guesses appended simultaneously with both reading the same `currentTurn` value, causing one guess to be attributed to the wrong player.
- **Phantom wins**: A race between step 4 (append to history) and step 5 (win condition check) could cause one thread to miss the winning state.
- **Turn desynchronization**: Two threads both reading `PLAYER_1` as the current turn and both switching to `PLAYER_2`, effectively skipping a turn.

The `synchronized` keyword acquires the intrinsic monitor lock on the `GameService` singleton bean, ensuring mutual exclusion across all `submitGuess` invocations.

> **Trade-off**: This is a coarse-grained lock that serializes all guess submissions across all games, not just within a single game. For the expected load profile (single-device pass-and-play, low request rate), this is acceptable. A finer-grained approach would use per-game `ReentrantLock` instances stored alongside each `Game` object if higher concurrency were required.

### Thread Model Summary

| Component | Thread | Synchronization |
|---|---|---|
| `GameController` | Tomcat worker thread pool (default: 200 threads) | None (delegates to service) |
| `GameService.createGame()` | Tomcat worker thread | `ConcurrentHashMap.put()` — lock-free at bucket level |
| `GameService.getGame()` | Tomcat worker thread | `ConcurrentHashMap.get()` — lock-free |
| `GameService.submitGuess()` | Tomcat worker thread | `synchronized` on `GameService` instance |
| `PingScheduler.pingSelf()` | Spring `@Scheduled` single-threaded executor | None (independent operation) |

---

## Game Logic & Algorithm

### Rules

1. A **secret code** consists of exactly 4 unique decimal digits (0–9). Example: `3071`.
2. A **guess** follows the same constraints: 4 unique decimal digits.
3. For each guess, the system computes:
   - **Dead**: Count of digits that appear in the secret code at the **exact same position**.
   - **Wounded**: Count of digits that appear in the secret code at a **different position**.
4. The game terminates when a guess produces **4 Dead** (all digits in correct positions).

### Evaluation Algorithm

```
Input:  secret = "3071", guess = "3170"
        Position:  0  1  2  3

        secret[0]='3'  guess[0]='3'  → MATCH (Dead)
        secret[1]='0'  guess[1]='1'  → '1' in secret? Yes, at pos 2 → Wounded
        secret[2]='7'  guess[2]='7'  → MATCH (Dead)
        secret[3]='1'  guess[3]='0'  → '0' in secret? Yes, at pos 1 → Wounded

Output: Dead = 2, Wounded = 2
```

The algorithm runs in **O(n²)** where n=4 (constant), making it effectively O(1) per evaluation.

### Random Code Generation

```java
List<Integer> digits = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
Collections.shuffle(digits);  // Fisher-Yates shuffle
return digits.subList(0, 4);  // Take first 4
```

`Collections.shuffle()` uses `ThreadLocalRandom` internally (Java 17), providing good statistical distribution without the contention of a shared `Random` instance.

---

## REST API Contract

### Base URL

```
Production: https://dead-and-wounded-backend-csc210.onrender.com
Local:      http://localhost:8080
```

### Endpoints

| Method | Path | Description | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/api/v1/games` | Create a new game session | `CreateGameRequest` | `201 Created` → `Game` |
| `GET` | `/api/v1/games/{id}` | Retrieve game state and history | — | `200 OK` → `Game` |
| `POST` | `/api/v1/games/{id}/guess` | Submit a 4-digit guess | `GuessRequest` | `200 OK` → `GuessResult` |
| `GET` | `/health` | Health check | — | `200 OK` → `{ status, timestamp, service }` |

### Request/Response Examples

**Create Game (Single Player):**
```json
POST /api/v1/games
Content-Type: application/json

{
  "mode": "VS_COMPUTER"
}
```

**Create Game (Two Player with Custom Code):**
```json
POST /api/v1/games
Content-Type: application/json

{
  "mode": "TWO_PLAYER_SAME_DEVICE",
  "customSecretCode": "3071"
}
```

**Submit Guess:**
```json
POST /api/v1/games/{id}/guess
Content-Type: application/json

{
  "guess": "3170"
}
```

**Response (Guess Evaluated):**
```json
{
  "guess": "3170",
  "dead": 2,
  "wounded": 2,
  "gameOver": false,
  "status": "IN_PROGRESS",
  "winner": null,
  "nextTurn": "PLAYER_2",
  "history": [...]
}
```

### Error Responses

All validation failures return `400 Bad Request`:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Code must contain 4 unique digits. Duplicate digit found: '1'",
  "timestamp": "2026-07-28T09:00:00Z"
}
```

---

## Data Model

### Enumerations

| Enum | Values | Purpose |
|---|---|---|
| `GameMode` | `VS_COMPUTER`, `TWO_PLAYER_SAME_DEVICE` | Determines session behavior |
| `GameStatus` | `IN_PROGRESS`, `WON`, `PLAYER1_WON`, `PLAYER2_WON` | Tracks game lifecycle |
| `Player` | `PLAYER_1`, `PLAYER_2`, `COMPUTER` | Identifies turn ownership |

### Game Entity

| Field | Type | Serialization |
|---|---|---|
| `id` | `String` (UUID) | Always visible |
| `mode` | `GameMode` | Always visible |
| `status` | `GameStatus` | Always visible |
| `currentTurn` | `Player` | Always visible |
| `history` | `List<GuessRecord>` | Always visible |
| `secretCode` | `String` | `@JsonIgnore` — **never** sent to client during play |
| `revealedSecretCode` | Computed | Only non-null when `status ≠ IN_PROGRESS` |
| `createdAt` | `Instant` | Always visible |

The `@JsonIgnore` annotation on `secretCode` prevents the secret from appearing in any API response during an active game. A separate computed property `revealedSecretCode` exposes the value only after the game has concluded, preventing cheating via browser developer tools.

---

## Scheduled Task Execution

### PingScheduler

To prevent the Render free-tier deployment from spinning down due to inactivity, a `@Scheduled` task performs a self-ping every 30 seconds:

```java
@Scheduled(fixedRate = 30000, initialDelay = 10000)
public void pingSelf() {
    HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(pingUrl))
            .timeout(Duration.ofSeconds(10))
            .GET()
            .build();
    httpClient.send(request, HttpResponse.BodyHandlers.ofString());
}
```

**Threading**: Spring's `@EnableScheduling` creates a dedicated single-threaded `ScheduledExecutorService` that runs independently of the Tomcat worker pool. The `HttpClient` instance is created once in the constructor (connection pooling) with a 5-second connect timeout.

**Configuration**: The target URL is injected via `@Value("${PING_URL:...}")`, allowing override through environment variables without code changes.

---

## Frontend Client

### Technology

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS 3 with custom design tokens
- **Animations**: CSS keyframe animations (fade-in, slide-up, scale-in)
- **Effects**: canvas-confetti for win celebration
- **Icons**: Lucide React

### Responsive Design

The interface adapts across screen sizes:

| Breakpoint | Layout |
|---|---|
| Mobile (`< 640px`) | Single column, stacked keypad + history |
| Tablet (`640–1023px`) | Single column with wider spacing |
| Desktop (`≥ 1024px`) | Side-by-side keypad (left) + history (right) |

All interactive elements use `min-height: 44px` touch targets for mobile accessibility.

### Client-Side Validation

The keypad component enforces digit uniqueness in real-time by disabling already-selected digit buttons, preventing invalid submissions before they reach the network layer. This provides immediate feedback without a server roundtrip.

---

## Input Validation & Error Handling

Validation is enforced at **both** the client and server layers (defense in depth):

| Rule | Client Enforcement | Server Enforcement |
|---|---|---|
| Exactly 4 digits | Input field `maxLength={4}` | `code.length() != 4` → `IllegalArgumentException` |
| Digits only (0–9) | Regex filter `replace(/\D/g, '')` | `!Character.isDigit(ch)` → `IllegalArgumentException` |
| No duplicates | Button disabling on selection | `HashSet<Character>.contains()` → `IllegalArgumentException` |
| Game exists | N/A | `ConcurrentHashMap.get()` → `GameNotFoundException` (404) |
| Game not finished | N/A | `status != IN_PROGRESS` → `InvalidGameException` (400) |

The `GlobalExceptionHandler` (`@RestControllerAdvice`) translates all exceptions into structured JSON error responses with appropriate HTTP status codes.

---

## Build & Run Instructions

### Prerequisites

- Java 17+ (JDK)
- Maven 3.9+ (or use included `mvnw` wrapper)
- Node.js 18+ and npm 9+

### Backend

```bash
cd backend

# Run tests
./mvnw clean test

# Start development server (port 8080)
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server (port 3000)
npm run dev
```

### Environment Variables

| Variable | Location | Default | Purpose |
|---|---|---|---|
| `PORT` | Backend | `8080` | Server port (Render injects dynamically) |
| `PING_URL` | Backend | `https://dead-and-wounded-backend-csc210.onrender.com/api/v1/health` | Self-ping target URL |
| `NEXT_PUBLIC_API_URL` | Frontend | `http://localhost:8080` | Backend API base URL |

---

## Deployment Architecture

```
┌─────────────┐          ┌──────────────────────┐
│   Vercel     │  HTTPS   │      Render           │
│   (CDN)      │ ──────→  │   (Docker Container)  │
│              │          │                        │
│  Next.js 14  │          │  Spring Boot 3.3.4     │
│  Static +    │          │  JRE 17 Alpine         │
│  Serverless  │          │  Port: ${PORT}         │
└─────────────┘          │                        │
                         │  Self-ping @30s         │
                         └──────────────────────────┘
```

The backend `Dockerfile` uses a multi-stage build:

1. **Build stage**: `maven:3.9-eclipse-temurin-17` — compiles source and packages JAR.
2. **Runtime stage**: `eclipse-temurin:17-jre-alpine` — minimal ~187MB image with only the JRE.

---

## Testing Strategy

### Unit Tests — `GameLogicServiceTest`

Tests the stateless evaluation logic in isolation:

| Test Case | Input | Expected Output |
|---|---|---|
| All Dead | secret=`1234`, guess=`1234` | dead=4, wounded=0 |
| All Wounded | secret=`1234`, guess=`4321` | dead=0, wounded=4 |
| Mixed | secret=`1234`, guess=`1325` | dead=1, wounded=2 |
| Zero Match | secret=`1234`, guess=`5678` | dead=0, wounded=0 |
| Invalid Length | guess=`123` | `IllegalArgumentException` |
| Non-Numeric | guess=`12a4` | `IllegalArgumentException` |
| Duplicate Digits | guess=`1123` | `IllegalArgumentException` |

### Integration Tests — `GameControllerTest`

Tests the full HTTP request-response cycle through Spring's `MockMvc`:

| Test Case | Description |
|---|---|
| Create VS_COMPUTER game | Verifies 201 response with `IN_PROGRESS` status |
| Two-player full flow | Creates game with code `1234`, submits wrong guess (P1), submits winning guess (P2), verifies `PLAYER2_WON` |
| Invalid guess rejection | Submits `1123` (duplicate digits), verifies 400 response with error message |

### Running Tests

```bash
cd backend
./mvnw clean test
```

---

## Project Structure

```
dead_and_wounded/
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src/
│       ├── main/java/com/deadandwounded/game/
│       │   ├── BackendApplication.java          # Entry point, @EnableScheduling
│       │   ├── config/
│       │   │   └── CorsConfig.java              # Global CORS configuration
│       │   ├── controller/
│       │   │   ├── GameController.java           # REST endpoints
│       │   │   └── HealthController.java         # Health check endpoint
│       │   ├── exception/
│       │   │   ├── GameNotFoundException.java    # 404 exception
│       │   │   ├── InvalidGameException.java     # 400 exception
│       │   │   └── GlobalExceptionHandler.java   # @RestControllerAdvice
│       │   ├── model/
│       │   │   ├── Game.java                     # Game entity (@JsonIgnore secret)
│       │   │   ├── GameMode.java                 # VS_COMPUTER | TWO_PLAYER
│       │   │   ├── GameStatus.java               # IN_PROGRESS | WON | P1_WON | P2_WON
│       │   │   ├── Player.java                   # PLAYER_1 | PLAYER_2 | COMPUTER
│       │   │   ├── GuessRecord.java              # Guess + feedback + player + timestamp
│       │   │   ├── GuessResult.java              # API response DTO
│       │   │   ├── CreateGameRequest.java        # API request DTO
│       │   │   ├── GuessRequest.java             # API request DTO
│       │   │   └── ErrorResponse.java            # Structured error DTO
│       │   └── service/
│       │       ├── GameLogicService.java          # Stateless: validate, generate, evaluate
│       │       ├── GameService.java              # Stateful: ConcurrentHashMap + synchronized
│       │       └── PingScheduler.java            # @Scheduled self-ping every 30s
│       └── test/java/com/deadandwounded/game/
│           ├── service/
│           │   └── GameLogicServiceTest.java      # Unit tests
│           └── controller/
│               ├── GameControllerTest.java        # Integration tests
│               └── HealthControllerTest.java      # Health endpoint tests
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── next.config.js
    ├── lib/
    │   └── api.ts                                # REST client + TypeScript types
    ├── app/
    │   ├── globals.css                           # Base styles
    │   ├── layout.tsx                            # Root layout + viewport meta
    │   └── page.tsx                              # Main game page
    └── components/
        ├── Navbar.tsx                            # Header bar
        ├── GameSetup.tsx                         # Mode selection + code config
        ├── TurnIndicator.tsx                     # Current turn display
        ├── KeypadInput.tsx                       # 4-digit input keypad
        ├── GuessHistory.tsx                      # Guess log with D/W feedback
        └── WinModal.tsx                          # Victory overlay + confetti
```

---

## References

1. Goetz, B. et al. (2006). *Java Concurrency in Practice*. Addison-Wesley. — Chapters 5 (Building Blocks: ConcurrentHashMap) and 2 (Thread Safety: synchronized).
2. Oracle. (2024). *ConcurrentHashMap (Java SE 17 & JDK 17)*. https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html
3. Spring Framework. (2024). *Task Execution and Scheduling*. https://docs.spring.io/spring-framework/reference/integration/scheduling.html
4. Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms*. — Section 3.4.2: Random Sampling (Fisher-Yates shuffle).

---

**Live Demo**: [https://dead-and-wounded-frontend.vercel.app](https://dead-and-wounded-frontend.vercel.app)
**Backend API**: [https://dead-and-wounded-backend-csc210.onrender.com/api/v1/health](https://dead-and-wounded-backend-csc210.onrender.com/api/v1/health)
