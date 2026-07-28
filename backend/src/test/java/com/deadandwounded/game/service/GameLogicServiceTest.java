package com.deadandwounded.game.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GameLogicServiceTest {

    private GameLogicService logicService;

    @BeforeEach
    void setUp() {
        logicService = new GameLogicService();
    }

    @Test
    void testValidateCodeValid() {
        assertDoesNotThrow(() -> logicService.validateCode("1234"));
        assertDoesNotThrow(() -> logicService.validateCode("0987"));
    }

    @Test
    void testValidateCodeInvalidLength() {
        Exception ex1 = assertThrows(IllegalArgumentException.class, () -> logicService.validateCode("123"));
        assertTrue(ex1.getMessage().contains("exactly 4 digits"));

        Exception ex2 = assertThrows(IllegalArgumentException.class, () -> logicService.validateCode("12345"));
        assertTrue(ex2.getMessage().contains("exactly 4 digits"));
    }

    @Test
    void testValidateCodeNonNumeric() {
        Exception ex = assertThrows(IllegalArgumentException.class, () -> logicService.validateCode("12a4"));
        assertTrue(ex.getMessage().contains("only numerical digits"));
    }

    @Test
    void testValidateCodeDuplicateDigits() {
        Exception ex = assertThrows(IllegalArgumentException.class, () -> logicService.validateCode("1123"));
        assertTrue(ex.getMessage().contains("Duplicate digit found"));
    }

    @Test
    void testGenerateRandomCode() {
        String code = logicService.generateRandomCode();
        assertNotNull(code);
        assertEquals(4, code.length());
        assertDoesNotThrow(() -> logicService.validateCode(code));
    }

    @Test
    void testEvaluateAllDead() {
        GameLogicService.Feedback fb = logicService.evaluate("1234", "1234");
        assertEquals(4, fb.getDead());
        assertEquals(0, fb.getWounded());
    }

    @Test
    void testEvaluateAllWounded() {
        GameLogicService.Feedback fb = logicService.evaluate("1234", "4321");
        assertEquals(0, fb.getDead());
        assertEquals(4, fb.getWounded());
    }

    @Test
    void testEvaluateMixedDeadAndWounded() {
        // secret: 1234, guess: 1325 -> 1 is dead, 2 and 3 are wounded -> 1 dead, 2 wounded
        GameLogicService.Feedback fb = logicService.evaluate("1234", "1325");
        assertEquals(1, fb.getDead());
        assertEquals(2, fb.getWounded());
    }

    @Test
    void testEvaluateZeroMatches() {
        GameLogicService.Feedback fb = logicService.evaluate("1234", "5678");
        assertEquals(0, fb.getDead());
        assertEquals(0, fb.getWounded());
    }
}
