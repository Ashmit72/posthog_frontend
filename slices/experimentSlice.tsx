import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("experimental_feature") 
  ? JSON.parse(localStorage.getItem("experimental_feature")!) 
  : false;

const experimentSlice = createSlice({
  name: 'experiment',
  initialState,
  reducers: {
    updateView(state) {
      const newView = !state;
      localStorage.setItem('experimental_feature', JSON.stringify(newView));
      return newView;
    }
  }
});

export const { updateView } = experimentSlice.actions;
export default experimentSlice.reducer;
