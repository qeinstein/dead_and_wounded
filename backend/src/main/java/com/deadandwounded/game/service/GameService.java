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

        String secretCode;
        if (request.getMode() == GameMode.TWO_PLAYER_SAME_DEVICE && request.getCustomSecretCode() != null && !request.getCustomSecretCode().trim().isEmpty()) {
            secretCode = request.getCustomSecretCode().trim();
            logicService.validateCode(secretCode);
        } else {
            secretCode = logicService.generateRandomCode();
        }

        String gameId = UUID.randomUUID().toString();
        Game game = new Game(gameId, request.getMode(), secretCode);
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
        GameLogicService.Feedback feedback = logicService.evaluate(game.getSecretCode(), guessStr);

        GuessRecord record = new GuessRecord(guessStr, feedback.getDead(), feedback.getWounded(), currentTurn);
        game.getHistory().add(record);

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
                game.getHistory()
        );
    }
}
