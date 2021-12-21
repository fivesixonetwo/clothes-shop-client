import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    isFetching: false,
    profile: null
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.isFetching = false;
        },
        getProfileSuccess: (state, action) => {
            state.profile = action.payload;
        },
        getProfileFailed: (state, action) => {
            state.profile = null;
        },
        logOut: () => initialState
    }
});

export const {loginStart, loginSuccess, loginFailure, getProfileSuccess, getProfileFailed, logOut} = userSlice.actions;
export default userSlice.reducer;
