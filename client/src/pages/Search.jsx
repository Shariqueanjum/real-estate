import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'

const Search = () => {

   const navigate = useNavigate()
  
   const [sidebarData , setSidebarData] = useState({
          searchTerm : '',
          type : 'all',
          parking : false,
          furnished : false,
          offer : false,
          sort : 'created_at',
          order : 'desc',
   })


   //console.log(sidebarData);


   const handleChange = (e)=>{
       
      if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sell'){
          setSidebarData({
             ...sidebarData,
              type : e.target.id
          })
      } 

      if(e.target.id === 'searchTerm'){
           setSidebarData({
              ...sidebarData,
              searchTerm : e.target.value
           })
      }

      if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebarData({
                ...sidebarData,
                [e.target.id]:e.target.checked
            })

      }

      if(e.target.id === 'sort_order'){
           
         const sort = e.target.value.split('_')[0];
         const order = e.target.value.split('_')[1];


          setSidebarData({
             ...sidebarData,
             sort,order

          })

      }



   };

   const handleSubmit = (e)=>{
       e.preventDefault();
      
      const urlParams = new URLSearchParams();

      urlParams.set('searchTerm' , sidebarData.searchTerm);
      urlParams.set('type' , sidebarData.type );
      urlParams.set('parking' , sidebarData.parking );
      urlParams.set('furnished' , sidebarData.furnished );
      urlParams.set('offer' , sidebarData.offer );
      urlParams.set('sort' , sidebarData.sort);
      urlParams.set('order' , sidebarData.order );


     const searchQuery =  urlParams.toString();

      navigate(`/search?${searchQuery}`);

   };


   useEffect(()=>{
     
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      const typeFromUrl = urlParams.get('type');
      const parkingFromUrl = urlParams.get('parking');
      const furnishedFromUrl = urlParams.get('furnished');
      const offerFromUrl = urlParams.get('offer');
      const sortFromUrl = urlParams.get('sort');
      const orderFromUrl = urlParams.get('order');

      if(searchTermFromUrl ||
         typeFromUrl ||
         parkingFromUrl ||
         furnishedFromUrl ||
         offerFromUrl ||
         sortFromUrl ||
         orderFromUrl
      ) {
          
         setSidebarData({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true' ? true : false,
            furnished: furnishedFromUrl === 'true' ? true : false,
            offer: offerFromUrl === 'true' ? true : false,
            sort: sortFromUrl || 'created_at',
            order: orderFromUrl || 'desc',
         })
           

      }




   },[location.search])
 


  return (
    <div className='flex flex-col md:flex-row'>
       
       <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'> 
         <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
             <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                <input
                  onChange={handleChange}
                  value={sidebarData.searchTerm}
                  type='text'
                  id='searchTerm'
                  placeholder='Search...'
                  className='p-3 rounded-lg w-full'
                
                />
              </div>

              <div className='flex gap-2 flex-wrap items-center'>
                 <label className='font-semibold'>Type:</label>
                  <div className='flex gap-2'>
                     <input 
                      onChange={handleChange}
                      checked={sidebarData.type === 'all'}
                      type='checkbox' 
                      id='all' 
                      className='w-5' />
                     <span>Rent & Sell</span>
                  </div>

                  <div className='flex gap-2'>
                     <input
                      onChange={handleChange} 
                      checked={sidebarData.type === 'rent'}
                      type='checkbox' 
                      id='rent' 
                      className='w-5' />
                     <span>Rent</span>
                  </div>

                  <div className='flex gap-2'>
                     <input 
                      checked={sidebarData.type === 'sell'}
                      onChange={handleChange}
                      type='checkbox' 
                      id='sell' 
                      className='w-5' />
                     <span>Sell</span>
                  </div>

                  <div className='flex gap-2'>
                     <input 
                      checked={sidebarData.offer}
                      onChange={handleChange}
                      type='checkbox' 
                      id='offer' 
                      className='w-5' />
                     <span>Offer</span>
                  </div>

              </div>

              <div className='flex gap-2 flex-wrap items-center'>

                 <label className='font-semibold'>Amenities:</label>
                  <div className='flex gap-2'>
                     <input 
                      checked={sidebarData.parking}
                      onChange={handleChange}
                      type='checkbox' 
                      id='parking' 
                      className='w-5' />
                     <span>parking</span>
                  </div>

                  <div className='flex gap-2'>
                     <input 
                      checked={sidebarData.furnished}
                      onChange={handleChange}
                      type='checkbox' 
                      id='furnished' 
                      className='w-5' />
                     <span>Furnished</span>
                  </div>

              </div>

              <div className='flex items-center gap-2'>
                 <label className='font-semibold'>Sort:</label>
                 <select onChange={handleChange} className='p-3 rounded-lg border' id='sort_order'>
                     <option value='regularPrice_desc'>Price high to low</option>
                     <option value='regularPrice_asc'>Price low to high</option>
                     <option value='createdAt_desc'>Latest</option>
                     <option value='createdAt_asc'>Oldest</option>
                 </select>
              </div>

              <button 
               className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'>
                Search</button>

         </form>
       </div>

       <div className=''>
         <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
       </div>



    </div>
  )
}

export default Search