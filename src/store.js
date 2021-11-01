
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducer/product";

const store = configureStore({
    reducer: {
        product : productReducer
    }
})
export default store;