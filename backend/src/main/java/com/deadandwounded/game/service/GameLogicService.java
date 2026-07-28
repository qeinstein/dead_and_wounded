package com.deadandwounded.game.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class GameLogicService {

    public static class Feedback {
        private final int dead;
        private final int wounded;

        public Feedback(int dead, int wounded) {
            this.dead = dead;
            this.wounded = wounded;
        }

        public int getDead() {
            return dead;
        }

        public int getWounded() {
            return wounded;
        }
    }

    public void validateCode(String code) {
        if (code == null || code.length() != 4) {
            throw new IllegalArgumentException("Code must be exactly 4 digits");
        }

        Set<Character> seen = new HashSet<>();
        for (int i = 0; i < code.length(); i++) {
            char ch = code.charAt(i);
            if (!Character.isDigit(ch)) {
                throw new IllegalArgumentException("Code must contain only numerical digits (0-9)");
            }
            if (seen.contains(ch)) {
                throw new IllegalArgumentException("Code must contain 4 unique digits. Duplicate digit found: '" + ch + "'");
            }
            seen.add(ch);
        }
    }

    public String generateRandomCode() {
        List<Integer> digits = new ArrayList<>();
        for (int i = 0; i <= 9; i++) {
            digits.add(i);
        }
        Collections.shuffle(digits);

        StringBuilder sb = new StringBuilder(4);
        for (int i = 0; i < 4; i++) {
            sb.append(digits.get(i));
        }
        return sb.toString();
    }

    public Feedback evaluate(String secret, String guess) {
        validateCode(guess);
        validateCode(secret);

        int dead = 0;
        int wounded = 0;

        for (int i = 0; i < 4; i++) {
            char guessChar = guess.charAt(i);
            char secretChar = secret.charAt(i);

            if (guessChar == secretChar) {
                dead++;
            } else if (secret.indexOf(guessChar) != -1) {
                wounded++;
            }
        }

        return new Feedback(dead, wounded);
    }
}
