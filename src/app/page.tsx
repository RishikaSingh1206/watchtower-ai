"use client"
import { ModeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Popover } from '@radix-ui/react-popover'
import { Camera, FlipHorizontal, MoonIcon, PersonStanding, SunIcon, Video, Volume2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Rings } from 'react-loader-spinner'
import Webcam from 'react-webcam'
import { toast } from 'sonner'
import { beep } from '../../utils/audio'
import * as cocossd from '@tensorflow-models/coco-ssd'
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"
import { drawOnCanvas } from '../../utils/draw'

type Props = {}
let interval:any = null;
const Homepage = (props: Props) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //state
  const [mirrored, setMirrored] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false);
  const [volume, setVolume] = useState(0.8);
  const [model, setModel] = useState<cocossd.ObjectDetection>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true)
    initModel();
  }, [])

  //loads model 
  //set it in a state variable
  async function initModel() {
    const loadedModel: cocossd.ObjectDetection = await cocossd.load({
      base: 'mobilenet_v2'
    })
    setModel(loadedModel)
  }

  useEffect(() => {
    if (model) {
      setLoading(false);
    }
  }, [model])

 async function runPrediciton(){
    if (
      model 
      && webcamRef.current
      && webcamRef.current.video
      && webcamRef.current.video.readyState === 4
    ) {
      const predictions: cocossd.DetectedObject[] = await model.detect(webcamRef.current.video)

      resizeCanvas(canvasRef , webcamRef);
      drawOnCanvas(mirrored, predictions, canvasRef.current?.getContext('2d'))
    }
  }

  useEffect(()=>{
    interval = setInterval(()=>{
      runPrediciton()
    }, 100)

    return ()=>{
        clearInterval(interval)
    }

  },[webcamRef.current , model])

  return (
    <div className='flex h-screen '>
      <div className='relative '>
        <div className='h-screen relative w-full'>
          {/* webcam component */}
          <Webcam ref={webcamRef}
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
      <div className='flex flex-row flex-1'>
        <div className='border-primary/5 border-2 max-w-xs flex flex-col gap2 justify-between shadow-lg rounded-lg'>
          {/* top */}
          <div className='flex flex-col '>
            <ModeToggle />
            <Button variant={'outline'} onClick={() => {
              setMirrored((prev) => !prev)
            }}
            >
              <FlipHorizontal />
            </Button>
            <Separator className='my-2' />
          </div>
          {/* middle */}
          <div className='flex flex-col gap2'>
            <Separator />
            <Button
              variant={'outline'} size={'icon'}
              onClick={userPromptScreenShot}
            >
              <Camera />
            </Button>
            <Separator />
            <Button
              variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
              onClick={userPromptRecord}
            >
              <Video />
            </Button>

            <Separator className='my-2' />
            <Button variant={autoRecordEnabled ? 'destructive' : 'outline'} size={"icon"} onClick={toggleAutoRecord}>
              {autoRecordEnabled ? <Rings color='white' height={45} /> : <PersonStanding />}
            </Button>
          </div>

          {/* bottom */}
          <div className='flex flex-col gap2'>
            <Separator className='my-2' />
            <Popover>
              <PopoverTrigger>
                <Button variant={'outline'} size={'icon'}>
                  <Volume2 />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Slider
                  max={1}
                  min={0}
                  step={0.2}
                  defaultValue={[volume]}
                  onValueCommit={(val) => {
                    const newVolume = val[0];
                    if (isFinite(newVolume)) {
                      setVolume(newVolume);
                      beep(newVolume);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className='h-full flex-1 py-4 overflow-y-scroll'>
          <RenderFeatureHighlightsSection />
        </div>
      </div>
      {loading && <div className='z-50 absolute w-full h-full flex items-center justify-center bg-primary-foreground'>
        Getting things ready ...<Rings height={50} color='red' />
      </div>}
    </div>
  )

  // handlers
  function userPromptScreenShot() {
    //take picture 
    //save it to download
  }

  function userPromptRecord() {
    // record video
  }

  function toggleAutoRecord() {
    if (autoRecordEnabled) {
      setAutoRecordEnabled(false);
      toast('Auto record is disabled')
      //show toast to user to notify the change
    } else {
      setAutoRecordEnabled(true);
      toast('Auto record is enabled')
    }
  }

  //Inner components
  function RenderFeatureHighlightsSection() {
    return (
      <>
        <div className="text-xs text-muted-foreground">
          <ul className="space-y-4">
            <li>
              <strong>Dark Mode/Sys Theme 🌗</strong>
              <p>Toggle between dark mode and system theme.</p>
              <Button className="my-2 h-6 w-6" variant={"outline"} size={"icon"}>
                <SunIcon size={14} />
              </Button>{" "}
              /{" "}
              <Button className="my-2 h-6 w-6" variant={"outline"} size={"icon"}>
                <MoonIcon size={14} />
              </Button>
            </li>
            <li>
              <strong>Horizontal Flip ↔️</strong>
              <p>Adjust horizontal orientation.</p>
              <Button className='h-6 w-6 my-2'
                variant={'outline'} size={'icon'}
                onClick={() => {
                  setMirrored((prev) => !prev)
                }}
              ><FlipHorizontal size={14} /></Button>
            </li>
            <Separator />
            <li>
              <strong>Take Pictures 📸</strong>
              <p>Capture snapshots at any moment from the video feed.</p>
              <Button
                className='h-6 w-6 my-2'
                variant={'outline'} size={'icon'}
                onClick={userPromptScreenShot}
              >
                <Camera size={14} />
              </Button>
            </li>
            <li>
              <strong>Manual Video Recording 📽️</strong>
              <p>Manually record video clips as needed.</p>
              <Button className='h-6 w-6 my-2'
                variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
                onClick={userPromptRecord}
              >
                <Video size={14} />
              </Button>
            </li>
            <Separator />
            <li>
              <strong>Enable/Disable Auto Record 🚫</strong>
              <p>
                Option to enable/disable automatic video recording whenever
                required.
              </p>
              <Button className='h-6 w-6 my-2'
                variant={autoRecordEnabled ? 'destructive' : 'outline'}
                size={'icon'}
                onClick={toggleAutoRecord}
              >
                {autoRecordEnabled ? <Rings color='white' height={30} /> : <PersonStanding size={14} />}
              </Button>
            </li>

            <li>
              <strong>Volume Slider 🔊</strong>
              <p>Adjust the volume level of the notifications.</p>
            </li>
            <li>
              <strong>Camera Feed Highlighting 🎨</strong>
              <p>
                Highlights persons in{" "}
                <span style={{ color: "#FF0F0F" }}>red</span> and other objects in{" "}
                <span style={{ color: "#00B612" }}>green</span>.
              </p>
            </li>
            <Separator />
            <li className="space-y-4">
              <strong>Share your thoughts 💬 </strong>
            </li>
          </ul>
        </div>
      </>
    )
  }
}

export default Homepage
function resizeCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, webcamRef: React.RefObject<Webcam>) {
  const canvas = canvasRef.current;
  const video = webcamRef.current?.video;

  if ((canvas && video)) {
    const {videoWidth, videoHeight} = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
  }
}

