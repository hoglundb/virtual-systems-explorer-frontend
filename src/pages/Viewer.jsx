import { useEffect, useCallback } from "react";
import { useUnity } from "../context/UnityContext";
import ViewerNav from "../components/ViewerNav";

function Viewer() {
  const { isLoaded, sendMessage, addEventListener, removeEventListener } = useUnity();

  useEffect(() => {
    if (isLoaded) {
      sendMessage("SceneLoader", "LoadScene", "AssemblyExplorerScene");
    }
  }, [isLoaded, sendMessage]);

  const handlePartClick = useCallback(() => {}, []);

  const handleProcedureStep = useCallback((step) => {}, []);

  useEffect(() => {
    addEventListener("OnPartClicked", handlePartClick);
    addEventListener("OnProcedureStep", handleProcedureStep);
    return () => {
      removeEventListener("OnPartClicked", handlePartClick);
      removeEventListener("OnProcedureStep", handleProcedureStep);
    };
  }, [addEventListener, removeEventListener, handlePartClick, handleProcedureStep]);

  return <ViewerNav title="Virtual Systems Explorer: Flat Track 650" />;
}

export default Viewer;
