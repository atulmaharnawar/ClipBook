import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/router';
import {AiOutlineLogout} from 'react-icons/ai';
import {BiSearch} from 'react-icons/bi';
import {IoMdAdd} from 'react-icons/io';
import Logo from '../utils/clipbooklogo4.png';
import {GoogleLogin,googleLogout} from '@react-oauth/google'
import { createOrGetUser } from '../utils';
import useAuthStore from '../store/authStore';

const Navbar = () => {

  const {userProfile,addUser,removeUser}=useAuthStore();
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter();

  const handleSearch=(e:{preventDefault:()=>void})=>{
    e.preventDefault();
    if(searchValue){
      router.push(`/search/${searchValue}`)
    }
  }

  return (
    <div className='w-full flex justify-between items-center border-b-2 border-white py-2 px-4 bg-[#121212]'>
        <Link href="/">
            <div className="w-[140px] md:w-[180px]">
                <Image className='cursor-pointer' src={Logo} alt="ClipBook" layout="responsive"/>
            </div>
        </Link>
        <div className='relative hidden lg:block'>
          <form onSubmit={handleSearch} className='absolute md:static top-10 -left-20 bg-[#121212]'>
            <input type="text" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} placeholder='Search accounts and videos' className='bg-white p-3 md:text-md font-medium border-2 border-white focus:outline-none hover:border-[#FF4136] w-[300px] md:w-[350px] rounded-full md:top-0 text-black'/>
            <button onClick={handleSearch} className='absolute md:right-5 right-6 top-4 border-left-2 text-2xl pl-4 text-orange-600' >
              <BiSearch />
            </button>
          </form>
        </div>
        <div>
          {userProfile?(
            <div className="flex gap-5 md:gap-10">
              {/* {userProfile.userName} */}
              <Link href="/upload">
                <button className='border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2 border-white hover:border-[#FF4136]' >
                
                  <IoMdAdd className='text-xl'/> {` `} 
                  <span className='hidden md:block'>
                    Upload
                  </span>
                </button>
              </Link>
              {userProfile.image &&(
                 <Link href={`/profile/${userProfile._id}`} >
                 <div className='cursor-pointer' >
                  <Image width={40} height={40} src={userProfile.image} alt="profile photo" className='rounded-full'/>
                 </div>
               </Link>
              )}
              <button type="button" className='px-2' 
                onClick={()=>{
                  googleLogout();
                  removeUser();
                }}>
                <AiOutlineLogout color="red" fontSize={21}/>
              </button>
              </div>
          ):(
            <GoogleLogin onSuccess={(response)=>createOrGetUser(response,addUser)} onError={()=>console.log('Error')}/>
          )}
        </div>
    </div>
  )
}

export default Navbar