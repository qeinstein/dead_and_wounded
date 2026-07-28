package com.deadandwounded.game.model;

import jakarta.validation.constraints.NotNull;

public class GuessRequest {
    @NotNull(message = "Guess digit code is required")
    private String guess;

    public GuessRequest() {
    }

    public GuessRequest(String guess) {
        this.guess = guess;
    }

    public String getGuess() {
        return guess;
    }

    public void setGuess(String guess) {
        this.guess = guess;
    }
}
