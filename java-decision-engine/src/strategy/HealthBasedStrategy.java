package strategy;

public class HealthBasedStrategy implements DecisionStrategy {

    @Override
    public String decide(int healthScore) {

        if (healthScore > 75)
            return "MONITOR";

        else if (healthScore >= 40)
            return "REPAIR";

        else
            return "REPLACE";
    }
}