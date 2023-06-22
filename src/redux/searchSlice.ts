import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    shouldFetch: false
};

export const SearchSlice = createSlice({
    name: 'Search',
    initialState,
    reducers: {
        setShouldFetchHits: (state, action) => {
            state.shouldFetch = action.payload
        }
    },
});


export const { setShouldFetchHits } = SearchSlice.actions;

export const SearchSliceReduser = SearchSlice.reducer;
