// utils/cameraHelpers.ts
/**
 * Stops a media stream and cleans up video element
 */
export const stopMediaStream = (
  stream: MediaStream | null,
  videoElement?: HTMLVideoElement | null
): void => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  if (videoElement) {
    videoElement.srcObject = null;
  }
};

/**
 * Gets user-friendly camera error messages
 */
export const getCameraErrorMessage = (error: unknown): string => {
  const err = error as { name?: string; message?: string };
  
  if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
    return 'Camera permission denied. Please allow camera access in your browser settings.';
  } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
    return 'No camera found on this device.';
  } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
    return 'Camera is already in use by another application.';
  } else if (err.name === 'OverconstrainedError') {
    return 'Camera does not support the requested settings.';
  }
  
  return err.message || 'Unable to access camera.';
};

/**
 * Captures an image from a video element
 */
export const captureVideoFrame = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality: number = 0.95
): Promise<Blob> => {
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Canvas context not available');
  }

  if (video.readyState !== video.HAVE_ENOUGH_DATA) {
    throw new Error('Video not ready');
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      format,
      quality
    );
  });
};