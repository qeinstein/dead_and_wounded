package com.deadandwounded.game.controller;

import com.deadandwounded.game.model.CreateGameRequest;
import com.deadandwounded.game.model.Game;
import com.deadandwounded.game.model.GuessRequest;
import com.deadandwounded.game.model.GuessResult;
import com.deadandwounded.game.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    public ResponseEntity<Game> createGame(@Valid @RequestBody CreateGameRequest request) {
        Game game = gameService.createGame(request);
        return new ResponseEntity<>(game, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGame(@PathVariable String id) {
        Game game = gameService.getGame(id);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{id}/guess")
    public ResponseEntity<GuessResult> submitGuess(@PathVariable String id, @Valid @RequestBody GuessRequest request) {
        GuessResult result = gameService.submitGuess(id, request.getGuess());
        return ResponseEntity.ok(result);
    }
}
