import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState,useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer';
import { Video } from '@/types';

interface IProps{
  post:Video;
}

const App=({ Component, pageProps }: AppProps,{post}:IProps) =>{
  const [isSSR,setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false)
  }, [])

  if(isSSR) return null;

  const loc = window.location.pathname;
  const dir = loc.substring(0, loc.lastIndexOf('/'))

  return (
    <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}>
      <div className='xl:w-[1200px] m-auto overflow-hidden h-[100vh]'>
        <Navbar />
        <div className="flex gap-6 md:gap-20">
          <div className='h-[92vh] overflow-hidden xl:hover:overflow-auto'>
            <Sidebar/>
          </div>
          <div className='mt-4 flex flex-column gap-10 overflow-auto h-[88vh] videos flex-1'>
            <Component {...pageProps} />
          </div>
        </div>
      </div>
      {loc!=='/upload' && dir!==`/detail` && <div className='xl:w-[1200px] overflow-hidden h-[5vh] lg:h-[10vh] m-auto relative bottom-0'>
          <Footer />
      </div> }
    </GoogleOAuthProvider>
  )
}

export default App;
