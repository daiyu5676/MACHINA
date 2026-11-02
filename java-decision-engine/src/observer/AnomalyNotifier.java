package observer;

import model.DecisionResult;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * AnomalyNotifier - Observer Pattern Subject
 * Registers event listeners and broadcasts critical anomalies across system observers.
 */
public class AnomalyNotifier {

    private final List<AnomalyListener> listeners = new CopyOnWriteArrayList<>();

    public void addListener(AnomalyListener listener) {
        if (listener != null && !listeners.contains(listener)) {
            listeners.add(listener);
        }
    }

    public void removeListener(AnomalyListener listener) {
        listeners.remove(listener);
    }

    public void notifyAnomaly(DecisionResult result) {
        if ("REPLACE".equalsIgnoreCase(result.getDecision())) {
            for (AnomalyListener listener : listeners) {
                try {
                    listener.onCriticalAnomaly(result);
                } catch (Exception e) {
                    System.err.println("Error notifying listener: " + e.getMessage());
                }
            }
        } else if ("REPAIR".equalsIgnoreCase(result.getDecision())) {
            for (AnomalyListener listener : listeners) {
                try {
                    listener.onWarning(result);
                } catch (Exception e) {
                    System.err.println("Error notifying listener: " + e.getMessage());
                }
            }
        }
    }
}
