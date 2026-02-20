import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Parts from "./pages/Parts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/parts" element={<Parts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
