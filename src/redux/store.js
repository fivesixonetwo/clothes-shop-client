import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./userRedux";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE,} from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from 'redux-thunk';
import alertRedux from "./alertRedux";
import cartRedux from "./cartRedux";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: ["alert"]
};

const rootReducer = combineReducers({user: userReducer, alert: alertRedux, cart: cartRedux});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(thunk),
});

export const persistor = persistStore(store);
