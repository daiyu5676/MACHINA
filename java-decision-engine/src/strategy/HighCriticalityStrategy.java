package strategy;

import config.RulesEngineConfig;

/**
 * HighCriticalityStrategy - Strategy Pattern
 * Conservative decision rules for high-criticality assets (e.g. main engines, high-pressure compressors).
 * Enforces stricter safety limits: Health > 85: MONITOR, 60-85: REPAIR, < 60: REPLACE.
 */
public class HighCriticalityStrategy implements DecisionStrategy {

    private final RulesEngineConfig config;

    public HighCriticalityStrategy() {
        this.config = RulesEngineConfig.getInstance();
    }

    @Override
    public String decide(int healthScore) {
        if (healthScore > config.getHighCriticalityMonitorThreshold()) {
            return "MONITOR";
        } else if (healthScore >= config.getHighCriticalityRepairThreshold()) {
            return "REPAIR";
        } else {
            return "REPLACE";
        }
    }

    public String getReason(int healthScore) {
        if (healthScore > config.getHighCriticalityMonitorThreshold()) {
            return "High-criticality asset operating at safe health (" + healthScore + "/100). Continuous telemetry monitoring.";
        } else if (healthScore >= config.getHighCriticalityRepairThreshold()) {
            return "High-criticality asset has fallen below strict tolerance (" + healthScore 
                    + "/100). Preventive repair required before catastrophic failure.";
        } else {
            return "Critical safety breach on tier-1 asset! Health score (" + healthScore 
                    + "/100) below emergency shutdown limit (" + config.getHighCriticalityRepairThreshold() + "). Emergency replacement mandated.";
        }
    }

    public String getStrategyName() {
        return "HighCriticalityStrategy";
    }
}
