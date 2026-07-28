package com.deadandwounded.game.model;

import java.time.Instant;

public class GuessRecord {
    private String guess;
    private int dead;
    private int wounded;
    private Player player;
    private Instant timestamp;

    public GuessRecord() {
    }

    public GuessRecord(String guess, int dead, int wounded, Player player) {
        this.guess = guess;
        this.dead = dead;
        this.wounded = wounded;
        this.player = player;
        this.timestamp = Instant.now();
    }

    public String getGuess() {
        return guess;
    }

    public void setGuess(String guess) {
        this.guess = guess;
    }

    public int getDead() {
        return dead;
    }

    public void setDead(int dead) {
        this.dead = dead;
    }

    public int getWounded() {
        return wounded;
    }

    public void setWounded(int wounded) {
        this.wounded = wounded;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
