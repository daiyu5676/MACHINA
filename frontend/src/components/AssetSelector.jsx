/*
  AssetSelector — dropdown to pick an asset for the dashboard.
  Shows asset ID, name, and last analysis time.
*/

function AssetSelector({ assets, selectedId, onSelect }) {
  const selected = assets.find(a => a.id === selectedId);

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric"
    }) + " · " + d.toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="asset-selector">
      <div className="asset-selector-left">
        <span className="asset-selector-label">ASSET</span>
        <select
          className="asset-selector-dropdown"
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
        >
          {assets.map(asset => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="asset-selector-right">
          <span className="asset-selector-meta">
            Last Analysis {formatTime(selected.lastAnalysis)}
          </span>
        </div>
      )}
    </div>
  );
}

export default AssetSelector;
