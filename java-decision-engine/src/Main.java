import model.PredictionResult;
import strategy.HealthBasedStrategy;
import engine.DecisionEngine;

import java.nio.file.Files;
import java.nio.file.Paths;

public class Main {

    public static void main(String[] args) {

        try {

            String json = Files.readString(
                    Paths.get("../data/prediction.json")
            );

            double failureProbability =
                    extractDouble(json, "failure_probability");

            int healthScore =
                    (int) extractDouble(json, "health_score");

            PredictionResult result =
                    new PredictionResult(
                            failureProbability,
                            healthScore
                    );

            DecisionEngine engine =
                    new DecisionEngine(
                            new HealthBasedStrategy()
                    );

            String decision =
                    engine.makeDecision(
                            result.getHealthScore()
                    );

            System.out.println(
                    "Failure Probability: "
                    + result.getFailureProbability()
            );

            System.out.println(
                    "Health Score: "
                    + result.getHealthScore()
            );

            System.out.println(
                    "Maintenance Decision: "
                    + decision
            );

        } catch (Exception e) {
            System.out.println(
                    "Could not read prediction."
            );

            e.printStackTrace();
        }
    }

    private static double extractDouble(
            String json,
            String key
    ) {

        String search = "\"" + key + "\":";

        int start = json.indexOf(search)
                + search.length();

        int end = json.indexOf(",", start);

        if (end == -1) {
            end = json.indexOf("}", start);
        }

        return Double.parseDouble(
                json.substring(start, end).trim()
        );
    }
}