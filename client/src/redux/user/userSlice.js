import { createSlice } from "@reduxjs/toolkit";


const initialState = {
     currentUser:null,
     error : null ,
     isLoading : false

};

const userSlice = createSlice({
      
    name : 'user',
    initialState ,

    reducers : {
       signInStart: (state)=>{
          state.isLoading = true;
       },

       signInSuccess : (state,action)=>{
           state.currentUser = action.payload;
           state.isLoading = false ;
           state.error = null ;

       },

       signInFailure : (state,action)=>{
             state.error = action.payload;
             state.isLoading = false ;
       },

       updateUserStart : (state)=>{
            state.isLoading = true;
       },

       updateUserSuccess : (state,action)=>{
            state.isLoading = false;
            state.currentUser = action.payload;
            state.error = null ;
       },

       updateUserFailure : (state,action)=>{
            state.error = action.payload;
            state.isLoading = false;
       },

       deleteUserStart : (state)=>{
            state.isLoading = true ;
       },

       deleteUserSuccess : (state)=>{
           state.currentUser = null;
           state.isLoading = false;
           state.error = null

       },

       deleteUserFailure : (state,action)=>{
            state.error = action.payload;
            state.isLoading = false;

       },

       signOutStart : (state)=>{
             state.isLoading = true;
       },

       signOutSuccess : (state)=>{
              state.currentUser = null;
              state.error =null;
              state.isLoading = false;
       },

       signOutFailure : (state,action)=>{
              state.error = action.payload;
              state.isLoading = false;


       },






    }


});


export const {
      signInFailure , 
      signInStart , 
      signInSuccess , 
      updateUserStart , 
      updateUserSuccess , 
      updateUserFailure , 
      deleteUserStart , 
      deleteUserSuccess , 
      deleteUserFailure , 
      signOutStart , 
      signOutSuccess , 
      signOutFailure
     
     } = userSlice.actions ;

export default userSlice.reducer;