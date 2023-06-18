import React from 'react'
import {useState,useEffect,useRef} from 'react';
import { useRouter} from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import { MdDelete, MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp } from 'react-icons/hi';
import { HiVolumeOff } from 'react-icons/hi';
import axios from 'axios';
import { BASE_URL } from '../../utils';
import { Video } from '../../types';
import useAuthStore from '../../store/authStore';
import LikeButton from '../../components/LikeButton';
import Comments from '../../components/Comments';
import { client } from '../../utils/client';

interface IProps{
  postDetails:Video,
}

const Detail = ({postDetails}:IProps) => {
  
  const [post, setPost] = useState(postDetails);
  const videoRef=useRef<HTMLVideoElement|null>(null);
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const router=useRouter();
  const{ userProfile }:any =useAuthStore();

  if(!post) return null;

  const onVideoClick = () => {
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
    if(post && videoRef?.current){
      videoRef.current.muted=isMuted;
    }
  }, [post,isMuted])

  const handleLike=async(like:boolean)=>{
    if(userProfile){
      const{data} =await axios.put(`${BASE_URL}/api/like`,{
        userId:userProfile._id,
        postId:post._id,
        like
      })
      setPost({...post,likes:data.likes});
    }
  }

  const [isPostingComment, setIsPostingComment] = useState(false)
  const [comment, setComment] = useState('')

  const addComment=async(e)=>{
    e.preventDefault();
    if(userProfile && comment){
      setIsPostingComment(true);
      const {data} =await axios.put(`${BASE_URL}/api/post/${post._id}`,{
        userId:userProfile._id,
        comment
      });
      setPost({ ...post,comments:data.comments});
      setComment('');
      setIsPostingComment(false);
    }
  }

  const deletePost=async()=>{
    await client.delete(post._id);
    router.push('/');
  }

  return (
    <div className='flex w-full absolute left-0 top-0 bg-[#121212] flex-wrap lg:flex-nowrap'>
      <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black">
        <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
          <p className='cursor-pointer' onClick={()=>router.back()}>
            <MdOutlineCancel className='text-white text-[35px]'/>
          </p>
        </div>
        <div className='relative'>
          <div className='lg:h-[100vh] h-[60vh]'>
              <video src={post.video.asset.url} ref={videoRef} loop onClick={onVideoClick} className='h-full cursor-pointer'>
              </video>
          </div>
          <div className='absolute top-[45%] left-[45%] cursor-pointer'>
              {!isPlaying && (
                <button>
                  <BsFillPlayFill className='text-white text-6xl lg:text-8xl' onClick={onVideoClick}/>
                </button>
              )}
          </div>
        </div>
        <div className='absolute bottom-5 lg:bottom-10 left-5 lg:left-10 cursor-pointer'>
        {userProfile && userProfile._id===post.postedBy._id && <button>
              <MdDelete className="text-white text-2xl lg:text-4xl" onClick={deletePost} />
          </button>}
        </div>
        <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer'>
        {isMuted ? (
                <button>
                  <HiVolumeOff className="text-white text-2xl lg:text-4xl" onClick={()=>setIsMuted(false)}/>
                </button>) :(
                <button>
                  <HiVolumeUp className="text-white text-2xl lg:text-4xl" onClick={()=>setIsMuted(true)}/>
                </button>)}
        </div>
      </div>
                  <div className='relative w-[1000px] md:w[900px] lg:w-[700px] '>
                      <div className="mt-10 lg:mt-20">


                      <div className="flex gap-3 p-2 cursor-pointer rounded font-semibold">
                        <div className="md:w-20 md:h-20 w-16 h-16 ml-4">
                        <Link href="/">
                          <>
                          <Image width={62} height={62} className='rounded-full' src={post.postedBy.image} alt="profile photo" layout='responsive'/>
                        </>
                      </Link>
                </div>
                <div>
                  <Link href='/'>
                    <div className="flex flex-col gap-2 mt-3">
                      <p className="flex gap-2 items-center md:text-md text-white font-bold">{post.postedBy.userName} {` 
                      `} <GoVerified className="text-blue-700 text-md"/></p>
                      <p className="capitalize font-md text-xs text-gray-300 hidden md:block">{post.postedBy.userName}</p>
                    </div>
                  </Link>
                </div>
          </div>
                  <p className='px-10 text-lg text-[#FF4136] font-bold'>
                    {post.caption}
                  </p>
                  <div className="mt-10 px-10">
                    {userProfile && (
                      <LikeButton handleLike={()=>handleLike(true)} handleDislike={()=>handleLike(false)} likes={post.likes} />
                    )}
                  </div>
                  <div>
                    <Comments comment={comment} setComment={setComment} addComment={addComment} comments={post.comments} isPostingComment={isPostingComment} />
                  </div>

                      </div>
                  </div>
    </div>
  )
}


export const getServerSideProps=async({
    params:{id}
  }:{
    params:{id:string}
  })=>{
    const {data} = await axios.get(`${BASE_URL}/api/post/${id}`)

  return {
    props:{postDetails:data}
  }
}

export default Detail

