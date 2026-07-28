package com.deadandwounded.game.controller;

import com.deadandwounded.game.model.CreateGameRequest;
import com.deadandwounded.game.model.GameMode;
import com.deadandwounded.game.model.GuessRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateVsComputerGame() throws Exception {
        CreateGameRequest request = new CreateGameRequest(GameMode.VS_COMPUTER, null);

        mockMvc.perform(post("/api/v1/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.mode").value("VS_COMPUTER"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.currentTurn").value("PLAYER_1"))
                .andExpect(jsonPath("$.revealedSecretCode").doesNotExist());
    }

    @Test
    void testCreateTwoPlayerGameWithCustomCodes() throws Exception {
        // Player 1 sets "1234" (to be guessed by P2)
        // Player 2 sets "5678" (to be guessed by P1)
        CreateGameRequest request = new CreateGameRequest(GameMode.TWO_PLAYER_SAME_DEVICE, "1234", "5678");

        MvcResult result = mockMvc.perform(post("/api/v1/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.mode").value("TWO_PLAYER_SAME_DEVICE"))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        String gameId = objectMapper.readTree(json).get("id").asText();

        // Player 1's turn: Guesses Player 2's code ("5678"). Should get 4 Dead and win!
        GuessRequest guess1 = new GuessRequest("5678");
        mockMvc.perform(post("/api/v1/games/" + gameId + "/guess")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(guess1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dead").value(4))
                .andExpect(jsonPath("$.wounded").value(0))
                .andExpect(jsonPath("$.gameOver").value(true))
                .andExpect(jsonPath("$.winner").value("PLAYER_1"))
                .andExpect(jsonPath("$.status").value("PLAYER1_WON"))
                .andExpect(jsonPath("$.player1History").isArray());
    }

    @Test
    void testInvalidGuessDuplicateDigitsReturnsBadRequest() throws Exception {
        CreateGameRequest createReq = new CreateGameRequest(GameMode.VS_COMPUTER, null);
        MvcResult createRes = mockMvc.perform(post("/api/v1/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andReturn();

        String gameId = objectMapper.readTree(createRes.getResponse().getContentAsString()).get("id").asText();

        GuessRequest badGuess = new GuessRequest("1123");
        mockMvc.perform(post("/api/v1/games/" + gameId + "/guess")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badGuess)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Code must contain 4 unique digits. Duplicate digit found: '1'"));
    }
}
