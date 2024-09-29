import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../slices/taskSlice.tsx"
import experimentReducer from "../slices/experimentSlice.tsx"

export const store=configureStore({
    reducer:{
        tasks:tasksReducer,
        experiment:experimentReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;