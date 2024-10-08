import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {useSelector} from 'react-redux';

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import ContactLandlord from '../components/ContactLandlord';


const Listing = () => {

    const {currentUser} = useSelector((state)=>state.user);

    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing , setListing] = useState(null);
    const [error , setError] = useState(false);
    const [isLoading , setIsLoading] = useState(false);
    const [copied , setCopied] =useState(false);
    const [contactLandlord , setContactLandlord] = useState(false);

    console.log(listing);
    
   
    useEffect(()=>{

        const fetchListing = async()=>{
            const {id} = params;
              try {
                   setIsLoading(true);
                  const res = await fetch(`/api/listing/getListing/${id}`);
                  const data = await res.json();
                  if(data.success===false){
                      setError(true);
                      setIsLoading(false);
                      return ;
                  }
 
                  setListing(data);
                  setIsLoading(false);
                  setError(false);
              } 
              catch (error) {
                  setIsLoading(false);
                  setError(true);
              }
         }
 
 
         fetchListing();
    },[params.id])







  return (
    <main>
       {isLoading && <p className='text-center my-7 text-2xl'>Loading...</p>}
       {error && (
          <p className='text-center my-7 text-2xl'>Something went wrong!</p>
       )}
       {listing && !isLoading && !error && (
         <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[450px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
         <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - Rs{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  Total Save of Rs {+listing.regularPrice - +listing.discountPrice} 
                </p>
              )}
            </div>
             <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contactLandlord && ( 
                 <button onClick={()=>setContactLandlord(true)} 
                className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>
                  Contact landlord
                  </button>
                )}

              {contactLandlord && ( <ContactLandlord listing={listing} />)}
              
               
          

          </div>

    </div>

       )}
      
    </main>
  )
}

export default Listing