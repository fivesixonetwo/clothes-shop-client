import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    unAuthentication: false,
    error: null,
    success: null
}

const alertSlice = createSlice({
    name: "alert",
    initialState: initialState,
    reducers: {
        addError: (state, action) => {
            state.error = action.payload;
        },
        addSuccess: (state, action) => {
            state.success = action.payload;
        },
        unAuthentication: (state, action) => {
            state.unAuthentication = true;
            state.error = action.payload;
        },
        resetNotification: () => initialState
    }
});

export const {addSuccess, addError, resetNotification} = alertSlice.actions;
export default alertSlice.reducer;
