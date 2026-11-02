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
    <div className="flex justify-between items-center bg-white border border-[#CDD2D6] rounded-[6px] px-[18px] py-3 mb-5 max-md:flex-col max-md:items-start max-md:gap-2.5">
      <div className="flex items-center gap-[14px]">
        <span className="text-[10px] font-semibold tracking-[0.12em] text-[#60727D] uppercase">
          ASSET
        </span>
        <select
          className="bg-[#F5F6F7] border border-[#CDD2D6] rounded text-[#17191B] px-3 py-1.5 text-[13px] font-medium cursor-pointer outline-none focus:border-[#315D72]"
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
        <div>
          <span className="text-xs text-[#7B858C] font-mono font-normal tracking-[-0.01em]">
            Last Analysis {formatTime(selected.lastAnalysis)}
          </span>
        </div>
      )}
    </div>
  );
}

export default AssetSelector;
