import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const ContactLandlord = ({listing}) => {

  const [landlord , setLandlord] = useState();
  const [message , setMessage] = useState();

   console.log(landlord,"hey this is my house");

   const handleChange = (e)=>{
        setMessage(e.target.value);
   }
   

  useEffect(()=>{

    const fetchLandlordetails = async()=>{
      const res = await fetch(`/api/user/${listing.userRef}`);
      const data = await res.json();
      if(data.success === false){
         console.log("I am inside data.success and i have some error");
         return;
      }
      setLandlord(data);
    }
    
    fetchLandlordetails();
  },[listing.userRef])


  return (
       <>
         {landlord && (
             <div className='flex flex-col gap-3'>
                <p> Contact   <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name}</span>
                </p>
               
               <textarea 
                className='p-3 border border-slate-600 rounded-lg w-full outline-none'
                onChange={handleChange}
                name='message' 
                id='message' 
                rows='2' 
                value={message}
                placeholder='Enter your message here....'>
                 
               </textarea>

               <Link className='bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95 uppercase'
                to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>
                 Send Message
               </Link>

             </div>
         )}
       
       
       </>
  )
}

export default ContactLandlord