import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    items: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        add: (state, action) => {
            state.items = state.items.concat(action.payload);
        },
        remove: (state, action) => {
            state.items = state.items.filter(cart => cart.id !== action.payload.id);
        }
    }
});

export const {add, remove} = cartSlice.actions;
export default cartSlice.reducer;
