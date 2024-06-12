import * as cocossd from '@tensorflow-models/coco-ssd'
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"
import { DetectedObject } from '@tensorflow-models/coco-ssd';
// mirrored, predictions, canvasRef.current?.getContext('2d')/
export function drawOnCanvas(
    mirrored: boolean,
    predictions : DetectedObject[],
    ctx: CanvasRenderingContext2D | null |undefined
){
  predictions.forEach((detectedObject: DetectedObject)=>{
    const {class:nameoftheobject, bbox, score} = detectedObject;
    const [x,y,width, height] = bbox;

    if (ctx) {
        ctx.beginPath();


        //Styleing

        ctx.fillStyle = nameoftheobject === 'person' ? '#FF0F00' : ' #00B612'
        ctx.globalAlpha = 0.4;
        
        
        
        ctx.roundRect(x,y,width, height, 8);
        
        
        ctx.fill()
        ctx.font = " 12px Courier New"

        ctx.globalAlpha = 1;


        ctx.fillText(nameoftheobject, x, y)
        
    }
  })

}