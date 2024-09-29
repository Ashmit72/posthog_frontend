import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface TaskState {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const initialState: TaskState[] = [];

function customJwtDecode(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export const postTasks = createAsyncThunk("tasks/postTasks", async (task: TaskState) => {
  const token = Cookies.get("task_token"); // Get the token from cookies
  const decodedToken = customJwtDecode(token as string); // Decode the JWT
  const id = decodedToken.userId; // Extract the userId
  const response = await fetch(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    console.log("Something Went Wrong");
  }
  return task;
});

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const token = Cookies.get("task_token"); // Get the token from cookies
  const decodedToken = customJwtDecode(token as string); // Decode the JWT
  const id = decodedToken.userId; // Extract the userId

  const response = await fetch(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    console.log("Something Went Wrong");
  }
  const data = await response.json();
  return data.tasks;
});

export const deleteTask = createAsyncThunk("tasks/deleteTasks", async (tid: number) => {
  const token = Cookies.get("task_token"); // Get the token from cookies
  const decodedToken = customJwtDecode(token as string); // Decode the JWT
  const id = decodedToken.userId; // Extract the userId
  const response = await fetch(`/tasks/${id}/${tid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    method: "DELETE",
  });
  if (!response.ok) {
    console.log("Something Went Wrong");
  }
  return tid; // Return the id of the deleted task
});

export const patchTask = createAsyncThunk("tasks/updateTasks", async (task: TaskState) => {
  const token = Cookies.get("task_token"); // Get the token from cookies
  const decodedToken = customJwtDecode(token as string); // Decode the JWT
  const id = decodedToken.userId; // Extract the userId
  const response = await fetch(`/tasks/${id}/${task.id}`, {
    method: "PATCH", // Use PATCH if necessary
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  return data; // Return the updated task data
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    createTasks(state, action) {
      state.push({
        id: action.payload.id,
        title: action.payload.title,
        description: action.payload.description,
        completed: false,
      });
    },
    updateTasks(state, action) {
      return state.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              title: action.payload.title,
              description: action.payload.description,
              completed: action.payload.completed,
            }
          : task
      );
    },
    deleteTasks(state, action) {
      const filteredTasks = state.filter((task) => task.id != action.payload);
      return filteredTasks;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (_, action) => {
      return action.payload;
    });
    builder.addCase(patchTask.fulfilled, (state, action) => {
      return state.map((task) => {
        const newTask = { ...task, ...action.payload }; // Update task with new data
        return newTask;
      });
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    });
    builder.addCase(postTasks.fulfilled, (state, action) => {
      state.push(action.payload);
    });
  },
});
export const { createTasks, updateTasks, deleteTasks } = taskSlice.actions;
export default taskSlice.reducer;
