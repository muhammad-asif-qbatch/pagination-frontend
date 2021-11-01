//import { create } from '@mui/material/styles/createTransitions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
//import { update } from 'lodash';
import axios from '../axios-config';
const initialState = { 
    productList: [],
    productCount: 0,
    searchingText: " ",
    status: '',
    pagination: {
        page: 0,
        perPage: 10,
    },
    filters:{}
};
export const getProducts = createAsyncThunk(
    'product/getProduct',
    async (body, {getState}, thunkApi) => {
        try{
            console.log('Filter ',body);
            const filter = JSON.stringify(body);
            const { pagination } = getState().product;
            const paginate = JSON.stringify(pagination);
            //console.log("🚀 ~ file: product.js ~ line 22 ~ paginate", paginate)
            const response = await axios.get(`/products`,
            {
                params: {
                    pagination: paginate,
                    filter: filter
                }
            });
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
    async (id, {getState}, thunkApi) => {
        try{
            //const {status } = getState().product;
            const response = await axios.get(`products/${id}`);
            return  response.data;
        }
        catch(error){
            // console.log(error);
            return thunkApi.rejectWithValue({
                error: error.message
            });
        }
    }
);
// export const getProductsOnSearch = createAsyncThunk(
//     'product/getProductOnSearch',
//     async (id, thunkApi) => {
//         try{
//             const res = await axios.get(`products/v1/${id}`);
//             return res.data;
//         }
//         catch(error){
//             return thunkApi.rejectWithValue({
//                 error: error.message
//             })
//         }
//     }
// );

export const updateProducts = createAsyncThunk(
    'products/updateProducts',
    async (body, thunkApi) => {
        try{
            const {_id, asin} = body;
            const config = {
                method: 'PATCH',
                url: `products/${_id}`,
                data: {
                    asin
                }
            }
            const res = await axios(config);
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
            
        },
        setThePagination: (state, action) => {
            state.pagination = action.payload;
        },
        setTheFilter: (state, action) => {
            state.filters = action.payload;
        },
        // setPagination: (state, action) => {
        //     return {
        //         ...state,
        //         pagination: action.payload
        //     }
        // }
    },
    extraReducers:
    {
        [getProducts.fulfilled]: (state, action) => {
            state.productList = action.payload.productsData;
            state.productCount = action.payload.productsCount;
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
        [updateProducts.fulfilled]: (state) => {
            console.log('Update request accepted !');
        },
        [updateProducts.pending]: (state) => {
            console.log('Pending during updating the value')
        },
        [updateProducts.rejected]: (state) => {
            console.log('Update request is rejected! ');
        }
    },
});

export const {addToSearchingText, setThePagination, setTheFilter} = productSlice.actions;
export default productSlice.reducer;
