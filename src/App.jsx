import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Parts from "./pages/Parts";
import Viewer from "./pages/Viewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/viewer" element={<Viewer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
