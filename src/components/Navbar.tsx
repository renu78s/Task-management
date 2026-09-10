import React from "react";

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const SunIcon = () => <span>☼</span>;
const StarIcon = () => <span>☆</span>;
const GridIcon = () => <span>▦</span>;
const UserIcon = () => <span>♙</span>;
const HomeIcon = () => <span>⌂</span>;
const LightbulbIcon = () => <span>♧</span>;
const ListIcon = () => <span>☷</span>;
const PlusIcon = () => <span>＋</span>;

export const NAV_ITEMS = [
  { id: "myday", label: "My Day", icon: <SunIcon /> },
  { id: "important", label: "Important", icon: <StarIcon /> },
  { id: "planned", label: "Planned", icon: <GridIcon /> },
  { id: "assigned", label: "Assigned to me", icon: <UserIcon /> },
  { id: "tasks", label: "Tasks", icon: <HomeIcon />, hasBadge: true },
  { id: "getting-started", label: "Getting started", icon: <LightbulbIcon /> },
  { id: "groceries", label: "Groceries", icon: <ListIcon /> },
];

interface NavbarProps {
  activeNav: string;
  setActiveNav: (id: string) => void;
  taskBadge: number;
  drawerOpen: boolean;
  onClose: () => void;
}

function SidebarContent({
  activeNav,
  setActiveNav,
  taskBadge,
  onClose,
}: Omit<NavbarProps, "drawerOpen">) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-[#2d2d2d] rounded px-3 py-1.5 text-[#999] text-sm">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none placeholder-[#888] text-[#c8c8c8] w-full text-sm"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveNav(item.id);
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded mx-1 my-0.5 transition-colors ${activeNav === item.id ? "bg-[#2d2d2d] text-white" : "hover:bg-[#2a2a2a] text-[#c8c8c8]"}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-lg leading-none ${activeNav === item.id ? "text-[#60cdff]" : ""}`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
            {item.hasBadge && taskBadge > 0 && (
              <span className="text-xs text-[#c8c8c8]">{taskBadge}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="border-t border-white/10 px-3 py-3">
        <button className="flex items-center gap-3 text-[#c8c8c8] hover:text-white text-sm w-full px-1 py-1">
          <PlusIcon />
          <span>New list</span>
        </button>
      </div>
    </div>
  );
}

export default function Navbar(props: NavbarProps) {
  return (
    <>
      <aside className="hidden md:flex w-[220px] min-w-[220px] flex-col bg-[#1f1f1f] text-[#c8c8c8] border-r border-white/5">
        <SidebarContent {...props} />
      </aside>
      {props.drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={props.onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full z-50 w-[270px] bg-[#1f1f1f] text-[#c8c8c8] transition-transform duration-300 md:hidden ${props.drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent {...props} />
      </div>
    </>
  );
}
