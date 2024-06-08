"use client"
import { ModeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FlipHorizontal } from 'lucide-react'
import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'

type Props = {}
const Homepage = (props: Props) => {
  const  webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
//state
const [mirrored, setmirrored] = useState<boolean>(false);

  return (
    <div className='flex h-screen '>
     <div className='relative '>
      <div className='h-screen relative w-full'>
        {/* webcam component */}
        <Webcam ref={ webcamRef}
        mirrored={mirrored}
        className='h-full w-full object-contain p-2'
        /> 
        {/* canvas component  */}
        <canvas ref={canvasRef}
        className='absolute top-0 left-0 h-full w-full object-contain'
        >

        </canvas>
      </div>
     </div>
     {/* right section  */}
      <div className=' flex flex-row  flex-1'>
      <div className='border-primary/5 border-2 max-w-xs flex flex-col gap2 justify-between shadow-lg rounded-lg'>
        {/* top */}
        <div className='flex flex-col gap2'>
          <ModeToggle/>
          <Button variant={'outline'} onClick={()=>{
            setmirrored((prev)=>!prev)

          }} 
          className='my-2'
          ><FlipHorizontal /></Button>
        <Separator  />
        </div>
        {/* middle */}
        <div className='flex flex-col gap2'>
        <Separator />


        <Separator />
        </div>
        {/* bottom */}
        <div className='flex flex-col gap2'>
          <Separator />

        </div>
      </div>

      </div>

    </div>
  )
}

export default Homepage