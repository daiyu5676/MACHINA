public class DecisionEngine {

    public static String makeDecision(double healthScore) {

        if (healthScore > 75) {
            return "MONITOR";
        }
        else if (healthScore >= 40) {
            return "REPAIR";
        }
        else {
            return "REPLACE";
        }
    }

    public static void main(String[] args) {

        double healthScore = 11;

        String decision = makeDecision(healthScore);

        System.out.println("Health Score: " + healthScore);
        System.out.println("Maintenance Decision: " + decision);
    }
}