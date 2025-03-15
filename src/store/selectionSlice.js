import { createSlice } from "@reduxjs/toolkit";

const selectionSlice = createSlice({
    name: "selection",
    initialState: { indices: [] },
    reducers: {
        setSelection: (state, action) => {
            state.indices = action.payload;
        },
    },
});

export const { setSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
