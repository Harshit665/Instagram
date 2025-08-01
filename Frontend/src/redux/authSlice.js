import SuggestedUsers from "@/components/SuggestedUsers";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        SuggestedUsers:[],
        userProfile:null,
        selectedUser:null
    },
    reducers:{
        //actions
        setAuthUser:(state,action)=>{
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action)=>{
            state.SuggestedUsers = action.payload
        },
        setUserProfile:(state,action)=>{
            state.userProfile = action.payload
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload
        }
    }
});

export const {setAuthUser,setSuggestedUsers ,userProfile ,setUserProfile,setSelectedUser} = authSlice.actions;
export default authSlice.reducer;