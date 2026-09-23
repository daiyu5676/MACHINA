package engine;

import strategy.DecisionStrategy;

public class DecisionEngine {

    private DecisionStrategy strategy;

    public DecisionEngine(DecisionStrategy strategy) {
        this.strategy = strategy;
    }

    public String makeDecision(int healthScore) {
        return strategy.decide(healthScore);
    }
}