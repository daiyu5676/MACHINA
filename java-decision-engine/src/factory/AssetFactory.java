package factory;

import strategy.DecisionStrategy;
import strategy.HighCriticalityStrategy;
import strategy.StandardScoringStrategy;

/**
 * AssetFactory - Factory Pattern
 * Creates asset evaluators without coupling callers to concrete strategy implementations.
 */
public class AssetFactory {

    /**
     * Creates an asset evaluator based on asset type and criticality.
     * Tier-1 assets (e.g. Engine, High-Voltage Motor) or explicit HIGH criticality
     * are bound to HighCriticalityStrategy.
     */
    public static AssetEvaluator createAsset(String assetId, String assetType, String criticality) {
        String safeType = (assetType != null && !assetType.isBlank()) ? assetType.trim() : "Bearing";
        String safeCriticality = (criticality != null && !criticality.isBlank()) ? criticality.trim().toUpperCase() : "STANDARD";

        DecisionStrategy strategy;
        if ("HIGH".equalsIgnoreCase(safeCriticality) || "Engine".equalsIgnoreCase(safeType)) {
            strategy = new HighCriticalityStrategy();
        } else {
            strategy = new StandardScoringStrategy();
        }

        return new AssetEvaluator(assetId != null ? assetId : "UNKNOWN-ASSET", safeType, safeCriticality, strategy);
    }
}
