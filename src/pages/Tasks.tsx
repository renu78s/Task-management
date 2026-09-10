import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar, { NAV_ITEMS } from "../components/Navbar";
import type { AppDispatch, RootState } from "../store";
import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTaskStar,
  updateTask,
} from "../store/tasksSlice";

const BG_URL =
  "https://images.unsplash.com/photo-1772767511365-c7a5036bd55c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920";

// --- Icons ---
const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const GridIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);
const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const HamburgerIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const MoreIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="5" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
  </svg>
);
const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#60cdff"
    strokeWidth="3"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SendIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v5M14 11v5" />
  </svg>
);
const EditIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

const Tasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeNav, setActiveNav] = useState("tasks");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const tasks = useSelector((state: RootState) => state.tasks.items);

  React.useEffect(() => {
    void dispatch(fetchTasks());
  }, [dispatch]);

  const activeTasks = tasks.filter((t) => !t.done);
  const completedTasks = tasks.filter((t) => t.done);
  const taskBadge = activeTasks.length;

  const addTask = (text?: string) => {
    const val = (text ?? inputValue).trim();
    if (!val) return;
    void dispatch(createTask({ task: val, status: "pending" }));
    setInputValue("");
    setAddingTask(false);
  };

  const toggleDone = (id: string, done: boolean) => {
    void dispatch(
      updateTask({ id, changes: { status: done ? "pending" : "done" } }),
    );
  };
  const toggleStar = (id: string) => dispatch(toggleTaskStar(id));
  const removeTask = (id: string) => {
    void dispatch(deleteTask(id));
  };
  const startEditing = (id: string, text: string) => {
    setEditingTaskId(id);
    setEditingText(text);
  };
  const saveEdit = (id: string) => {
    const text = editingText.trim();
    if (text) void dispatch(updateTask({ id, changes: { task: text } }));
    setEditingTaskId(null);
    setEditingText("");
  };
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const activeLabel =
    NAV_ITEMS.find((n) => n.id === activeNav)?.label ?? "Tasks";

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden bg-[#1f1f1f] font-sans">
        <Navbar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          taskBadge={taskBadge}
          drawerOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        {/* ── MAIN ── */}
        <main
          className="flex-1 relative flex flex-col overflow-hidden"
          style={{
            backgroundImage: `url(${BG_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          {/* ── MOBILE HEADER ── */}
          <header className="relative z-10 flex items-center justify-between px-4 py-3 md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-white p-1"
              aria-label="Open menu"
            >
              <HamburgerIcon />
            </button>
            <div className="flex items-center gap-2">
              <HomeIcon />
              <span className="text-white text-xl font-semibold">
                {activeLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <button className="p-1">
                <GridIcon />
              </button>
              <button className="p-1">
                <MoreIcon />
              </button>
            </div>
          </header>

          {/* ── DESKTOP HEADER ── */}
          <div className="relative z-10 px-6 pt-5 pb-2 hidden md:block">
            <h1 className="text-white text-2xl font-semibold drop-shadow">
              {activeLabel}
            </h1>
          </div>

          {/* ── TASK LIST ── */}
          <div className="relative z-10 px-4 flex-1 overflow-y-auto">
            {activeTasks.length > 0 && (
              <div className="rounded overflow-hidden mb-2">
                {activeTasks.map((task, i) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 px-4 py-3 bg-[#1e1e1e]/80 backdrop-blur-sm text-white
                    ${i < activeTasks.length - 1 ? "border-b border-white/10" : ""}`}
                  >
                    <button
                      onClick={() => toggleDone(task.id, task.done)}
                      className="w-5 h-5 rounded-full border border-[#888] flex items-center justify-center shrink-0 hover:border-[#60cdff] transition-colors"
                    />
                    {editingTaskId === task.id ? (
                      <input
                        autoFocus
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        onBlur={() => saveEdit(task.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") saveEdit(task.id);
                          if (event.key === "Escape") cancelEdit();
                        }}
                        className="flex-1 bg-transparent border-b border-[#60cdff] outline-none text-sm text-white"
                      />
                    ) : (
                      <span className="flex-1 text-sm text-[#e8e8e8]">
                        {task.text}
                      </span>
                    )}
                    <button
                      onClick={() => startEditing(task.id, task.text)}
                      className="shrink-0 text-[#777] hover:text-[#60cdff]"
                      aria-label={`Edit ${task.text}`}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => toggleStar(task.id)}
                      className={`shrink-0 transition-colors ${task.starred ? "text-[#60cdff]" : "text-[#777] hover:text-[#aaa]"}`}
                    >
                      <StarIcon filled={task.starred} />
                    </button>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="shrink-0 text-[#777] hover:text-red-400"
                      aria-label={`Delete ${task.text}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-[#aaa] px-1 mb-1 uppercase tracking-wider">
                  Completed
                </div>
                <div className="rounded overflow-hidden">
                  {completedTasks.map((task, i) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 px-4 py-3 bg-[#1e1e1e]/60 backdrop-blur-sm text-white
                      ${i < completedTasks.length - 1 ? "border-b border-white/10" : ""}`}
                    >
                      <button
                        onClick={() => toggleDone(task.id, task.done)}
                        className="w-5 h-5 rounded-full border border-[#60cdff] bg-[#60cdff]/20 flex items-center justify-center shrink-0"
                      >
                        <CheckIcon />
                      </button>
                      {editingTaskId === task.id ? (
                        <input
                          autoFocus
                          value={editingText}
                          onChange={(event) =>
                            setEditingText(event.target.value)
                          }
                          onBlur={() => saveEdit(task.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") saveEdit(task.id);
                            if (event.key === "Escape") cancelEdit();
                          }}
                          className="flex-1 bg-transparent border-b border-[#60cdff] outline-none text-sm text-white"
                        />
                      ) : (
                        <span className="flex-1 text-sm text-[#888] line-through">
                          {task.text}
                        </span>
                      )}
                      <button
                        onClick={() => startEditing(task.id, task.text)}
                        className="shrink-0 text-[#555] hover:text-[#60cdff]"
                        aria-label={`Edit ${task.text}`}
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => toggleStar(task.id)}
                        className={`shrink-0 transition-colors ${task.starred ? "text-[#60cdff]" : "text-[#555] hover:text-[#888]"}`}
                      >
                        <StarIcon filled={task.starred} />
                      </button>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="shrink-0 text-[#555] hover:text-red-400"
                        aria-label={`Delete ${task.text}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── DESKTOP ADD TASK INPUT ── */}
          <div className="relative z-10 px-4 pb-4 pt-2 hidden md:block">
            <div className="flex items-center gap-3 bg-[#1e1e1e]/80 backdrop-blur-sm rounded px-4 py-3">
              <button
                onClick={() => addTask()}
                // className="w-5 h-5 rounded-full border border-[#777] flex items-center justify-center shrink-0 hover:border-[#60cdff] transition-colors"
                className={`shrink-0 transition-colors ${inputValue != "" ? "text-[#60cdff]" : "text-[#555] hover:text-[#888]"}`}
              >
                <SendIcon />{" "}
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Try typing 'Pay utilities bill by Friday 6pm'"
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#666]"
              />
            </div>
          </div>

          {/* ── MOBILE ADD TASK BAR ── */}
          <div className="relative z-10 md:hidden">
            {addingTask ? (
              <div className="flex items-center gap-3 bg-[#1e1e1e]/95 backdrop-blur-sm px-4 py-3 border-t border-white/10">
                <button
                  onClick={() => addTask()}
                  className="w-5 h-5 rounded-full border border-[#777] flex items-center justify-center shrink-0"
                />
                <input
                  autoFocus
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTask();
                    if (e.key === "Escape") {
                      setAddingTask(false);
                      setInputValue("");
                    }
                  }}
                  placeholder="Try typing 'Pay utilities bill by Friday 6pm'"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#555]"
                />
                <button
                  onClick={() => {
                    setAddingTask(false);
                    setInputValue("");
                  }}
                  className="text-[#888] text-xs px-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingTask(true)}
                className="w-full flex items-center gap-3 bg-[#1a1a1a]/90 backdrop-blur-sm px-4 py-4 border-t border-white/10 text-white"
              >
                <PlusIcon />
                <span className="text-sm">Add a task</span>
              </button>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Tasks;
