import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    items: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        addNew: (state, action) => {
            if (state.items.length === 0) {
                action.payload.quantity = 1;
                state.items = state.items.concat(action.payload);
            } else {
                if (!action.payload.selectedVariant) return;
                const foundIndex = state.items.findIndex(product => product.selectedVariant.id === action.payload.selectedVariant.id);
                if (foundIndex === -1) {
                    action.payload.quantity = action.payload.quantity || 1;
                    state.items = state.items.concat(action.payload);
                } else {
                    state.items[foundIndex].quantity += action.payload.quantity || 1;
                }
            }
        },
        remove: (state, action) => {
            state.items = state.items.filter(product => product.selectedVariant.id !== action.payload.selectedVariant.id);
        },
        editQuantity: (state, action) => {
            if (!action.payload.old || !action.payload.old.selectedVariant) return;
            const foundIndex = state.items.findIndex(product => product.selectedVariant.id === action.payload.old.selectedVariant.id);
            if (foundIndex !== -1) {
                state.items[foundIndex].quantity = action.payload.quantity;
            }
        },
        resetCart: () => initialState
    }
});

export const {addNew, remove, editQuantity, resetCart} = cartSlice.actions;
export default cartSlice.reducer;
