import config.RulesEngineConfig;
import engine.DecisionEngine;
import model.DecisionResult;
import model.PredictionResult;
import observer.ConsoleAnomalyListener;
import strategy.HealthBasedStrategy;

import java.nio.file.Files;
import java.nio.file.Paths;

public class Main {

    public static void main(String[] args) {

        try {
            // Demonstrate Singleton configuration
            RulesEngineConfig config = RulesEngineConfig.getInstance();
            System.out.println("Rules Engine Initialized (Standard Monitor Threshold: " + config.getStandardMonitorThreshold() + ")");

            String json = Files.readString(
                    Paths.get("../data/prediction.json")
            );

            double failureProbability = extractDouble(json, "failure_probability");
            int healthScore = (int) Math.round(extractDouble(json, "health_score"));

            PredictionResult pred = new PredictionResult(failureProbability, healthScore);

            // Decision Engine with Observer
            DecisionEngine engine = new DecisionEngine(new HealthBasedStrategy());
            engine.getNotifier().addListener(new ConsoleAnomalyListener());

            // Comprehensive OOP evaluation
            DecisionResult result = engine.evaluate(
                    "CLI-ASSET",
                    "Bearing",
                    "STANDARD",
                    pred.getHealthScore(),
                    pred.getFailureProbability()
            );

            System.out.println("=========================================");
            System.out.println("       MACHINA DECISION ENGINE (CLI)     ");
            System.out.println("=========================================");
            System.out.println("Failure Probability: " + result.getFailureProbability());
            System.out.println("Health Score:        " + result.getHealthScore());
            System.out.println("Maintenance Decision:" + result.getDecision());
            System.out.println("Strategy Used:       " + result.getStrategyUsed());
            System.out.println("Reason:              " + result.getReason());
            System.out.println("=========================================");

        } catch (Exception e) {
            System.out.println("Could not read prediction file. Running with default sample...");
            DecisionEngine engine = new DecisionEngine(new HealthBasedStrategy());
            engine.getNotifier().addListener(new ConsoleAnomalyListener());
            DecisionResult sample = engine.evaluate("SAMPLE-ASSET", "Bearing", "STANDARD", 35, 0.82);
            System.out.println("Sample Decision: " + sample.getDecision() + " | Reason: " + sample.getReason());
        }
    }

    private static double extractDouble(String json, String key) {
        String search = "\"" + key + "\":";
        int start = json.indexOf(search) + search.length();
        int end = json.indexOf(",", start);
        if (end == -1) {
            end = json.indexOf("}", start);
        }
        return Double.parseDouble(json.substring(start, end).trim());
    }
}