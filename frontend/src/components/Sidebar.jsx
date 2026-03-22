// import React, { useState, useEffect, useRef } from "react";
// import { sidebarStyles } from "../assets/dummyStyles";
// import { motion } from "framer-motion";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import { Home, ArrowUp, ArrowDown, User, HelpCircle, LogOut } from "lucide-react";

// const MENU_ITEMS = [
//   { text: "Dashboard", path: "/", icon: <Home size={20} /> },
//   { text: "Income", path: "/income", icon: <ArrowUp size={20} /> },
//   { text: "Expenses", path: "/expense", icon: <ArrowDown size={20} /> },
//   { text: "Profile", path: "/profile", icon: <User size={20} /> },
// ];

// const Sidebar = ({ user, isCollapsed, setIsCollapsed }) => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const sidebarRef = useRef(null);

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [activeHover, setActiveHover] = useState(null);

//   const { name: username = "User", email = "user@example.com" } = user || {};
//   const initial = username.charAt(0).toUpperCase();

//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? "hidden" : "auto";
//     return () => (document.body.style.overflow = "auto");
//   }, [mobileOpen]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         mobileOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target)
//       ) {
//         setMobileOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, [mobileOpen]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const toggleSidebar = () => setIsCollapsed((c) => !c);

//   const renderMenuItem = ({ text, path, icon }) => {
//     const isActive = pathname === path;

//     return (
//       <motion.li key={text} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//         <Link
//           to={path}
//           className={`${sidebarStyles.menuItem.base} ${
//             isActive
//               ? sidebarStyles.menuItem.active
//               : sidebarStyles.menuItem.inactive
//           } ${
//             isCollapsed
//               ? sidebarStyles.menuItem.collapsed
//               : sidebarStyles.menuItem.expanded
//           }`}
//           onMouseEnter={() => setActiveHover(text)}
//           onMouseLeave={() => setActiveHover(null)}
//         >
//           <span
//             className={
//               isActive
//                 ? sidebarStyles.menuIcon.active
//                 : sidebarStyles.menuIcon.inactive
//             }
//           >
//             {icon}
//           </span>

//           {!isCollapsed && <span>{text}</span>}

//           {activeHover === text && !isActive && !isCollapsed && (
//             <span className={sidebarStyles.activeIndicator}></span>
//           )}
//         </Link>
//       </motion.li>
//     );
//   };

//   return (
//     <motion.div
//       ref={sidebarRef}
//       className={sidebarStyles.sidebarContainer.base}
//       initial={{ x: -100, opacity: 0 }}
//       animate={{
//         x: 0,
//         opacity: 1,
//         width: isCollapsed ? 80 : 256,
//       }}
//       transition={{ type: "spring", damping: 25 }}
//     >
//       <div className={sidebarStyles.sidebarInner.base}>
        
//         {/* Toggle Button */}
//         <button
//           onClick={toggleSidebar}
//           className={sidebarStyles.toggleButton.base}
//         >
//           <motion.div
//             animate={{ rotate: isCollapsed ? 0 : 180 }}
//             transition={{ duration: 0.3 }}
//           >
//             ☰
//           </motion.div>
//         </button>

//         {/* Menu */}
//         <ul className="mt-5 space-y-2">
//           {MENU_ITEMS.map(renderMenuItem)}
//         </ul>

//       {/* Bottom Section */}
// <div className="mt-auto mb-4 px-2 space-y-2">

//   {/* Support */}
//   <motion.li
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//   >
//     <Link
//       to="/support"
//       className={`${sidebarStyles.menuItem.base} ${
//         sidebarStyles.menuItem.inactive
//       } ${
//         isCollapsed
//           ? sidebarStyles.menuItem.collapsed
//           : sidebarStyles.menuItem.expanded
//       }`}
//       onMouseEnter={() => setActiveHover("Support")}
//       onMouseLeave={() => setActiveHover(null)}
//     >
//       <span className={sidebarStyles.menuIcon.inactive}>
//         <HelpCircle size={20} />
//       </span>

//       {!isCollapsed && <span>Support</span>}

//       {activeHover === "Support" && !isCollapsed && (
//         <span className={sidebarStyles.activeIndicator}></span>
//       )}
//     </Link>
//   </motion.li>

//   {/* Logout */}
//   <motion.li
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//   >
//     <button
//       onClick={handleLogout}
//       className={`${sidebarStyles.menuItem.base} ${
//         sidebarStyles.menuItem.inactive
//       } ${
//         isCollapsed
//           ? sidebarStyles.menuItem.collapsed
//           : sidebarStyles.menuItem.expanded
//       } w-full text-left`}
//       onMouseEnter={() => setActiveHover("Logout")}
//       onMouseLeave={() => setActiveHover(null)}
//     >
//       <span className={sidebarStyles.menuIcon.inactive}>
//         <LogOut size={20} />
//       </span>

//       {!isCollapsed && <span>Logout</span>}

//       {activeHover === "Logout" && !isCollapsed && (
//         <span className={sidebarStyles.activeIndicator}></span>
//       )}
//     </button>
//   </motion.li>

// </div>

//       </div>
//     </motion.div>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect, useRef } from "react";
import { sidebarStyles } from "../assets/dummyStyles";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Home, ArrowUp, ArrowDown, User, HelpCircle, LogOut } from "lucide-react";

const MENU_ITEMS = [
  { text: "Dashboard", path: "/", icon: <Home size={20} /> },
  { text: "Income", path: "/income", icon: <ArrowUp size={20} /> },
  { text: "Expenses", path: "/expense", icon: <ArrowDown size={20} /> },
  { text: "Profile", path: "/profile", icon: <User size={20} /> },
];

const Sidebar = ({ user, isCollapsed, setIsCollapsed }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => setIsCollapsed((c) => !c);

  const renderMenuItem = ({ text, path, icon }) => {
    const isActive = pathname === path;

    return (
      <motion.li key={text} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to={path}
          className={`${sidebarStyles.menuItem.base} ${
            isActive
              ? sidebarStyles.menuItem.active
              : sidebarStyles.menuItem.inactive
          } ${
            isCollapsed
              ? sidebarStyles.menuItem.collapsed
              : sidebarStyles.menuItem.expanded
          }`}
          onMouseEnter={() => setActiveHover(text)}
          onMouseLeave={() => setActiveHover(null)}
        >
          <span
            className={
              isActive
                ? sidebarStyles.menuIcon.active
                : sidebarStyles.menuIcon.inactive
            }
          >
            {icon}
          </span>

          {!isCollapsed && <span>{text}</span>}

          {activeHover === text && !isActive && !isCollapsed && (
            <span className={sidebarStyles.activeIndicator}></span>
          )}
        </Link>
      </motion.li>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className={sidebarStyles.sidebarContainer.base}
        initial={{ x: -100, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          width: isCollapsed ? 80 : 256,
        }}
      >
        <div className={sidebarStyles.sidebarInner.base}>
          
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={sidebarStyles.toggleButton.base}
          >
            ☰
          </button>

          {/* Menu */}
          <ul className="mt-5 space-y-2">
            {MENU_ITEMS.map(renderMenuItem)}
          </ul>

          {/* Bottom Section */}
          <div className="mt-auto mb-4 px-2 space-y-2">

            {/* Support */}
            <motion.li whileHover={{ scale: 1.02 }}>
              <Link
                to="/support"
                className={`${sidebarStyles.menuItem.base} ${sidebarStyles.menuItem.inactive} ${
                  isCollapsed
                    ? sidebarStyles.menuItem.collapsed
                    : sidebarStyles.menuItem.expanded
                }`}
                onMouseEnter={() => setActiveHover("Support")}
                onMouseLeave={() => setActiveHover(null)}
              >
                <HelpCircle size={20} />
                {!isCollapsed && <span>Support</span>}
                {activeHover === "Support" && !isCollapsed && (
                  <span className={sidebarStyles.activeIndicator}></span>
                )}
              </Link>
            </motion.li>

            {/* Logout */}
            <motion.li whileHover={{ scale: 1.02 }}>
              <button
                onClick={handleLogout}
                className={`${sidebarStyles.menuItem.base} ${sidebarStyles.menuItem.inactive} ${
                  isCollapsed
                    ? sidebarStyles.menuItem.collapsed
                    : sidebarStyles.menuItem.expanded
                } w-full text-left`}
                onMouseEnter={() => setActiveHover("Logout")}
                onMouseLeave={() => setActiveHover(null)}
              >
                <LogOut size={20} />
                {!isCollapsed && <span>Logout</span>}
                {activeHover === "Logout" && !isCollapsed && (
                  <span className={sidebarStyles.activeIndicator}></span>
                )}
              </button>
            </motion.li>

          </div>
        </div>
      </motion.div>

      {/* Mobile Button */}
      <button
        className={sidebarStyles.mobileMenuButton}
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        ☰
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className={sidebarStyles.mobileOverlay}>
          <div
            className={sidebarStyles.mobileBackdrop}
            onClick={() => setMobileOpen(false)}
          ></div>

          <div className={sidebarStyles.mobileSidebar.base}>
            
            <div className={sidebarStyles.mobileHeader}>
              <span className="font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)}>✕</button>
            </div>

            <ul className="mt-5 space-y-2 px-4">
              {MENU_ITEMS.map(renderMenuItem)}
            </ul>

            <div className="mt-auto p-4 space-y-2">
              <div className={sidebarStyles.mobileFooterLink}>
                <HelpCircle size={20} />
                <span>Support</span>
              </div>

              <button
                onClick={handleLogout}
                className={sidebarStyles.mobileLogoutButton}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;