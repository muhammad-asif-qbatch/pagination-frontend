//import { create } from '@mui/material/styles/createTransitions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios-config';
const initialState = { 
    productList: [],
    searchingText: " ",
    status: ''
};
export const getProducts = createAsyncThunk(
    'product/getProduct',
    async (body, thunkApi) => {
        try{
            console.log('Body: ', body)
            const response = await axios.get("/products");
            const data = await response.data;
            return data;
        }
        catch(error){
            console.log(error);
            return thunkApi.rejectWithValue({
                error: error.message
            });
        }
    }
);
export const getSingleProduct = createAsyncThunk(
    'product/getSpecificProduct',
    async (id, thunkApi) => {
        try{
            const response = await axios.get(`products/${id}`);
            return  response.data;
        }
        catch(error){
            console.log(error);
            return thunkApi.rejectWithValue({
                error: error.message
            });
        }
    }
);
export const getProductsOnSearch = createAsyncThunk(
    'product/getProductOnSearch',
    async (id, thunkApi) => {
        try{
            const res = await axios.get(`products/${id}`);
            return res.data;
        }
        catch(error){
            return thunkApi.rejectWithValue({
                error: error.message
            })
        }
    }
);
export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers:{
        addToSearchingText : (state, action) => {
            state.searchingText = action.payload;
        }
    },
    extraReducers:
    {
        [getProducts.fulfilled]: (state, action) => {
            state.productList = action.payload;
            console.log('state.productList: ', state.productList);
        },
        [getProducts.pending]: (state) => {
            console.log('pending');
        },
        [getProducts.rejected]: (state) => {
            console.log('rejected');
        },
        [getSingleProduct.fulfilled]: (state, action) => {
            state.productDescription = action.payload[0].description;
        },
        [getSingleProduct.rejected]: (state, action) => {
            console.log(action.payload)
        },
        [getSingleProduct.pending]: (state, action) => {
            console.log(action.payload)
        },
        [getProductsOnSearch.fulfilled]:(state, action) => {
            state.productList = action.payload;
            state.status = "success"
        },
        [getProductsOnSearch.rejected]:(state, action) => {
            state.status = "failed";
        },
        [getProductsOnSearch.pending]: (state, action) => {
            state.status = "pending"
        }
    },
});

export const {addToSearchingText} = productSlice.actions;
export default productSlice.reducer;
