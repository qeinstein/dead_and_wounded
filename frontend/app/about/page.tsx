import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Server,
  MonitorSmartphone,
  Lock,
  ShieldCheck,
  Zap,
  GitBranch,
  Database,
  Cpu,
  AlertTriangle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering — Dead & Wounded',
  description:
    'How Dead & Wounded is built: a concurrent Spring Boot service, the Java concurrency model, scalability path, and problems solved.',
};

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh]">
      {/* header */}
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to game
          </Link>
          <span className="eyebrow">Engineering notes</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-16 px-4 py-12 sm:px-6 sm:py-16">
        {/* hero */}
        <section className="space-y-4">
          <span className="eyebrow text-accent">Dead &amp; Wounded</span>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A code-breaking game built on real Java concurrency
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Dead &amp; Wounded is a full-stack take on the classic Bulls &amp; Cows deduction game. Its purpose
            is as much engineering as play: a stateful, multi-session web service that stays correct under
            concurrent load using core Java concurrency primitives — <span className="text-neutral-200">ConcurrentHashMap</span> for
            lock-free session storage and <span className="text-neutral-200">method-level synchronization</span> for
            atomic state transitions.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Java 17', 'Spring Boot 3.3', 'Next.js 14', 'TypeScript', 'Tailwind', 'three.js'].map((t) => (
              <span key={t} className="rounded-full border border-surface-border bg-surface-1 px-3 py-1 text-[11px] font-medium text-neutral-300">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* what was built */}
        <Section title="What was built" eyebrow="Overview">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card icon={<Server className="h-4 w-4" />} title="Concurrent backend">
              A <b className="text-neutral-200">Spring Boot 3 / Java 17</b> REST API that creates game sessions,
              evaluates guesses, and manages turns. Secret codes are generated with a Fisher–Yates shuffle
              (<code className="text-accent">Collections.shuffle</code>, backed by <code className="text-accent">ThreadLocalRandom</code>).
            </Card>
            <Card icon={<MonitorSmartphone className="h-4 w-4" />} title="Reactive client">
              A <b className="text-neutral-200">Next.js 14</b> App-Router client with a 3D machined readout, a tactile
              keypad, and a Mastermind-style deduction log — with defense-in-depth validation before anything hits the network.
            </Card>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Stat value="4" label="unique digits (0–9) in every secret" />
            <Stat value="2" label="Dead = right digit, right place · Wounded = right digit, wrong place" />
            <Stat value="2 modes" label="Solo vs Computer · 2-player pass & play" />
          </div>
        </Section>

        {/* architecture */}
        <Section title="System architecture" eyebrow="Three tiers">
          <Architecture />
        </Section>

        {/* concurrency */}
        <Section title="Concurrency model" eyebrow="The core">
          <div className="grid gap-4 md:grid-cols-2">
            <Card icon={<Database className="h-4 w-4" />} title="ConcurrentHashMap for sessions">
              All active games live in a <code className="text-accent">ConcurrentHashMap&lt;String, Game&gt;</code>.
              Reads (<code className="text-accent">get</code>) take <b className="text-neutral-200">no lock</b> — O(1)
              retrieval — and writes use bucket-level compare-and-swap, so creating one game never blocks reading another.
              <p className="mt-3 rounded-lg border border-surface-border bg-surface-2 p-3 text-xs text-muted">
                <b className="text-neutral-300">Why not <code>Collections.synchronizedMap</code>?</b> A single monitor
                would serialize <i>every</i> read and write — a <code>GET</code> for game&nbsp;A would block behind a
                <code>guess</code> for unrelated game&nbsp;B. ConcurrentHashMap removes that cross-session contention entirely.
              </p>
            </Card>
            <Card icon={<Lock className="h-4 w-4" />} title="synchronized submitGuess()">
              A guess is a <b className="text-neutral-200">compound operation</b>, made atomic by synchronizing on the
              service instance:
              <pre className="mt-3 overflow-x-auto rounded-lg border border-surface-border bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-neutral-300">
{`public synchronized GuessResult
  submitGuess(String id, String guess) {
    // evaluate → append history →
    // check win → switch turn → update
}`}
              </pre>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <RaceCard title="Lost updates" body="Two guesses read the same currentTurn and one is attributed to the wrong player." />
            <RaceCard title="Phantom wins" body="A race between appending history and the win check lets a winning state slip past." />
            <RaceCard title="Turn desync" body="Both threads read PLAYER_1 and both switch to PLAYER_2 — a turn silently skipped." />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card icon={<Cpu className="h-4 w-4" />} title="Thread model">
              Requests run on Tomcat&apos;s worker pool (~200 threads). A separate <code className="text-accent">@Scheduled</code>{' '}
              <b className="text-neutral-200">PingScheduler</b> runs on its own single-threaded executor, self-pinging every
              30s to keep the free-tier container warm — fully independent of request handling.
            </Card>
            <Card icon={<ShieldCheck className="h-4 w-4" />} title="Anti-cheat by design">
              The secret is marked <code className="text-accent">@JsonIgnore</code> so it never appears in any response
              during play. A computed <code className="text-accent">revealedSecretCode</code> is exposed only once the game
              has ended — closing the browser-devtools cheat.
            </Card>
          </div>
        </Section>

        {/* scalability */}
        <Section title="How it scales" eyebrow="Trade-offs">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card icon={<Zap className="h-4 w-4" />} title="From coarse to fine locking">
              <code className="text-accent">submitGuess</code> is a coarse lock on the single <code className="text-accent">GameService</code>{' '}
              bean, so it serializes guesses across <i>all</i> games. That is ideal for the real load profile
              (single-device pass &amp; play) — but for high concurrency the next step is a{' '}
              <b className="text-neutral-200">per-game <code>ReentrantLock</code></b> stored beside each game, so only
              guesses within the same session contend.
            </Card>
            <Card icon={<GitBranch className="h-4 w-4" />} title="From single JVM to a cluster">
              Sessions are held in-memory per JVM. To scale horizontally, that map moves to a{' '}
              <b className="text-neutral-200">shared store</b> (Redis / a distributed cache) with sticky sessions or
              optimistic versioning — keeping the same atomic-transition guarantees across nodes.
            </Card>
          </div>
        </Section>

        {/* problems */}
        <Section title="Problems encountered" eyebrow="What was hard">
          <div className="space-y-3">
            <Problem title="Making a multi-step guess atomic">
              Evaluating feedback, appending to history, checking the win condition, and switching turns had to happen
              as one indivisible step — the source of every race above. Synchronization scope had to be exactly right:
              wide enough to be correct, narrow enough to not throttle unrelated games.
            </Problem>
            <Problem title="Keeping the secret truly secret">
              Early on the secret leaked through the serialized game object. Splitting the field into an ignored
              <code className="text-accent"> secretCode</code> and a conditionally-computed{' '}
              <code className="text-accent">revealedSecretCode</code> fixed it.
            </Problem>
            <Problem title="Defense-in-depth validation">
              The keypad already blocks duplicate digits client-side for instant feedback, but the server re-validates
              length, digits-only, and uniqueness — a malformed request never corrupts state.
            </Problem>
            <Problem title="Staying awake on free infrastructure">
              Free-tier hosts sleep on idle. The scheduled self-ping keeps the JVM warm so the first real request
              isn&apos;t a cold start.
            </Problem>
          </div>
        </Section>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-surface-border bg-surface-1 p-8 text-center">
          <h3 className="text-lg font-semibold text-white">Try to crack a code</h3>
          <p className="max-w-md text-sm text-muted">The engineering only matters if the game holds up. See how few rounds you need.</p>
          <Link
            href="/"
            className="flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-dim"
          >
            Play now
          </Link>
        </div>
      </main>

      <footer className="border-t border-surface-border py-6 text-center">
        <p className="text-[11px] text-neutral-600">Dead &amp; Wounded — engineering notes</p>
      </footer>
    </div>
  );
}

/* ---- building blocks ---- */

function Section({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <div className="space-y-1.5">
        <span className="eyebrow text-accent">{eyebrow}</span>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="panel space-y-3 p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-1 p-4">
      <p className="text-xl font-semibold text-accent">{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted">{label}</p>
    </div>
  );
}

function RaceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dead/20 bg-dead/[0.05] p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-dead" />
        <p className="text-xs font-semibold text-dead">{title}</p>
      </div>
      <p className="text-[11px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Problem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-surface-border bg-surface-1 p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-wounded" />
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{children}</p>
      </div>
    </div>
  );
}

function Architecture() {
  return (
    <div className="panel space-y-3 p-5 sm:p-7">
      <Tier
        icon={<MonitorSmartphone className="h-4 w-4" />}
        label="Client tier"
        detail="Next.js 14 · React 18 · TypeScript"
        tone="accent"
      />
      <Connector label="HTTP / JSON · CORS" />
      <Tier
        icon={<Server className="h-4 w-4" />}
        label="Application tier — Spring Boot 3.3"
        tone="neutral"
      >
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <SubBox title="GameController" body="REST endpoints" />
          <SubBox title="GameService" body="synchronized · state & turns" highlight />
          <SubBox title="GameLogicService" body="stateless evaluate / RNG" />
        </div>
      </Tier>
      <Connector label="get / put" />
      <Tier
        icon={<Database className="h-4 w-4" />}
        label="Data tier"
        detail="ConcurrentHashMap<String, Game> · in-memory per JVM"
        tone="win"
      />
    </div>
  );
}

function Tier({
  icon, label, detail, tone, children,
}: {
  icon: React.ReactNode; label: string; detail?: string;
  tone: 'accent' | 'neutral' | 'win'; children?: React.ReactNode;
}) {
  const ring =
    tone === 'accent' ? 'border-accent/30' : tone === 'win' ? 'border-win/30' : 'border-surface-border';
  const iconTone =
    tone === 'accent' ? 'bg-accent/10 text-accent' : tone === 'win' ? 'bg-win/10 text-win' : 'bg-surface-3 text-neutral-300';
  return (
    <div className={`rounded-xl border bg-surface-2/50 p-4 ${ring}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconTone}`}>{icon}</span>
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          {detail && <p className="font-mono text-[11px] text-muted">{detail}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function SubBox({ title, body, highlight }: { title: string; body: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? 'border-accent/40 bg-accent/[0.06]' : 'border-surface-border bg-surface-1'}`}>
      <p className={`font-mono text-xs font-semibold ${highlight ? 'text-accent' : 'text-neutral-200'}`}>{title}</p>
      <p className="mt-0.5 text-[10px] text-muted">{body}</p>
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pl-4">
      <div className="h-6 w-px bg-surface-border" />
      <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-600">{label}</span>
    </div>
  );
}
