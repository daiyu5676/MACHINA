package model;

import java.time.Instant;

/**
 * DecisionResult - Value object encapsulating the decision outcome, reason, and metadata.
 */
public class DecisionResult {

    private final String assetId;
    private final String assetType;
    private final int healthScore;
    private final double failureProbability;
    private final String decision;
    private final String reason;
    private final String strategyUsed;
    private final String timestamp;

    public DecisionResult(
            String assetId,
            String assetType,
            int healthScore,
            double failureProbability,
            String decision,
            String reason,
            String strategyUsed
    ) {
        this.assetId = assetId;
        this.assetType = assetType;
        this.healthScore = healthScore;
        this.failureProbability = failureProbability;
        this.decision = decision;
        this.reason = reason;
        this.strategyUsed = strategyUsed;
        this.timestamp = Instant.now().toString();
    }

    public String getAssetId() {
        return assetId;
    }

    public String getAssetType() {
        return assetType;
    }

    public int getHealthScore() {
        return healthScore;
    }

    public double getFailureProbability() {
        return failureProbability;
    }

    public String getDecision() {
        return decision;
    }

    public String getReason() {
        return reason;
    }

    public String getStrategyUsed() {
        return strategyUsed;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public String toJson() {
        return "{"
                + "\"asset_id\":\"" + escape(assetId) + "\","
                + "\"asset_type\":\"" + escape(assetType) + "\","
                + "\"health_score\":" + healthScore + ","
                + "\"failure_probability\":" + failureProbability + ","
                + "\"decision\":\"" + escape(decision) + "\","
                + "\"reason\":\"" + escape(reason) + "\","
                + "\"strategy\":\"" + escape(strategyUsed) + "\","
                + "\"timestamp\":\"" + escape(timestamp) + "\""
                + "}";
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ").replace("\r", "");
    }
}
