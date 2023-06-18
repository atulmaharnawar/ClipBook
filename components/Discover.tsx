import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {topics} from '../utils/constants'

const Discover = () => {
    const router=useRouter();
    const {topic} =router.query;
    const activeTopicStyle="xl:border-2 hover:bg-white xl:border-[#FF4136] px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center text-[#FF4136] cursor-pointer";
    const topicStyle="xl:border-2 hover:bg-white xl:border-white xl:hover:border-black px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center text-white hover:text-black cursor-pointer"
    return (
    <div className='xl:border-b-2 xl:black pb-6'>
        <p className='text-white font-semibold m-3 mt-4 hidden xl:block'>Popular Topics</p>
        <div className="flex gap-3 flex-wrap ">
            {topics.map((item)=>(
                <Link href={`/?topic=${item.name}`} key={item.name}>
                    <div className={topic===item.name?activeTopicStyle:topicStyle} >
                        <span className="font-bold text-2xl xl:text-md ">
                            {item.icon}
                        </span>
                        <span className="text-md font-medium hidden xl:block capitalize">
                            {item.name}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    </div>
    )
}

export default Discover