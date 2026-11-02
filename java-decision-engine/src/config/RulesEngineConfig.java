package config;

/**
 * RulesEngineConfig - Singleton Pattern
 * Manages global system state, decision thresholds, and engine parameters across the JVM.
 */
public class RulesEngineConfig {

    private static volatile RulesEngineConfig instance;

    // Standard Asset Thresholds
    private int standardMonitorThreshold = 75;
    private int standardRepairThreshold = 40;

    // High Criticality Asset Thresholds (More conservative safety margins)
    private int highCriticalityMonitorThreshold = 85;
    private int highCriticalityRepairThreshold = 60;

    private int httpPort = 8080;

    // Private constructor for Singleton
    private RulesEngineConfig() {
        // Read potential environment variable overrides
        String portEnv = System.getenv("JAVA_ENGINE_PORT");
        if (portEnv != null) {
            try {
                this.httpPort = Integer.parseInt(portEnv);
            } catch (NumberFormatException ignored) {}
        }
    }

    /**
     * Thread-safe double-checked locking Singleton accessor.
     */
    public static RulesEngineConfig getInstance() {
        if (instance == null) {
            synchronized (RulesEngineConfig.class) {
                if (instance == null) {
                    instance = new RulesEngineConfig();
                }
            }
        }
        return instance;
    }

    public int getStandardMonitorThreshold() {
        return standardMonitorThreshold;
    }

    public void setStandardMonitorThreshold(int threshold) {
        this.standardMonitorThreshold = threshold;
    }

    public int getStandardRepairThreshold() {
        return standardRepairThreshold;
    }

    public void setStandardRepairThreshold(int threshold) {
        this.standardRepairThreshold = threshold;
    }

    public int getHighCriticalityMonitorThreshold() {
        return highCriticalityMonitorThreshold;
    }

    public void setHighCriticalityMonitorThreshold(int threshold) {
        this.highCriticalityMonitorThreshold = threshold;
    }

    public int getHighCriticalityRepairThreshold() {
        return highCriticalityRepairThreshold;
    }

    public void setHighCriticalityRepairThreshold(int threshold) {
        this.highCriticalityRepairThreshold = threshold;
    }

    public int getHttpPort() {
        return httpPort;
    }
}
