package observer;

import model.DecisionResult;

/**
 * AnomalyListener - Observer Pattern Interface
 * Handlers implementing this interface receive real-time notifications on threshold breaches.
 */
public interface AnomalyListener {
    void onCriticalAnomaly(DecisionResult result);
    void onWarning(DecisionResult result);
}
