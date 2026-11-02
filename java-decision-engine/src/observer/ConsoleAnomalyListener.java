package observer;

import model.DecisionResult;

/**
 * ConsoleAnomalyListener - Concrete Observer implementation
 * Logs high-priority telemetry breaches with formatted industrial audit messages.
 */
public class ConsoleAnomalyListener implements AnomalyListener {

    @Override
    public void onCriticalAnomaly(DecisionResult result) {
        System.err.println(
                "[ALERT - CRITICAL BREACH] Asset " + result.getAssetId() 
                + " (" + result.getAssetType() + ") requires EMERGENCY ACTION: " 
                + result.getDecision() + " | Health: " + result.getHealthScore() 
                + "/100 | Reason: " + result.getReason()
        );
    }

    @Override
    public void onWarning(DecisionResult result) {
        System.out.println(
                "[WARN - DEGRADATION] Asset " + result.getAssetId() 
                + " (" + result.getAssetType() + ") requires ATTENTION: " 
                + result.getDecision() + " | Health: " + result.getHealthScore() 
                + "/100 | Reason: " + result.getReason()
        );
    }
}
