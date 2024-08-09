
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux' ;
import {signInSuccess , signInFailure , signInStart}   from '../redux/user/userSlice.js' ;

const SignIn = () => {

  const [formData , setFormData] = useState({});
  
  const {error , isLoading} = useSelector((state)=> state.user) ;
 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e)=>{
       setFormData({
        ...formData,
        [e.target.id] : e.target.value

       });

  };

  const handleSubmit =async (e)=>{
    e.preventDefault();
     try {
        dispatch(signInStart());
      const res = await fetch('/api/auth/signin',{
         method :'POST',
         headers :{
             'Content-Type' : 'application/json',

         },

         body : JSON.stringify(formData)

      });

      const data = await res.json();

      if(data.success === false){
         dispatch(signInFailure(data.message))
         return ;
    }

      dispatch(signInSuccess(data))
      navigate('/') ;
      
     } 

     catch (error) {
        dispatch(signInFailure(error.message));
     }


  };




  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit}  className='flex flex-col gap-4'>

         <input id='email' onChange={handleChange}
          type='email' placeholder='email' 
          className='border p-3 rounded-lg'
         
         />
         <input id='password' onChange={handleChange}
          type='password' placeholder='password' 
          className='border p-3 rounded-lg'
         
         />

        <button disabled={isLoading}
         className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95'>
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>

      </form>

      <div className='flex gap-2 mt-5'>
         <p> New user? Please register first </p> 

         <Link to={"/sign-up"}>
           <span className='text-blue-700'>Sign Up</span>
         
         </Link>
      </div>
       {error && <p className='text-red-900 mt-5'>{error}</p>}

      </div>
  )
}

export default SignIn