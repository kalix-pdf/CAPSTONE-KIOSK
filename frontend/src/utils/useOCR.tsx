import { useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseCameraOptions {
  videoConstraints?: MediaTrackConstraints;
  onCaptureSuccess?: (blob: Blob, imageUrl: string) => void | Promise<void>;
  onCaptureError?: (error: Error) => void;
  onCameraError?: (errorMessage: string) => void;
}

export const useCamera = (options: UseCameraOptions = {}) => {
  const {
    videoConstraints = {
      width: { ideal: 1920, max: 1920 },
      height: { ideal: 1080, max: 1080 },
      frameRate: { ideal: 30 }
    },
    onCaptureSuccess,
    onCaptureError,
    onCameraError
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string>('');

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setError('');
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error('Error playing video:', err);
            const errorMsg = 'Failed to start video stream';
            setError(errorMsg);
            onCameraError?.(errorMsg);
          });
        };
      }
      
      toast.info("Camera ready - position your item in frame");
    } catch (error) {
      console.error('Camera access error:', error);
      
      let errorMessage = 'Unable to access camera.';
      const err = error as { name: string };
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not support the requested settings.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      onCameraError?.(errorMessage);
    }
  }, [videoConstraints, onCameraError]);

  const captureImage = useCallback(async (
    quality: number = 0.95,
    format: 'image/jpeg' | 'image/png' = 'image/jpeg'
  ): Promise<{ blob: Blob; imageUrl: string } | null> => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error('Camera not ready');
      return null;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      toast.error('Canvas not available');
      return null;
    }

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      toast.error('Video not ready yet, please wait a moment');
      return null;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          
          try {
            await onCaptureSuccess?.(blob, imageUrl);
            resolve({ blob, imageUrl });
          } catch (error) {
            const err = error as Error;
            onCaptureError?.(err);
            reject(err);
          }
        } else {
          const error = new Error('Failed to capture image');
          toast.error(error.message);
          onCaptureError?.(error);
          reject(error);
        }
      }, format, quality);
    });
  }, [onCaptureSuccess, onCaptureError]);

  return {
    videoRef,
    canvasRef,
    error,
    startCamera,
    stopCamera,
    captureImage
  };
};