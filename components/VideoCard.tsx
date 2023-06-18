import React from 'react'
import {NextPage} from 'next';
import { Video } from '../types';
import {useState,useEffect,useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {HiVolumeUp,HiVolumeOff} from 'react-icons/hi';
import {BsFillPlayFill,BsFillPauseFill} from 'react-icons/bs';
import {GoVerified} from 'react-icons/go';
import { MdDelete } from 'react-icons/md';
import useAuthStore from '../store/authStore';
import { useRouter } from 'next/router';
import { client } from '../utils/client';


interface IProps{
    post:Video;
}

const VideoCard :NextPage<IProps> = ({post}) => {
  const [isHover, setIsHover] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef=useRef<HTMLVideoElement|null>(null);

  const onVideoPress=()=>{
    if(isPlaying){
      videoRef?.current?.pause();
      setIsPlaying(false);
    }
    else{
      videoRef?.current?.play();
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    if(videoRef?.current){
      videoRef.current.muted=isMuted;
    }
  }, [isMuted])
  
  const {userProfile}:{userProfle:any}=useAuthStore();
  const router = useRouter();

  const deletePost=async()=>{
    await client.delete(post._id);
    router.push('/');
  }

  
  return (
    
    <div className="flex flex-col border-b-2 border-white pb-6">
        <div>
          <div className="flex gap-3 p-2 cursor-pointer rounded font-semibold">
                <div className="md:w-16 md:h-16 w-10 h-10">
                      <Link href={`/profile/${post.postedBy._id}`}>
                        <>
                          <Image width={62} height={62} className='rounded-full' src={post.postedBy.image} alt="profile photo" layout='responsive'/>
                        </>
                      </Link>
                </div>
                <div>
                  <Link href={`/profile/${post.postedBy._id}`}>
                    <div className="flex items-center gap-2 ">
                      <p className="flex gap-2 items-center md:text-md text-white font-bold" >{post.postedBy.userName} {` 
                      `} <GoVerified className="text-blue-700 text-md"/></p>
                      <p className="capitalize font-md text-xs text-gray-200 hidden md:block" >{post.postedBy.userName}</p>
                      
                    </div>
                  </Link>
                </div>
          </div>
        </div>
        <div className="lg:ml-20 flex gap-4 relative">
          <div className="rounded-3xl" onMouseEnter={()=>setIsHover(true)} onMouseLeave={()=>setIsHover(false)}>
            <Link href={`/detail/${post._id}`}>
              <video src={post.video.asset.url} loop className="lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] w-[200px] rounded-2xl cursor-pointer bg-gray-400" ref={videoRef}>

              </video>
            </Link>
            {isHover && (
              <div className="absolute bottom-6 cursor-pointer left-5 md:left-5 lg:left-10 flex gap-10 lg:justify-between w-[100px] md:w-[50px] ">
                {isPlaying ? (
                <button>
                  <BsFillPauseFill className="text-black text-2xl lg:text-4xl" onClick={onVideoPress}/>
                </button>) :(
                <button>
                  <BsFillPlayFill className="text-black text-2xl lg:text-4xl" onClick={onVideoPress}/>
                </button>)}
                {isMuted ? (
                <button>
                  <HiVolumeOff className="text-black text-2xl lg:text-4xl" onClick={()=>setIsMuted(false)}/>
                </button>) :(
                <button>
                  <HiVolumeUp className="text-black text-2xl lg:text-4xl" onClick={()=>setIsMuted(true)}/>
                </button>)}
                {userProfile && userProfile._id===post.postedBy._id && <button>
                  <MdDelete className="text-black text-2xl lg:text-4xl" onClick={deletePost} />
                </button>}
              </div>
            )}
          </div>
        </div>
    </div>
  )
}

export default VideoCard