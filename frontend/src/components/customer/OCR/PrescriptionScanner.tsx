import { useState, useEffect, useRef } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Scan, FileText, Check, X, Pill, Loader2, AlertTriangle, CheckCircle2, Camera, LogOut } from "lucide-react";
import { Product, AIResponse } from "../../../services/Props";
import { AIPoweredOCR, uploadAndProcessImage } from "../../../services/OCR.api";
import { useCamera } from "../../../utils/useOCR";
import { toast } from 'sonner';
import { useCart } from "../cart/GlobalCart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet";
import { Cart } from "../cart/cart";
import { getTextSizeClass } from "../common/textSize";
import { InvalidDocumentView, ValidResultView } from "./DocumentScanned";

interface PrescriptionScannerProps {
  open: boolean;
  onBrowser: () => void;
  onOpenChange: (open: boolean) => void;
}

export function PrescriptionScanner({ open, onBrowser, onOpenChange }: PrescriptionScannerProps) {
  const [scanningStatus, setScanningStatus] = useState<'ready' | 'scanning' | 'processing' | 'camera' | 'complete'>('ready');
  const [AIResponse, setAIResponse] = useState<AIResponse | null>(null);
  const [recognizedMeds, setRecognizedMeds] = useState<Product[]>([]); 
  const { addToCart, setScannedID, setExtractedText, getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState<string>('');

  // Reset state when dialog opens
    useEffect(() => {
      if (open) {
        setScanningStatus('ready');
        setRecognizedMeds([]);
        setExtractedText(undefined);
        stopCamera();
      }
    }, [open]);

  const { videoRef, canvasRef, error: cameraError, startCamera, stopCamera, captureImage} = useCamera({
    onCaptureSuccess: async (blob, imageUrl) => {
      setScanningStatus('processing');
      toast.info("Document captured, processing with OCR...");

      try {
        // const result = await uploadAndProcessImage(blob, '1');
        const AIOCR = await AIPoweredOCR(blob);

        if (AIOCR) {
          setScannedID(AIOCR.scanned_id);
          setAIResponse(AIOCR);
          setExtractedText(AIOCR.extractedText);
          setRecognizedMeds(AIOCR.RecognizedMeds ?? []);
          setScanningStatus('complete');
        } else {
          setError("Something Went Wrong, Please try again Later");
        }

      } catch (error){
        const status = (error as any).status;
  
        if (status === 500) {
          setAIResponse(null);
          setRecognizedMeds([]);
          setScanningStatus('ready');
          setError("Server error. Please try again.");
        } else {
          setError("Something went wrong, please try again later");
        }
      }
    },
    onCameraError: (errorMessage) => {
      console.error('Camera error:', errorMessage);
    }
  });

  const handleStartScan = async () => {
    setScanningStatus('camera');
    await new Promise(resolve => setTimeout(resolve, 100));
    await startCamera();
  };

  const handleCapture = async () => {
    const result = await captureImage();
    if (result) {
      stopCamera();
    }
  };

  const handleCancelCamera = () => {
    stopCamera();
    setScanningStatus('ready');
  };
  
  const handleConfirm = () => {
    recognizedMeds.forEach(med => addToCart(med, 1));
    setIsCartOpen(true);
    onOpenChange(false);
  };

  const handleReset = () => {
    setRecognizedMeds([]);
    setExtractedText(undefined);
    // setScannedImageUrl('');
    setScanningStatus('ready');
  };

  // const removeMed = (id: number) => {
  //   // setRecognizedMeds(recognizedMeds.filter(m => m.id !== id));
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <Sheet open={isCartOpen} onOpenChange={isCartOpen ? undefined : setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className={getTextSizeClass("text-xl")}>Shopping Cart</SheetTitle>
            <SheetDescription className={getTextSizeClass("text-lg")}>
              Successfully Scanned Medicined From your Doctor's Prescription
            </SheetDescription>
          </SheetHeader>
          <Cart />          
            <div className="grid md:grid-cols-2 gap-2 mt-4">
              <Button size="lg"
                onClick={() => { onOpenChange(true); setIsCartOpen(false)} }> Scan Again </Button>
              <Button size="lg"
                onClick={() => { setIsCartOpen(false); onBrowser(); }}> Browse Medicine </Button>
            </div>
        </SheetContent>
      </Sheet>
      <DialogContent
      className={`${scanningStatus === "camera" ? "max-w-6xl" : "max-w-2xl"} max-h-[90vh] overflow-y-auto [&>button]:hidden`}
      hideCloseButton
      onInteractOutside={(e) => {
        if (scanningStatus === "camera") e.preventDefault();
      }}
      onEscapeKeyDown={(e) => {
        if (scanningStatus === "camera") {
          e.preventDefault();
          handleCancelCamera();
        }
      }}
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Scan Prescription Document
        </DialogTitle>
        <DialogDescription>
          {scanningStatus === "camera"
            ? "Position your prescription clearly in the frame"
            : "Press the start scan to start scanning"}
        </DialogDescription>
      </DialogHeader>
 
      <div className="space-y-1">
        {/* ── pre-complete states ── */}
        {scanningStatus !== "complete" && (
          <div className="space-y-2">
            {/* Ready */}
            {scanningStatus === "ready" && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-800 rounded-lg p-12 text-center">
                <Scan className="h-32 w-32 mx-auto text-green-900 mb-6" />
                <h3 className="text-green-900 font-semibold mb-3">Scanner Ready</h3>
                <p className="font-semibold">Place your written prescription on the scanner bed</p>
                <p className="font-semibold mb-6">Ilagay ang iyong Reseta sa ibabaw ng Scanner bed</p>
                <div className="flex flex-col gap-2 items-center">
                  <Button size="lg" className="w-fit" onClick={handleStartScan}>
                    <Scan className="h-5 w-5 mr-2" /> Start Scanning / Simulan ang pag-isKan
                  </Button>
                  <DialogClose asChild>
                    <Button
                      size="default"
                      variant="secondary"
                      className="w-36"
                      onClick={() => { if (getTotalItems() > 0) setIsCartOpen(true); }}
                    >
                      <LogOut className="h-5 w-5 mr-2" /> Cancel
                    </Button>
                  </DialogClose>
                </div>
              </div>
            )}
 
            {/* Camera */}
            {scanningStatus === "camera" && (
              <div>
                <div className="w-full overflow-hidden border-2 border-lumot-900 rounded-lg">
                  {/* <p className="absolute mt-">Click the capture photo</p> */}
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-[400px] object-contain" />
                  <div
                    className="absolute border-4 border-green-500"
                    style={{ width: 500, height: 250, top: "45%", left: "50%", transform: "translate(-50%, -50%)" }}
                  />
                </div>
                <div className="flex gap-3 justify-center mt-3">
                  <Button size="lg" variant="outline" onClick={handleCancelCamera}>Cancel</Button>
                  <Button size="lg" onClick={handleCapture} className="bg-blue-600 hover:bg-blue-700">
                    <Camera className="h-5 w-5 mr-2" /> Capture Photo
                  </Button>
                </div>
                <canvas ref={canvasRef} className="hidden h-1" />
              </div>
            )}
 
            {/* Scanning */}
            {scanningStatus === "scanning" && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-12 text-center">
                <div className="relative">
                  <FileText className="h-32 w-32 mx-auto text-green-600 mb-6" />
                  <div className="absolute inset-x-0 top-1/2 h-1 bg-green-500 animate-scan" />
                </div>
                <h3 className="text-green-900 mb-3">Scanning Document…</h3>
                <p className="text-green-700">Please wait, capturing prescription image</p>
              </div>
            )}
 
            {/* Processing */}
            {scanningStatus === "processing" && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-12 text-center">
                <Loader2 className="h-32 w-32 mx-auto text-purple-600 mb-6 animate-spin" />
                <h3 className="text-purple-900 mb-3">Processing with OCR…</h3>
                <p className="text-purple-700 mb-2">Extracting medication information</p>
                <p className="text-purple-600">This may take a few moments</p>
              </div>
            )}
 
            {/* Info footer */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="flex flex-col items-start gap-2 text-sm">
                <div>
                  <span className="text-blue-600 mr-3">ℹ️</span>
                  <span>
                    Siguraduhin na malinaw at hindi gusot gusot and reseta. Ang system ay automatikong
                    babasahin ito
                  </span>
                </div>
                <div>
                  <span className="text-blue-600m mr-3">ℹ️</span>
                  <span>
                    Make sure the prescription is clearly visible and not folded. The system will
                    automatically extract medication names, dosages, and instructions.
                  </span>
                </div>
              </p>
            </div>
          </div>
        )}
 
        {/* ── complete state: branch on Valid ── */}
        {scanningStatus === "complete" && AIResponse && (
          <>
            {/* INVALID */}
            {!AIResponse.extractedText.Valid && (
              <InvalidDocumentView
                error={AIResponse.extractedText.Error ?? "No prescription detected."}
                onReset={handleReset}
                onCancel={() => { if (getTotalItems() > 0) setIsCartOpen(true); onOpenChange(false); }}
                errorTitle="Not a prescription"
                errorIllustration="The scanned image does not appear to be a valid prescription document.
            Please ensure you are scanning a legitimate written or printed prescription."
              />
            )}
 
            {/* VALID */}
            {AIResponse.extractedText.Valid && (
              <ValidResultView
                AIResponse={AIResponse}
                recognizedMeds={recognizedMeds}
                onReset={handleReset}
                onConfirm={handleConfirm}
              />
            )}
          </>
        )}
      </div>
    </DialogContent>
    </Dialog>
    
  );
}