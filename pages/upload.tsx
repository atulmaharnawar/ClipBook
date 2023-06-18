import React from 'react'
import { useState,useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import axios from 'axios'
import useAuthStore from '../store/authStore'
import {client} from '../utils/client'
import { SanityAssetDocument } from '@sanity/client'
import { topics } from '../utils/constants'
import { visitEachChild } from 'typescript'
import { BASE_URL } from '../utils'


const Upload = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>(undefined)
    const [wrongFileType, setWrongFileType] = useState(false)
    const [caption, setCaption] = useState('')
    const [category, setCategory] = useState(topics[0].name)
    const [savingPost, setSavingPost] = useState(false)
    const [discarded, setDiscarded] = useState(false)
    
    const {userProfile}:{userProfle:any}=useAuthStore();
    const router=useRouter();

    const uploadVideo=async(e:any)=>{
        const selectedFile=e.target.files[0];
        const fileTypes=['video/mp4','video/webm','video/ogg'];
        if(fileTypes.includes(selectedFile.type)){
            client.assets.upload('file',selectedFile,{
                contentType:selectedFile.type,filename:selectedFile.name
            }).then((data)=>{
                setVideoAsset(data);
                setIsLoading(false);
            })
        }else{
            setIsLoading(false);
            setWrongFileType(true);
        }
    }
    
    const handleClear=async()=>{
        setVideoAsset(undefined);
        setCaption('');
        setCategory(topics[0].name);
    }

    const handlePost=async()=>{
        if(caption && videoAsset?._id && category){
            setSavingPost(true);
            const document={
                _type:'post',
                caption,
                video:{
                    _type:'file',
                    asset:{
                        _type:'reference',
                        _ref:videoAsset?._id
                    }
                },
                userId:userProfile?._id,
                postedBy:{
                    _type:'postedBy',
                    _ref:userProfile?._id
                },
                topic:category
            }
            await axios.post(`${BASE_URL}/api/post`,document);
            router.push('/');
        }
    }

   return (
    <div className='flex w-full h-full absolute left-0 top-[70px] mb-10 pt-10 lg:pt-20 bg-[#121212] justify-center'>
        <div className="bg-black text-white rounded-lg xl:h-[80vh] w-[60%] flex gap-6 flex-wrap md:justify-between border-2 justify-center items-center p-14 pt-6 border-[#FF4136] mb-20">
            <div>
                <div>
                    <p className='text-2xl font-bold'>Upload Video</p>
                    <p className='text-md text-gray-400 mt-1 hidden sm:block'>Post a video to your account</p>
                </div>
                <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[180px] md:w-[260px] h-[180px] md:h-[360px] p-10 cursor-pointer hover:border-red-500 hover:bg-gray-100 hover:text-black">
                    {isLoading?(
                        <p>Uploading...</p>
                    ):(
                        <div>
                            {videoAsset?(
                                <div>
                                    <video src={videoAsset.url} loop controls className='rounded-xl h-[150px] md:h-[250px] my-12 bg-black border-2 border-white'>
                                    </video>
                                </div>
                            ):(
                                    <label className='cursor-pointer'>
                                        <div className="flex flex-col justify-center items-center h-full">
                                        <div className="flex flex-col justify-center items-center">
                                            <p className='font-bold text-xl'>
                                                <FaCloudUploadAlt className='text-gray-300 text-6xl'/>
                                            </p>
                                            <p className='text-sm md:text-xl font-semibold'>
                                                Upload Video
                                            </p>
                                            </div>
                                            <p className='text-gray-400 text-center mt-10 text-sm hidden md:block leading-6'>
                                                MP4 or WebM or ogg  <br />
                                                720x1280 or higher <br />
                                                Up to 10 minutes <br />
                                                Less than 2GB
                                            </p>
                                            <p className="text-center mt-10 rounded text-white text-sm md:text-md font medium p-2 w-42 md:w-52 outline-none bg-[#FF4136]" >
                                                Select File
                                            </p>
                                            
                                        </div>
                                        <input type="file" name="upload-video" className='w-0 h-0' onChange={uploadVideo} />
                                    </label>
                            )}
                        </div>
                    )}
                    {wrongFileType && (
                        <p className='text-center text-xs md:text-sm lg:text-md text-red-400 font-semibold mt-4 w-[250px]'>
                            Select a video file
                        </p>
                    )}
                </div>
            </div>
            <div className='flex flex-col gap-3 pb-10'>
                        <label className='text-md font-medium'>
                            Caption
                        </label>
                        <input type="text" value={caption} onChange={(e)=>setCaption(e.target.value)} className='rounded outline-none text-md border-2 border-gray-200 p-2 text-black'/>
                        <label className='text-md font-medium'>Choose a category for a video</label>
                        <select onChange={(e)=>setCategory(e.target.value)} className='outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer text-black'>
                            {topics.map((topic)=>(
                                <option value={topic.name} key={topic.name} className='outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'>
                                    {topic.name}
                                </option>
                            ))}
                            <option className='outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'>
                                Nature
                            </option>
                            <option className='outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'>
                                Other
                            </option>
                        </select>
                        <div className='flex gap-6 mt-10'>
                                <button onClick={handleClear} type="button" className='border-gray-300 border-2 text-md font-medium rounded p-2 w-20 lg:w-44 outline-none'>
                                    Discard
                                </button>
                                <button onClick={handlePost} type="button" className='bg-[#FF4136] text-white text-md font-medium rounded p-2 w-20 lg:w-44 outline-none'>
                                    Post
                                </button>
                        </div>
                </div>
        </div>
    </div>
    )
}

export default Upload