import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

const CreateListing = () => {
  
   const [files , setFiles] = useState([]);
   const [formData , setFormData] = useState({
       name : '',
       description : '',
       address : '',
       regularPrice : 4000,
       discountPrice : 0,
       bathrooms : 1,
       bedrooms : 1,
       furnished : false,
       parking : false,
       type : 'rent',
       offer : false,
       imageUrls : [],
   });
    
   const {currentUser} = useSelector((state)=>state.user);
   const navigate = useNavigate();

   const [imageUploadError , setImageUploadError]=useState(false);
   const [isUploading , setIsUploading] = useState(false);
   const [formSubmitError , setFormSubmitError] = useState(false)
   const [isLoading , setIsLoading] = useState(false);
   console.log(files);

   console.log(formData);
   

   const handleImageSubmit = ()=>{
        if(files.length > 0  && files.length + formData.imageUrls.length <7){
           setIsUploading(true);
           setImageUploadError(false);
              const result=[];

              for(let i=0;i<files.length;i++){
                    result.push(storeImageInFirebase(files[i]));
              }

          Promise.all(result)   
            .then((urls)=>{
               setFormData({
                  ...formData,
                  imageUrls:formData.imageUrls.concat(urls)
               })
               
               setImageUploadError(false);
               setIsUploading(false);

              })

            .catch((error)=>{
                 console.log(error,"I am the error from catch")
                setImageUploadError('Error occured while uploading your img, try again (2 mb max per image)');
                setIsUploading(false);
            })

        }
        else{
            setImageUploadError('You can only upload 6 images per listing');
            setIsUploading(false);
          
        }
      
     

   };


   const storeImageInFirebase = async (file)=>{
      return new Promise((resolve,reject)=>{
         const storage = getStorage(app);
         const fileName = new Date().getTime()+file.name ;
         const storageRef = ref(storage,fileName);
   
         const uploadTask = uploadBytesResumable(storageRef,file);
         
         uploadTask.on('state_changed',
            (snapshot)=>{
               const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
                
         },
         (error)=>{
             reject(error);
         },

         ()=>{
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
              resolve(downloadURL);
           })

         },
         
      
      );

      }
   );


   };


   const handleImageDelete = (index)=>{

       setFormData({
         ...formData,
          imageUrls : formData.imageUrls.filter(( _, i )=> i!==index),
       })



   };

   const handleChange = (e)=>{

      if(e.target.id === 'sell' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type : e.target.id
            })
      }

      if(e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished'){
            setFormData({
                ...formData,
                [e.target.id] : e.target.checked
            })

      }

      if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
           setFormData({
               ...formData,
               [e.target.id] : e.target.value
           })

      }



   };


   const handleSubmitFormData = async (e)=>{
         e.preventDefault();
         try {

             if(formData.imageUrls.length <1) return setFormSubmitError('You have to upload atleast one image of your flat ');

             if(formData.regularPrice < formData.discountPrice) return setFormSubmitError('Discounted price must be lower than regular price');
             

            setIsLoading(true);
            setFormSubmitError(false);

            const res = await fetch('/api/listing/create',{
                method : 'POST',
                headers : {
                  'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                   ...formData,
                    userRef : currentUser._id
                })
            });
            
            const data = await res.json();

            setIsLoading(false);

            if(data.success === false){
                setIsLoading(false);
                setFormSubmitError(data.message);
                return ;
            }

            

            navigate(`/listing/${data._id}`);



         } 
         catch (error) {
             setIsLoading(false);
             setFormSubmitError(error.message);
         }
   }
   

  return (
    <main className='p-3 max-w-4xl mx-auto'>

       <h1 className=' text-3xl font-semibold text-center my-7'>Create a Listing</h1>
       
       <form onSubmit={handleSubmitFormData} className='flex flex-col sm:flex-row gap-4'>

          <div className='flex flex-col gap-4 flex-1'>

             <input value={formData.name} onChange={handleChange} className='p-3 border rounded-lg'
              type='text' placeholder='Name' id='name' maxLength='62' minLength='6' required />

             <textarea value={formData.description} onChange={handleChange} className='p-3 border rounded-lg'
              type='text' placeholder='Description' id='description' required />

             <input value={formData.address} onChange={handleChange} className='p-3 border rounded-lg'
              type='text' placeholder='Address' id='address'  required />

             <div className='flex gap-6 flex-wrap'>

               <div className='flex gap-2'>
                  <input  onChange={handleChange} type='checkbox' id='sell' className='w-5' checked={formData.type ==='sell'} />
                  <span>Sell</span>
               </div>

               <div className='flex gap-2'>
                 <input  onChange={handleChange} type='checkbox' id='rent' className='w-5' checked={formData.type ==='rent'} />
                 <span>Rent</span>
               </div>

               <div className='flex gap-2'>
                 <input  onChange={handleChange} type='checkbox' id='parking' className='w-5' checked={formData.parking} />
                 <span>Parking spot</span>
               </div>

               <div className='flex gap-2'>
                 <input  onChange={handleChange} type='checkbox' id='furnished' className='w-5' checked={formData.furnished} />
                 <span>Furnished</span>
               </div>

               <div className='flex gap-2'>
                 <input  onChange={handleChange} type='checkbox' id='offer' className='w-5' checked={formData.offer} />
                 <span>Offer</span>
               </div>


            </div>

            <div className='flex flex-wrap gap-6'>

               <div className='flex gap-2 items-center'>
                  <input value={formData.bedrooms} onChange={handleChange} type='number' id='bedrooms' min='1' max='10' required className='p-2 w-16 border border-gray-300 rounded-lg'/>
                  <span>Beds</span>
               </div>

               <div className='flex gap-2 items-center'>

                  <input value={formData.bathrooms} onChange={handleChange} type='number' id='bathrooms' min='1' max='5' required className='p-2 w-16 border border-gray-300 rounded-lg'/>
                  <span>Bath</span>

               </div>

               <div className='flex gap-2 items-center'>

                  <input value={formData.regularPrice} onChange={handleChange} type='number' id='regularPrice' min='4000' max='40000000' required className='p-2 w-24 border border-gray-300 rounded-lg'/>

                  <div className='flex flex-col items-center'>
                     <span>Regular price</span>
                     { formData.type === 'rent' &&
                     <span className='text-xs'>(Rs /month)</span>
                     }
                  </div>

               </div>

               {formData.offer &&

               <div className='flex gap-2 items-center'>

                  <input value={formData.discountPrice} onChange={handleChange} type='number' id='discountPrice' min='0' max='40000000' required className='p-2 w-24 border border-gray-300 rounded-lg'/>

                  <div className='flex flex-col items-center'>
                    <span>Discounted price</span>
                     { formData.type==='rent' &&
                    <span className='text-xs'>(Rs /month)</span>
                     } 
                  </div>
                  
             </div>

               }


            </div>




          </div>


          <div className='flex flex-col flex-1 gap-4'>
            
             <p className='font-semibold'>Images:
                <span className='font-normal text-gray-700 ml-2'>The first image will be the cover img (max 6)</span>
             </p>

             <div className='flex gap-4'>

               <input 
                onChange={(e)=>setFiles(e.target.files)}
                className='p-3 border border-gray-300 rounded-lg w-full' 
                type='file' 
                id='images' 
                accept='image/*'  multiple/>

               <button 
                onClick={handleImageSubmit}
                type='button'
                disabled={isUploading}
                className='p-3 text-green-700 border border-green-700  rounded-lg uppercase hover:shadow-lg disabled:opacity-80 '>
                  {isUploading ? 'Uploading....' : 'Upload'}
               </button>

             </div>
              <p className='text-red-700 text-sm'>
               {imageUploadError && imageUploadError}
              </p>

             {formData.imageUrls.length >0 &&
                formData.imageUrls.map((url,index)=>{
                  return(
                   <div key={index} className='flex justify-between p-3 border items-center '>

                     <img className='w-20 h-20  rounded-lg object-contain'
                      src={url} alt='listing-image'  />

                     <button onClick={()=>handleImageDelete(index)} 
                     type='button' className='p-3 text-red-700 uppercase rounded-lg hover:opacity-70'>Delete</button>

                   </div>

                  )
                })
             
             
             
             }







              <button disabled={isLoading || isUploading}
                className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                 {isLoading ? 'Creating...' : 'Create Listing'}
             </button>

             {formSubmitError && <p className='text-red-700 text-sm'>{formSubmitError}</p>}

          </div>

         

 
         
  </form>

    </main>
  )
}

export default CreateListing;