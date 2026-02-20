import { useState } from "react";
import PartsList from "../components/PartsList";
import PartViewer from "../components/PartViewer";

function Parts() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePartUpdated = (updated) => {
    setSelectedPart(updated);
    setRefreshKey(k => k + 1); // triggers PartsList to re-fetch
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <PartsList
        key={refreshKey}
        selectedPart={selectedPart}
        onSelectPart={setSelectedPart}
      />
      <PartViewer
        selectedPart={selectedPart}
        onPartUpdated={handlePartUpdated}
      />
    </div>
  );
}

export default Parts;
