import { BASE_URL } from '../../utils'
import React from 'react'
import {useState} from 'react'
import { GoVerified } from 'react-icons/go';
import Image from 'next/image';
import axios from 'axios';
import VideoCard from '../../components/VideoCard';
import NoResults from '../../components/NoResults';
import {IUser,Video} from '../../types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuthStore from '../../store/authStore';

const Search = ({videos}:{videos:Video[]}) => {

    const [isAccounts, setIsAccounts] = useState(false)

    const accounts=isAccounts?'border-b-2 border-[#FF4136]':'text-white'
    const isVideos=!isAccounts?'border-b-2 border-[#FF4136]':'text-white'

    const router = useRouter();
    const {searchTerm}:any = router.query;

    const {allUsers} = useAuthStore();

    const searchedAccounts = allUsers.filter((user:IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase())); 

return (
    <div className='w-full '>
        <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-400 bg-[#121212] w-full'>
            <p className={`text-xl font-semibold cursor-pointer mt-2 text-[#FF4136] ${accounts}`} onClick={()=>setIsAccounts(true)}> 
                        Accounts
            </p>
            <p className={`text-xl font-semibold cursor-pointer mt-2 text-[#FF4136] ${isVideos}`} onClick={()=>setIsAccounts(false)}> 
                        Videos
            </p>
        </div>
        {isAccounts?(
            <div className='md:mt-16'>
                {searchedAccounts.length>0?(
                    searchedAccounts.map((user:IUser,idx:number)=>(
                        <Link href={`/profile/${user._id}`} key={idx}>
                        <div className="flex p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200 gap-3 ">
                            <div>
                                <Image src={user.image} width={50} height={50} className='rounded-full' alt='user profile'/>
                            </div>
                            <div className="hidden xl:block ">
                                <p className='flex gap-1 items-center text-md font-bold text-white lowercase cursor-pointer'>
                                {user.userName.replaceAll(' ','')}
                                <GoVerified className='text-blue-700' />
                                </p>
                                <p className='capitalize text-gray-300 text-xs cursor-pointer'>
                                {user.userName}
                                </p>
                            </div>
                        </div>
                        </Link>
                    ))
                ):<NoResults text={`No video results for ${searchTerm}`} />
            }
            </div>
                ): <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start'>
                    {videos.length?(
                        videos.map((video:Video,idx)=>(
                            <VideoCard post={video} key={idx} />
                        ))
                    ):<NoResults text={`No video results for ${searchTerm}`} />
                    }
                </div>
                }
    </div>
)
}


export const getServerSideProps=async({params:{
    searchTerm}
}:{
    params:{searchTerm:string}
})=>{
    const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)

    return {
        props:{videos:res.data}
    }
}

export default Search