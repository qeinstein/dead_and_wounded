package com.deadandwounded.game.model;

import jakarta.validation.constraints.NotNull;

public class CreateGameRequest {
    @NotNull(message = "Game mode is required")
    private GameMode mode;

    private String player1SecretCode;
    private String player2SecretCode;
    private String customSecretCode;

    public CreateGameRequest() {
    }

    public CreateGameRequest(GameMode mode, String customSecretCode) {
        this.mode = mode;
        this.customSecretCode = customSecretCode;
        this.player1SecretCode = customSecretCode;
    }

    public CreateGameRequest(GameMode mode, String player1SecretCode, String player2SecretCode) {
        this.mode = mode;
        this.player1SecretCode = player1SecretCode;
        this.player2SecretCode = player2SecretCode;
    }

    public GameMode getMode() {
        return mode;
    }

    public void setMode(GameMode mode) {
        this.mode = mode;
    }

    public String getPlayer1SecretCode() {
        return player1SecretCode != null ? player1SecretCode : customSecretCode;
    }

    public void setPlayer1SecretCode(String player1SecretCode) {
        this.player1SecretCode = player1SecretCode;
    }

    public String getPlayer2SecretCode() {
        return player2SecretCode;
    }

    public void setPlayer2SecretCode(String player2SecretCode) {
        this.player2SecretCode = player2SecretCode;
    }

    public String getCustomSecretCode() {
        return customSecretCode;
    }

    public void setCustomSecretCode(String customSecretCode) {
        this.customSecretCode = customSecretCode;
    }
}
