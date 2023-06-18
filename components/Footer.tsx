import React from 'react'
import Logo from '../utils/clipbooklogo4.png';
import Image from 'next/image';


const Footer = () => {
  
  return (
    <div className='w-full flex justify-center items-center border-t-2 border-white py-2 px-4'>
        <div className="w-[140px] md:w-[180px] hidden md:block">
              <Image src={Logo} alt="ClipBook" layout="responsive"/>
        </div>
        <p className='text-xs md:text-md ml-5 text-white'>Copyright © 2022 ClipBook</p>
    </div>
  )
}

export default Footer

