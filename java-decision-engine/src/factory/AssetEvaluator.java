package factory;

import strategy.DecisionStrategy;

/**
 * AssetEvaluator - Encapsulates asset identity and its bound scoring strategy.
 */
public class AssetEvaluator {

    private final String assetId;
    private final String assetType;
    private final String criticality;
    private final DecisionStrategy strategy;

    public AssetEvaluator(String assetId, String assetType, String criticality, DecisionStrategy strategy) {
        this.assetId = assetId;
        this.assetType = assetType;
        this.criticality = criticality;
        this.strategy = strategy;
    }

    public String getAssetId() {
        return assetId;
    }

    public String getAssetType() {
        return assetType;
    }

    public String getCriticality() {
        return criticality;
    }

    public DecisionStrategy getStrategy() {
        return strategy;
    }
}
