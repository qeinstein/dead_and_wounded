package com.deadandwounded.game.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Game {
    private String id;
    private GameMode mode;
    private GameStatus status;
    private Player currentTurn;
    
    private List<GuessRecord> history;
    private List<GuessRecord> player1History;
    private List<GuessRecord> player2History;
    
    @JsonIgnore
    private String player1SecretCode;
    
    @JsonIgnore
    private String player2SecretCode;
    
    private Instant createdAt;

    public Game() {
        this.history = new ArrayList<>();
        this.player1History = new ArrayList<>();
        this.player2History = new ArrayList<>();
        this.createdAt = Instant.now();
    }

    public Game(String id, GameMode mode, String player1SecretCode, String player2SecretCode) {
        this.id = id;
        this.mode = mode;
        this.player1SecretCode = player1SecretCode;
        this.player2SecretCode = player2SecretCode;
        this.status = GameStatus.IN_PROGRESS;
        this.currentTurn = Player.PLAYER_1;
        this.history = new ArrayList<>();
        this.player1History = new ArrayList<>();
        this.player2History = new ArrayList<>();
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public GameMode getMode() {
        return mode;
    }

    public void setMode(GameMode mode) {
        this.mode = mode;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public Player getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(Player currentTurn) {
        this.currentTurn = currentTurn;
    }

    public List<GuessRecord> getHistory() {
        return history;
    }

    public void setHistory(List<GuessRecord> history) {
        this.history = history;
    }

    public List<GuessRecord> getPlayer1History() {
        return player1History;
    }

    public void setPlayer1History(List<GuessRecord> player1History) {
        this.player1History = player1History;
    }

    public List<GuessRecord> getPlayer2History() {
        return player2History;
    }

    public void setPlayer2History(List<GuessRecord> player2History) {
        this.player2History = player2History;
    }

    @JsonIgnore
    public String getPlayer1SecretCode() {
        return player1SecretCode;
    }

    public void setPlayer1SecretCode(String player1SecretCode) {
        this.player1SecretCode = player1SecretCode;
    }

    @JsonIgnore
    public String getPlayer2SecretCode() {
        return player2SecretCode;
    }

    public void setPlayer2SecretCode(String player2SecretCode) {
        this.player2SecretCode = player2SecretCode;
    }

    @JsonIgnore
    public String getSecretCode() {
        return player1SecretCode;
    }

    @JsonProperty("revealedSecretCode")
    public String getRevealedSecretCode() {
        if (status != GameStatus.IN_PROGRESS) {
            if (mode == GameMode.VS_COMPUTER) {
                return player1SecretCode;
            }
            return player2SecretCode; // Code guessed by P1 or P2
        }
        return null;
    }

    @JsonProperty("revealedPlayer1SecretCode")
    public String getRevealedPlayer1SecretCode() {
        if (status != GameStatus.IN_PROGRESS) {
            return player1SecretCode;
        }
        return null;
    }

    @JsonProperty("revealedPlayer2SecretCode")
    public String getRevealedPlayer2SecretCode() {
        if (status != GameStatus.IN_PROGRESS) {
            return player2SecretCode;
        }
        return null;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
