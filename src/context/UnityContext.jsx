import { createContext, useContext, useState } from "react";
import { useUnityContext } from "react-unity-webgl";

const UnityCtx = createContext(null);

const BUILD_PATH = "/unity/Builds";

export function UnityProvider({ children }) {
  const [splashDone, setSplashDone] = useState(false);

  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    addEventListener,
    removeEventListener,
    sendMessage,
  } = useUnityContext({
    loaderUrl: `${BUILD_PATH}.loader.js`,
    dataUrl: `${BUILD_PATH}.data`,
    frameworkUrl: `${BUILD_PATH}.framework.js`,
    codeUrl: `${BUILD_PATH}.wasm`,
  });

  return (
    <UnityCtx.Provider value={{
      unityProvider,
      isLoaded,
      loadingProgression,
      addEventListener,
      removeEventListener,
      sendMessage,
      splashDone,
      setSplashDone,
    }}>
      {children}
    </UnityCtx.Provider>
  );
}

export function useUnity() {
  return useContext(UnityCtx);
}
