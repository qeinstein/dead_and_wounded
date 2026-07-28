package com.deadandwounded.game.service;

import com.deadandwounded.game.exception.GameNotFoundException;
import com.deadandwounded.game.exception.InvalidGameException;
import com.deadandwounded.game.model.CreateGameRequest;
import com.deadandwounded.game.model.Game;
import com.deadandwounded.game.model.GameMode;
import com.deadandwounded.game.model.GameStatus;
import com.deadandwounded.game.model.GuessRecord;
import com.deadandwounded.game.model.GuessResult;
import com.deadandwounded.game.model.Player;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private final Map<String, Game> games = new ConcurrentHashMap<>();
    private final GameLogicService logicService;

    public GameService(GameLogicService logicService) {
        this.logicService = logicService;
    }

    public Game createGame(CreateGameRequest request) {
        if (request.getMode() == null) {
            throw new IllegalArgumentException("Game mode must be specified");
        }

        String p1Code;
        String p2Code;

        if (request.getMode() == GameMode.TWO_PLAYER_SAME_DEVICE) {
            // Player 1's code (guessed by Player 2)
            if (request.getPlayer1SecretCode() != null && !request.getPlayer1SecretCode().trim().isEmpty()) {
                p1Code = request.getPlayer1SecretCode().trim();
                logicService.validateCode(p1Code);
            } else {
                p1Code = logicService.generateRandomCode();
            }

            // Player 2's code (guessed by Player 1)
            if (request.getPlayer2SecretCode() != null && !request.getPlayer2SecretCode().trim().isEmpty()) {
                p2Code = request.getPlayer2SecretCode().trim();
                logicService.validateCode(p2Code);
            } else {
                p2Code = logicService.generateRandomCode();
            }
        } else {
            // VS_COMPUTER: Computer generates secret code (p1Code)
            p1Code = logicService.generateRandomCode();
            p2Code = p1Code; // for single player mode, target is p1Code
        }

        String gameId = UUID.randomUUID().toString();
        Game game = new Game(gameId, request.getMode(), p1Code, p2Code);
        games.put(gameId, game);
        return game;
    }

    public Game getGame(String id) {
        Game game = games.get(id);
        if (game == null) {
            throw new GameNotFoundException("Game not found with id: " + id);
        }
        return game;
    }

    public synchronized GuessResult submitGuess(String id, String guessStr) {
        Game game = getGame(id);

        if (game.getStatus() != GameStatus.IN_PROGRESS) {
            throw new InvalidGameException("Game is already completed.");
        }

        logicService.validateCode(guessStr);

        Player currentTurn = game.getCurrentTurn();
        // Determine target code:
        // Player 1 guesses Player 2's code (player2SecretCode)
        // Player 2 guesses Player 1's code (player1SecretCode)
        String targetCode = (currentTurn == Player.PLAYER_1) 
                ? (game.getMode() == GameMode.VS_COMPUTER ? game.getPlayer1SecretCode() : game.getPlayer2SecretCode()) 
                : game.getPlayer1SecretCode();

        GameLogicService.Feedback feedback = logicService.evaluate(targetCode, guessStr);

        GuessRecord record = new GuessRecord(guessStr, feedback.getDead(), feedback.getWounded(), currentTurn);
        game.getHistory().add(record);

        if (currentTurn == Player.PLAYER_1) {
            game.getPlayer1History().add(record);
        } else {
            game.getPlayer2History().add(record);
        }

        boolean gameOver = false;
        Player winner = null;
        Player nextTurn = currentTurn;

        if (feedback.getDead() == 4) {
            gameOver = true;
            winner = currentTurn;
            if (game.getMode() == GameMode.VS_COMPUTER) {
                game.setStatus(GameStatus.WON);
            } else if (currentTurn == Player.PLAYER_1) {
                game.setStatus(GameStatus.PLAYER1_WON);
            } else {
                game.setStatus(GameStatus.PLAYER2_WON);
            }
        } else {
            if (game.getMode() == GameMode.TWO_PLAYER_SAME_DEVICE) {
                nextTurn = (currentTurn == Player.PLAYER_1) ? Player.PLAYER_2 : Player.PLAYER_1;
                game.setCurrentTurn(nextTurn);
            }
        }

        return new GuessResult(
                guessStr,
                feedback.getDead(),
                feedback.getWounded(),
                gameOver,
                game.getStatus(),
                winner,
                nextTurn,
                game.getHistory(),
                game.getPlayer1History(),
                game.getPlayer2History()
        );
    }
}
