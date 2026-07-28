package com.deadandwounded.game.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/health", "/api/v1/health"})
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = Map.of(
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "service", "dead-and-wounded-backend"
        );
        return ResponseEntity.ok(response);
    }
}
