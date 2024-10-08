import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData , setFormData] = useState({});
  const [error , setError] = useState(null);
  const [isLoading , setIsLoading]=useState(false); 
  const navigate = useNavigate();

  const handleChange = (e)=>{

     setFormData({
        ...formData,
        [e.target.id] : e.target.value

     });

  };

  const handleSubmit =async (e)=>{
    e.preventDefault();
      try {
        
        setIsLoading(true);
        const res = await fetch('/api/auth/signup',{
          method: 'POST',
          headers:{
             'Content-Type' : 'application/json',
          },
          body: JSON.stringify(formData)
        });
  
        const data = await res.json();
  
        if(data.success === false){
            setIsLoading(false);
            setError(data.message);
            
            return ;
        }
  
        setIsLoading(false);   
        setError(null); 
        navigate('/sign-in');
      } 
      catch (error) {
        setIsLoading(false);
        setError(error.message);
        
      }

      
  };

 

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit}
         className='flex flex-col gap-4'>
         <input id='username' onChange={handleChange}
          type='text' placeholder='username' 
          className='border p-3 rounded-lg'
         
         />
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
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>

        <OAuth />



      </form>

      <div className='flex gap-2 mt-5'>
         <p>Already have an account?</p> 

         <Link to={"/sign-in"}>
           <span className='text-blue-700'>Sign in</span>
         
         </Link>
      </div>
       {error && <p className='text-red-900 mt-5'>{error}</p>}

    </div>
  )
}

export default SignUp