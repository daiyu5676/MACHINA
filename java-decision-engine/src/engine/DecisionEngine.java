package engine;

import factory.AssetEvaluator;
import factory.AssetFactory;
import model.DecisionResult;
import observer.AnomalyNotifier;
import strategy.DecisionStrategy;
import strategy.HighCriticalityStrategy;
import strategy.StandardScoringStrategy;

/**
 * DecisionEngine - Core deterministic evaluation engine
 * Coordinates Strategy, Factory, and Observer patterns to generate actionable maintenance decisions.
 */
public class DecisionEngine {

    private DecisionStrategy strategy;
    private final AnomalyNotifier notifier;

    public DecisionEngine(DecisionStrategy strategy) {
        this.strategy = strategy;
        this.notifier = new AnomalyNotifier();
    }

    public DecisionEngine(DecisionStrategy strategy, AnomalyNotifier notifier) {
        this.strategy = strategy;
        this.notifier = (notifier != null) ? notifier : new AnomalyNotifier();
    }

    public AnomalyNotifier getNotifier() {
        return notifier;
    }

    /**
     * Backward-compatible simple decision evaluation.
     */
    public String makeDecision(int healthScore) {
        return strategy.decide(healthScore);
    }

    /**
     * Comprehensive evaluation pipeline returning a full DecisionResult.
     */
    public DecisionResult evaluate(String assetId, String assetType, String criticality, int healthScore, double failureProbability) {
        AssetEvaluator evaluator = AssetFactory.createAsset(assetId, assetType, criticality);
        DecisionStrategy boundStrategy = evaluator.getStrategy();

        String decision = boundStrategy.decide(healthScore);
        String reason;
        String strategyName;

        if (boundStrategy instanceof HighCriticalityStrategy) {
            HighCriticalityStrategy highCrit = (HighCriticalityStrategy) boundStrategy;
            reason = highCrit.getReason(healthScore);
            strategyName = highCrit.getStrategyName();
        } else if (boundStrategy instanceof StandardScoringStrategy) {
            StandardScoringStrategy standard = (StandardScoringStrategy) boundStrategy;
            reason = standard.getReason(healthScore);
            strategyName = standard.getStrategyName();
        } else {
            reason = "Standard deterministic threshold check: " + decision;
            strategyName = boundStrategy.getClass().getSimpleName();
        }

        DecisionResult result = new DecisionResult(
                evaluator.getAssetId(),
                evaluator.getAssetType(),
                healthScore,
                failureProbability,
                decision,
                reason,
                strategyName
        );

        // Notify observers if anomaly threshold is reached
        notifier.notifyAnomaly(result);

        return result;
    }
}