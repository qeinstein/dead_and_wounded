package com.deadandwounded.game.model;

import java.util.List;

public class GuessResult {
    private String guess;
    private int dead;
    private int wounded;
    private boolean gameOver;
    private GameStatus status;
    private Player winner;
    private Player nextTurn;
    private List<GuessRecord> history;
    private List<GuessRecord> player1History;
    private List<GuessRecord> player2History;

    public GuessResult() {
    }

    public GuessResult(String guess, int dead, int wounded, boolean gameOver, GameStatus status, Player winner, Player nextTurn, List<GuessRecord> history) {
        this.guess = guess;
        this.dead = dead;
        this.wounded = wounded;
        this.gameOver = gameOver;
        this.status = status;
        this.winner = winner;
        this.nextTurn = nextTurn;
        this.history = history;
    }

    public GuessResult(String guess, int dead, int wounded, boolean gameOver, GameStatus status, Player winner, Player nextTurn, List<GuessRecord> history, List<GuessRecord> player1History, List<GuessRecord> player2History) {
        this.guess = guess;
        this.dead = dead;
        this.wounded = wounded;
        this.gameOver = gameOver;
        this.status = status;
        this.winner = winner;
        this.nextTurn = nextTurn;
        this.history = history;
        this.player1History = player1History;
        this.player2History = player2History;
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

    public boolean isGameOver() {
        return gameOver;
    }

    public void setGameOver(boolean gameOver) {
        this.gameOver = gameOver;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public Player getWinner() {
        return winner;
    }

    public void setWinner(Player winner) {
        this.winner = winner;
    }

    public Player getNextTurn() {
        return nextTurn;
    }

    public void setNextTurn(Player nextTurn) {
        this.nextTurn = nextTurn;
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
}
