

import React, { useState } from "react";
import { styles } from "../assets/dummyStyles";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar"; // ✅ correct import
import { Outlet } from "react-router-dom";

const Layout = ({ onLogout, user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.layout.root}>
      {/* Sidebar */}
      <Sidebar
        user={user}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main content */}
      <div className={styles.layout.main}>
        <Navbar user={user} onLogout={onLogout} />
        <Outlet /> {/* ✅ important */}
      </div>
    </div>
  );
};

export default Layout;
