import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';

const CreateListing = () => {
  
   const [files , setFiles] = useState([]);
   const [formData , setFormData] = useState({
       imageUrls : [],
   });

   const [imageUploadError , setImageUploadError]=useState(false);
   const [isUploading , setIsUploading] = useState(false);
   console.log(files);
   

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



   }
   

  return (
    <main className='p-3 max-w-4xl mx-auto'>

       <h1 className=' text-3xl font-semibold text-center my-7'>Create a Listing</h1>
       
       <form className='flex flex-col sm:flex-row gap-4'>

          <div className='flex flex-col gap-4 flex-1'>

             <input className='p-3 border rounded-lg'
              type='text' placeholder='Name' id='name' maxLength='62' minLength='8' required />

             <textarea className='p-3 border rounded-lg'
              type='text' placeholder='Description' id='description' required />

             <input className='p-3 border rounded-lg'
              type='text' placeholder='Address' id='address'  required />

             <div className='flex gap-6 flex-wrap'>

               <div className='flex gap-2'>
                  <input type='checkbox' id='sell' className='w-5' />
                  <span>Sell</span>
               </div>

               <div className='flex gap-2'>
                 <input type='checkbox' id='rent' className='w-5' />
                 <span>Rent</span>
               </div>

               <div className='flex gap-2'>
                 <input type='checkbox' id='parking' className='w-5' />
                 <span>Parking spot</span>
               </div>

               <div className='flex gap-2'>
                 <input type='checkbox' id='furnished' className='w-5' />
                 <span>Furnished</span>
               </div>

               <div className='flex gap-2'>
                 <input type='checkbox' id='offer' className='w-5' />
                 <span>Offer</span>
               </div>


            </div>

            <div className='flex flex-wrap gap-6'>

               <div className='flex gap-2 items-center'>
                  <input type='number' id='bedrooms' min='1' max='10' required className='p-2 w-16 border border-gray-300 rounded-lg'/>
                  <span>Beds</span>
               </div>

               <div className='flex gap-2 items-center'>
                  <input type='number' id='bathrooms' min='1' max='5' required className='p-2 w-16 border border-gray-300 rounded-lg'/>
                  <span>Bath</span>
               </div>

               <div className='flex gap-2 items-center'>
                  <input type='number' id='regularPrice' min='1' max='10' required className='p-2 w-20 border border-gray-300 rounded-lg'/>

                  <div className='flex flex-col items-center'>
                     <span>Regular price</span>
                     <span className='text-xs'>(Rs /month)</span>
                  </div>

               </div>

               <div className='flex gap-2 items-center'>
                  <input type='number' id='discountedPrice' min='1' max='10' required className='p-2 w-20 border border-gray-300 rounded-lg'/>

                  <div className='flex flex-col items-center'>
                    <span>Discounted price</span>
                    <span className='text-xs'>(Rs /month)</span>
                  </div>
                  
               </div>


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

                     <img className='w-20 h-20  rounded-lg'
                      src={url} alt='listing-image'  />

                     <button onClick={()=>handleImageDelete(index)} 
                     type='button' className='p-3 text-red-700 uppercase rounded-lg hover:opacity-70'>Delete</button>

                   </div>

                  )
                })
             
             
             
             }







              <button 
                className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                Create Listing
             </button>

          </div>

         

 
         
  </form>

    </main>
  )
}

export default CreateListing