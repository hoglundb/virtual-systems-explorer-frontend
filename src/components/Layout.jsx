import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", color: "white" }}>
      <Outlet />
    </div>
  );
}

export default Layout;
