import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { UserSliceReducer } from './userSlice';
import { ProjectDetailsSliceReduser } from './projectSlice';

const store = configureStore({
    reducer: {
        user: UserSliceReducer,
        projectdetails: ProjectDetailsSliceReduser
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types
export type RootState = ReturnType<typeof store.getState>;
export default store;
