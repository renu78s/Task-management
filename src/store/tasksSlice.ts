import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../config/api";

export interface Task {
  id: string;
  text: string;
  done: boolean;
  starred: boolean;
}

interface ApiTask {
  _id: string;
  task: string;
  status: string;
}

interface TaskPayload {
  task: string;
  status: "pending" | "done";
}

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

// const sampleTasks: Task[] = [
//   { id: "sample-1", text: "Review project brief", done: false, starred: true },
//   { id: "sample-2", text: "Plan the next sprint", done: false, starred: false },
// ];

const initialState: TasksState = { items: [], loading: false, error: null };

export const fetchTasks = createAsyncThunk<Task[]>("tasks/fetchTasks", async () => {
  const response = await axios.get<{ data: ApiTask[] }>(baseUrl);
  return response.data.data.map(mapApiTask);
});

export const createTask = createAsyncThunk<Task, TaskPayload>(
  "tasks/createTask",
  async (payload) => {
    const response = await axios.post<{ data: ApiTask }>(`${baseUrl}/create`, payload);
    return mapApiTask(response.data.data);
  },
);

export const updateTask = createAsyncThunk<
  Task,
  { id: string; changes: Partial<TaskPayload> }
>("tasks/updateTask", async ({ id, changes }) => {
  const response = await axios.put<{ data: ApiTask }>(`${baseUrl}/${id}`, changes);
  return {
    ...mapApiTask(response.data.data),
    ...(changes.task ? { text: changes.task } : {}),
    ...(changes.status ? { done: changes.status === "done" } : {}),
  };
});

export const deleteTask = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (id) => {
    await axios.delete(`${baseUrl}/${id}`);
    return id;
  },
);

function mapApiTask(task: ApiTask): Task {
  return {
    id: task._id,
    text: task.task,
    done: task.status === "done",
    starred: false,
  };
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: { payload: Task }) => { state.items.unshift(action.payload); },
    toggleTaskDone: (state, action: { payload: string }) => {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) task.done = !task.done;
    },
    toggleTaskStar: (state, action: { payload: string }) => {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) task.starred = !task.starred;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? "Unable to load tasks"; })
      .addCase(createTask.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      });
  },
});

export const { addTask, toggleTaskDone, toggleTaskStar } = tasksSlice.actions;
export default tasksSlice.reducer;