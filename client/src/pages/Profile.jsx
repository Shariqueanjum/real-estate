import {useSelector} from 'react-redux';
import { useRef, useState , useEffect } from 'react';
import {getDownloadURL, getStorage , ref , uploadBytes, uploadBytesResumable} from 'firebase/storage';
import { app}   from '../firebase.js';
import { updateUserFailure , updateUserStart , updateUserSuccess , 
         deleteUserStart , deleteUserSuccess , deleteUserFailure , 
         signOutStart , signOutSuccess , signOutFailure} from '../redux/user/userSlice.js';

import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';

const Profile = () => {
  
  const {currentUser , isLoading , error} = useSelector((state)=>state.user);
  const fileRef = useRef(null) ;
  const [file , setFile] = useState(undefined);
  const [filePercentage , setFilePercentage] = useState(0);
  const [fileUploadError , setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess , setUpdateSuccess] = useState(false);
  const [showListingsError , setShowListingsError] = useState(false);
  const [listingsLoading , setListingsLoading] = useState(false);
  const [userListings , setUserListings] = useState([]);
  const [deletingListLoading , setDeletingListLoading] = useState(null);
  const [showDeletingListError , setShowDeletingListError] = useState(false);
  const dispatch = useDispatch();


 console.log(currentUser)
 

  const handleChange = (e) =>{

     setFormData({
       ...formData,
       [e.target.id] : e.target.value ,
     })




  } ;


  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method :'POST',
        headers :{
            'Content-Type' : 'application/json',

        },

        body : JSON.stringify(formData)

     });

     const data = await res.json();

     if(data.success ===false){
          dispatch(updateUserFailure(data.message));
          return ;
     }

     dispatch(updateUserSuccess(data));
     setUpdateSuccess(true) ;

    } 
    catch (error) {
      dispatch(updateUserFailure(error.message))
    }


 };   
 
 
 const handleDelete = async ()=>{
    try {
       dispatch(deleteUserStart());

       const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method :'DELETE',
      
     });
     
     const data = await res.json();

     if(data.success === false){
          dispatch(deleteUserFailure(data.message));
          return ;
     }

     dispatch(deleteUserSuccess(data));

    } 
    catch (error) {
       dispatch(deleteUserFailure(error.message))
    }  

      
 };

 const handleSignOut = async()=>{
     try {
        dispatch(signOutStart());
        const res = await fetch('/api/auth/signout');
        const data = await res.json();
        
        if(data.success ===false){
            dispatch(signOutFailure(data.message));
            return ;
        }

        dispatch(signOutSuccess(data));


     } 
     catch (error) {
        dispatch(signOutFailure(error.message));
     }



 }




  const handleFileUpload = (file)=>{
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name ;  // to create unique name

      const storageRef = ref(storage , fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePercentage(Math.round(progress)) ;
        },
        (error)=>{
           setFileUploadError(true);
        },

        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
               
               setFormData({...formData , avatar:downloadUrl})
              
          });
        },
      );

  };

 const handleShowListings = async(e)=>{
     try {
        setListingsLoading(true);
        setShowListingsError(false);
        const res = await fetch(`api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if(data.success === false){
            setListingsLoading(false);
            setShowListingsError(true);
            return ;
        }
        
        setUserListings(data);
        setShowListingsError(false);
        setListingsLoading(false);
     } 
     catch (error) {
         setShowListingsError(true);
         setListingsLoading(false);
     }
 };

 const handleListingsDelete = async(id)=>{
      try {
          setDeletingListLoading(id);
          const res = await fetch(`/api/listing/delete/${id}`,{
             method : 'DELETE'
          });

          const data = await res.json();
          if(data.success === false){
               setDeletingListLoading(null);
               setShowDeletingListError(true);
               return ;
          }
          setUserListings((prevListings)=> prevListings.filter((listing)=>listing._id !== id));
          setDeletingListLoading(null);
          setShowDeletingListError(false);
      } 
      catch (error) {
        setDeletingListLoading(null);
        setShowDeletingListError(true);
      }


 }


 useEffect(()=>{
  if(file){
    handleFileUpload(file) ;

  }

 } , [file]);



  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

         <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>

         <img 
          onClick={()=>fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt='profile-img' 
          className='rounded-full h-24 w-24 mt-2 object-cover cursor-pointer self-center '   />

          <p className='text-sm text-center'>
            { fileUploadError ? (
               <span className='text-red-700'>
                Error Image upload (Image must be of type image and less than 2 mb )
               </span>
                ) : filePercentage > 0 && filePercentage <100 ? (
                      <span className='text-slate-700'>{`uploaded ${filePercentage} % `}</span>
                ) : filePercentage ===100 ?(
                    <span className='text-green-700'>Image uploaded successfully</span>
                ) : (
                   ''
                ) }
          </p>
         <input 
          onChange={handleChange}
          defaultValue={currentUser.username}
          type='text' 
          placeholder='username' 
          id='username'
          className='border p-3 rounded-lg' />

        <input 
         onChange={handleChange}
         defaultValue={currentUser.email}
         type='email' 
         placeholder='email' 
         id='email'
         className='border p-3 rounded-lg' />

        <input 
         onChange={handleChange}
         type='password'
         placeholder='password' 
         id='password'
         className='border p-3 rounded-lg' />
        
        <button disabled={isLoading}
         className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
             {isLoading ? 'Loading...' : 'update'}
          </button>

        <Link to={"/create-listing"}  className='bg-green-700 text-white text-center rounded p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
        </Link>
         
      </form>

       <div className='flex justify-between mt-5'>
         <span onClick={handleDelete}
         className='text-red-700 cursor-pointer'>Delete account</span>

         <span onClick={handleSignOut}
         className='text-red-700 cursor-pointer'>Sign out</span>

       </div>
      
       <p className='text-red-700 mt-5'>{error ? error : ''}</p>
       <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>

       <button onClick={handleShowListings} disabled={listingsLoading} 
       className='text-green-700 w-full hover:opacity-75 disabled:opacity-75'>
        {listingsLoading ? 'Showing...' : 'Show Listings' }
        </button>

        <p className='text-red-700 mt-5'>{showListingsError ? 'Error while fetching the list' : ''}</p>

        { userListings.length >0 && 
            
            <div className='flex flex-col gap-4 '> 
              <h1 className='text-2xl text-center mt-7 font-semibold'>Your Listings</h1>
               {userListings.map((listing)=>{
                  return(
                      <div className='flex items-center justify-between border rounded-lg gap-4 p-3'>
                        <Link to={`/listings/${listing._id}`}>
                           <img 
                              src={listing.imageUrls[0]}
                              alt='listing-img'
                              className='w-24 h-24 object-contain'
                            />
                        </Link >
                        <Link 
                         to={`listings/${listing._id}`}
                         className='text-slate-700 font-semibold hover:underline truncate flex-1'
                        
                        >
                            <p>
                              {listing.name}
                            </p>
                        </Link>
                        <div className='flex flex-col items-center gap-2 mr-1'>
                            <button className='text-green-700 uppercase'>Edit</button>

                            <button disabled={deletingListLoading}
                             onClick={()=>handleListingsDelete(listing._id)}
                             className='text-red-700 uppercase'>
                             {deletingListLoading === listing._id ? 'Deleting...' : 'Delete' }
                             
                              </button>

                              <p>{showDeletingListError ? 'Error while delleting the listing':''}</p>

                             
                        </div>
                    </div>
                  )
               })}





            </div>
 
      
        }

    </div>
  )
}

export default Profile;