package strategy;

import config.RulesEngineConfig;

/**
 * StandardScoringStrategy - Strategy Pattern
 * Standard deterministic scoring rules for industrial equipment.
 * Thresholds: Health > 75: MONITOR, 40-75: REPAIR, < 40: REPLACE.
 */
public class StandardScoringStrategy implements DecisionStrategy {

    private final RulesEngineConfig config;

    public StandardScoringStrategy() {
        this.config = RulesEngineConfig.getInstance();
    }

    @Override
    public String decide(int healthScore) {
        if (healthScore > config.getStandardMonitorThreshold()) {
            return "MONITOR";
        } else if (healthScore >= config.getStandardRepairThreshold()) {
            return "REPAIR";
        } else {
            return "REPLACE";
        }
    }

    public String getReason(int healthScore) {
        if (healthScore > config.getStandardMonitorThreshold()) {
            return "Health score (" + healthScore + "/100) above standard threshold (" 
                    + config.getStandardMonitorThreshold() + "). Normal operational state.";
        } else if (healthScore >= config.getStandardRepairThreshold()) {
            return "Health score (" + healthScore + "/100) shows component degradation. Maintenance overhaul scheduled.";
        } else {
            return "Health score (" + healthScore + "/100) breached critical safety boundary (<" 
                    + config.getStandardRepairThreshold() + "). Immediate replacement required.";
        }
    }

    public String getStrategyName() {
        return "StandardScoringStrategy";
    }
}
