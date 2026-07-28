package com.deadandwounded.game.model;

import jakarta.validation.constraints.NotNull;

public class CreateGameRequest {
    @NotNull(message = "Game mode is required")
    private GameMode mode;

    private String customSecretCode;

    public CreateGameRequest() {
    }

    public CreateGameRequest(GameMode mode, String customSecretCode) {
        this.mode = mode;
        this.customSecretCode = customSecretCode;
    }

    public GameMode getMode() {
        return mode;
    }

    public void setMode(GameMode mode) {
        this.mode = mode;
    }

    public String getCustomSecretCode() {
        return customSecretCode;
    }

    public void setCustomSecretCode(String customSecretCode) {
        this.customSecretCode = customSecretCode;
    }
}
