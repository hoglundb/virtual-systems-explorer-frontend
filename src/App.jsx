import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Unity } from "react-unity-webgl";
import { AuthProvider } from "./context/AuthContext";
import { UnityProvider, useUnity } from "./context/UnityContext";
import { SplashScreen } from "./components/UnityViewer";
import { NAV_HEIGHT } from "./components/ViewerNav";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Parts from "./pages/Parts";
import Viewer from "./pages/Viewer";
import Procedures from "./pages/Procedures";

const UNITY_ROUTES = new Set(["/viewer", "/procedures"]);

function UnityCanvas() {
  const { unityProvider, isLoaded, splashDone, setSplashDone } = useUnity();
  const location = useLocation();
  const visible = UNITY_ROUTES.has(location.pathname);

  return (
    <>
      {visible && !splashDone && (
        <SplashScreen
          onDone={() => setSplashDone(true)}
          isLoaded={isLoaded}
        />
      )}
      <div style={{
        position: "fixed",
        top: NAV_HEIGHT, right: 0, bottom: 0, left: 0,
        background: "rgb(8, 15, 25)",
        visibility: visible && splashDone ? "visible" : "hidden",
        zIndex: visible ? 1 : -1,
      }}>
        <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UnityProvider>
          <UnityCanvas />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/parts" element={<Parts />} />
                <Route path="/procedures" element={<Procedures />} />
              </Route>
            </Route>
          </Routes>
        </UnityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
