package model;

public class PredictionResult {

    private double failureProbability;
    private int healthScore;

    public PredictionResult(double failureProbability, int healthScore) {
        this.failureProbability = failureProbability;
        this.healthScore = healthScore;
    }

    public double getFailureProbability() {
        return failureProbability;
    }

    public int getHealthScore() {
        return healthScore;
    }
}