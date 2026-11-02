import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import config.RulesEngineConfig;
import engine.DecisionEngine;
import model.DecisionResult;
import observer.ConsoleAnomalyListener;
import strategy.StandardScoringStrategy;
import util.JsonUtil;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;

/**
 * Server - HTTP REST microservice wrapper for the Java Decision Engine.
 * Built with Java 17 com.sun.net.httpserver (zero external dependencies).
 */
public class Server {

    public static void main(String[] args) {
        RulesEngineConfig config = RulesEngineConfig.getInstance();
        int port = config.getHttpPort();

        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // Initialize Decision Engine with Console Observer
            DecisionEngine engine = new DecisionEngine(new StandardScoringStrategy());
            engine.getNotifier().addListener(new ConsoleAnomalyListener());

            // Routes
            server.createContext("/health", new HealthHandler());
            server.createContext("/decide", new DecideHandler(engine));

            server.setExecutor(Executors.newFixedThreadPool(10));
            server.start();

            System.out.println("Machina Java Decision Engine running on http://localhost:" + port);
            System.out.println("Endpoints: GET /health | POST /decide");

        } catch (IOException e) {
            System.err.println("Failed to start Java Decision Engine server: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    /**
     * Health check endpoint
     */
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String response = "{\"status\":\"UP\",\"service\":\"Machina Java Decision Engine\"}";
            sendJsonResponse(exchange, 200, response);
        }
    }

    /**
     * Decision endpoint
     */
    static class DecideHandler implements HttpHandler {
        private final DecisionEngine engine;

        public DecideHandler(DecisionEngine engine) {
            this.engine = engine;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                return;
            }

            try {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

                String assetId = JsonUtil.extractString(body, "asset_id", "UNKNOWN-ASSET");
                String assetType = JsonUtil.extractString(body, "asset_type", "Bearing");
                String criticality = JsonUtil.extractString(body, "criticality", "STANDARD");
                int healthScore = JsonUtil.extractInt(body, "health_score", 100);
                double failureProbability = JsonUtil.extractDouble(body, "failure_probability", 0.0);

                DecisionResult result = engine.evaluate(assetId, assetType, criticality, healthScore, failureProbability);

                sendJsonResponse(exchange, 200, result.toJson());

            } catch (Exception e) {
                System.err.println("Error processing decision request: " + e.getMessage());
                sendJsonResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
            }
        }
    }

    private static void setCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
