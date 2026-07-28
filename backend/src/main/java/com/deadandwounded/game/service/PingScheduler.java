package com.deadandwounded.game.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class PingScheduler {

    private static final Logger logger = LoggerFactory.getLogger(PingScheduler.class);

    private final HttpClient httpClient;
    private final String pingUrl;

    public PingScheduler(@Value("${PING_URL:https://dead-and-wounded-backend-csc210.onrender.com/api/v1/health}") String pingUrl) {
        this.pingUrl = pingUrl;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Scheduled(fixedRate = 30000, initialDelay = 10000)
    public void pingSelf() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pingUrl))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                logger.info("Self-ping successful [{}] -> status 200 OK", pingUrl);
            } else {
                logger.warn("Self-ping returned status code [{}] for URL [{}]", response.statusCode(), pingUrl);
            }
        } catch (Exception e) {
            logger.error("Self-ping failed for URL [{}]: {}", pingUrl, e.getMessage());
        }
    }
}
