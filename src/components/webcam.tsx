"use client";
import { Rubik } from "next/font/google";
import clsx from "clsx";
import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Camera, CameraType } from "react-camera-pro";

const font = Rubik({
  subsets: ["latin-ext"],
});

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const cameraProRef = useRef<CameraType>(null);
  const [isPicClicked, setIsPicClicked] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null | undefined>(null);
  const [, setScreenShotSrc] = useState<string | null | undefined>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const handleCapture = useCallback(() => {
    const a = cameraProRef.current?.takePhoto();
    setImgSrc(a);
    setScreenShotSrc(a);
    setIsPicClicked(true);
  }, []);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.onload = () => {
        // * OLD FUNCTION * //
        // const canvas = canvasRef.current;
        // const ctx = canvas?.getContext("2d");
        // if (!ctx || !screenShotSrc || !canvas) return;
        // canvas.width = imgRef.current!.width;
        // canvas.height = imgRef.current!.height;
        // const w = (ctx.canvas.width = imgRef.current!.width);
        // const h = (ctx.canvas.height = imgRef.current!.height);
        // ctx.drawImage(imgRef.current!, 0, 0, w, h);
        // const d = ctx.getImageData(0, 0, w, h); // Get image Data from Canvas context
        // for (let i = 0; i < d.data.length; i += 4) {
        //   d.data[i] =
        //     d.data[i + 1] =
        //     d.data[i + 2] =
        //       d.data[i + 1]! > 180 ? 255 : 0;
        // }
        // ctx.putImageData(d, 0, 0);
        // * OLD FUNCTION ENDS * //
        // * NEW KONVA FUNCTION * //
        const stage = new Konva.Stage({
          container: "canvas",
          width: imgRef.current!.width,
          height: imgRef.current!.height,
        });
        const layer = new Konva.Layer();
        const image = new Konva.Image({
          image: imgRef.current!,
        });
        image.cache();
        image.filters([Konva.Filters.Brighten, Konva.Filters.Enhance]);
        layer.add(image);
        stage.add(layer);
        image.brightness(0.2);
        // image.enhance(0.5);
        // * NEW KONVA FUNCTION ENDS * //
        console.log(image.toDataURL());
      };
    }
  }, [imgSrc]);

  const Comp = () => {
    if (isPicClicked)
      return (
        <div className="relative">
          {/* <canvas id="canvas" className="" ref={canvasRef}></canvas> */}
          <div id="canvas" className=""></div>
          <button
            onClick={() => setIsPicClicked(false)}
            className="absolute right-4 top-12 rotate-90 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Close
          </button>
        </div>
      );
    return (
      <div className="relative">
        {/* <Webcam
          ref={webcamRef}
          screenshotFormat="image/png"
          className="w-full"
          videoConstraints={{
            width: { min: 640 },
            height: { min: 980 },
            aspectRatio: 0.653,
            facingMode: "environment",
            noiseSuppression: true,
            echoCancellation: true,
          }}
        /> */}
        <Camera aspectRatio={640 / 980} errorMessages={{}} ref={cameraProRef} />
        <div className="absolute bottom-2 left-0 right-0 flex items-center">
          <button
            onClick={handleCapture}
            className="mx-auto aspect-square h-16 rounded-full border-4 border-white bg-white bg-opacity-75 outline-1 outline-lime-200"
          ></button>
        </div>
        <div className="cheque frame inset absolute inset-x-16 bottom-20 top-6 rounded border-2 border-white"></div>
        {/* <div className="absolute -top-1/2 right-1 inline-block h-[80dvh] -translate-y-1/2">
          <span className="rtl inline-block rounded bg-gray-50 px-2 py-0.5 text-sm text-gray-700">
            Place the cheque inside the frame
          </span>
        </div> */}
      </div>
    );
  };

  return (
    <>
      <main
        className={clsx(font.className, "container mx-auto max-w-screen-md")}
      >
        <Comp />
        {imgSrc && (
          <img alt="al image" className="hidden" ref={imgRef} src={imgSrc} />
        )}
      </main>
    </>
  );
}
