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
    
    @JsonIgnore
    private String secretCode;
    
    private Instant createdAt;

    public Game() {
        this.history = new ArrayList<>();
        this.createdAt = Instant.now();
    }

    public Game(String id, GameMode mode, String secretCode) {
        this.id = id;
        this.mode = mode;
        this.secretCode = secretCode;
        this.status = GameStatus.IN_PROGRESS;
        this.currentTurn = Player.PLAYER_1;
        this.history = new ArrayList<>();
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

    @JsonIgnore
    public String getSecretCode() {
        return secretCode;
    }

    public void setSecretCode(String secretCode) {
        this.secretCode = secretCode;
    }

    @JsonProperty("revealedSecretCode")
    public String getRevealedSecretCode() {
        if (status != GameStatus.IN_PROGRESS) {
            return secretCode;
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
