import { createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';


export interface UserDetailState {
    loading: boolean;
    user: User | null | undefined;
    CompanyDetails: null | CompanyDetailsType
}

// export const auth = getAuth(app);

const initialState: UserDetailState = {
    loading: true,
    user: undefined,
    CompanyDetails: null
};

export const UserSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setCompanyDetails: (state, action) => {
            state.CompanyDetails = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});


export const { setUser, setCompanyDetails, setLoading } = UserSlice.actions;

export const UserSliceReducer = UserSlice.reducer;

export interface CompanyDetailsType {
    city: string
    companyLogo: string | File
    country: string
    state: string
    address: string
    phone: string
    email: string
    name: string
};