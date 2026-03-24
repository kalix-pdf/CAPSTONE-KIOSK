import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Scan, FileText, Check, X, Pill, Loader2, AlertTriangle, CheckCircle2, Camera, LogOut, Sparkles, Clock, AlertCircle, Shield, Package, Info } from "lucide-react";
import { toast } from "sonner";
import { Product, AIResponse, AIOverview } from "../../../services/Props";
import { AIPoweredOCRMedicine, uploadAndProcessImage } from "../../../services/OCR.api";
import { useCamera } from "../../../utils/useOCR";
import { DialogClose } from "@radix-ui/react-dialog";
import { useCart } from "../cart/GlobalCart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet";
import { generateProductDetailsAI } from "../../../services/admin/addData.api";
import { Cart } from "../cart/cart";
import { getTextSizeClass } from "../common/textSize";
import { AccuracyBar, InvalidDocumentView, SectionLabel } from "./DocumentScanned";

interface MedicineScannerProps {
  open: boolean;
  onBrowse: () => void;
  onOpenChange: (open: boolean) => void;
}

export function MedicineScannerModal({ open, onOpenChange, onBrowse }: MedicineScannerProps) {
  const [scanningStatus, setScanningStatus] = useState<'ready' | 'scanning' | 'processing' | 'camera' | 'complete'>('ready');
  const [AIResponse, setAIResponse] = useState<AIResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [recognizedMeds, setRecognizedMeds] = useState<Product | null>();
  const [aiInfo, setAIinfo] = useState<AIOverview>(); 
  const [error, setError] = useState<string>('');
  const { addToCart, setExtractedText, getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [accuracy, setAccuracy] = useState<number | 0>(0);
  
  useEffect(() => {
    if (open) {
      setScanningStatus('ready');
      setRecognizedMeds(null);
      setExtractedText(undefined);
      stopCamera();
    }
  }, [open]);

  const { videoRef, canvasRef, error: cameraError, startCamera, stopCamera, captureImage} = useCamera({
      onCaptureSuccess: async (blob, imageUrl) => {
        setScanningStatus('processing');
        toast.info("Document captured, processing with OCR...");
  
        try {
          // const result = await uploadAndProcessImage(blob, '2');
          const AIOCR = await AIPoweredOCRMedicine(blob);

          if (AIOCR) {
            setAIResponse(AIOCR);
            setExtractedText(AIOCR.extractedText);

            const AccuracyLevel = Number(AIResponse?.extractedText.AccuracyLevel)
            setAccuracy(AccuracyLevel);

            const matchedProduct = Array.isArray(AIOCR.RecognizedMeds) 
              ? AIOCR.RecognizedMeds[0] ?? null 
              : null;
            setRecognizedMeds(matchedProduct);

            // const medName = AIOCR.extractedText.ExtractedText?.BrandName ?? 
            //   AIOCR.extractedText.ExtractedText?.GenericName ?? null;

            // if (medName) {
            //   const medicineInformation = await generateProductDetailsAI(medName);
            //   setAIinfo(medicineInformation);
            // } else {
            //   toast.info("Cannot Find Medicine");
            // }

            setScanningStatus('complete');
          } else {
            setError("Something Went Wrong, Please try again Later");
          }
  
        } catch (error){
          const status = (error as any).status;
    
          if (status === 503) {
            setAIResponse(null);
            setRecognizedMeds(null);
            setScanningStatus('ready');
            setError("AI service is temporarily unavailable. Please try again later.");
          } else if (status === 500) {
            setAIResponse(null);
            setRecognizedMeds(null);
            setScanningStatus('ready');
            setError("Server error. Please try again.");
          } else {
            setAIResponse(null);
            setRecognizedMeds(null);
            setScanningStatus('ready');
            setError("Something went wrong, please try again later.");
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
      if (!recognizedMeds) return;
      addToCart(recognizedMeds);
      setIsCartOpen(true);
      onOpenChange(false);
    };
  
    const handleReset = () => {
      setRecognizedMeds(null);
      setExtractedText(undefined);
      setScanningStatus('ready');
    };
  
    // const removeMed = (id: number) => {
    //   setRecognizedMeds(recognizedMeds.filter(m => m.id !== id));
    // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Sheet open={isCartOpen} onOpenChange={isCartOpen ? undefined : setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className={getTextSizeClass("text-xl")}>Shopping Cart</SheetTitle>
            <SheetDescription className={getTextSizeClass("text-base")}>
              Review your items and checkout to get your queue number
            </SheetDescription>
          </SheetHeader>
          <Cart />          
            <div className="grid md:grid-cols-2 gap-2 mt-4">
              <Button size="lg"
                onClick={() => { onOpenChange(true); setIsCartOpen(false)} }> Scan Again </Button>
              <Button size="lg"
                onClick={() => { setIsCartOpen(false); onBrowse(); }}> Browse Medicine </Button>
            </div>
        </SheetContent>
      </Sheet>
      <DialogContent className={`${scanningStatus === 'ready' ? 'max-w-2xl' : ' max-w-6xl'} max-h-[90vh] overflow-y-auto [&>button]:hidden`}
        hideCloseButton={true}
        onInteractOutside={(e) => {
          if (scanningStatus === 'camera') {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (scanningStatus === 'camera') {
            e.preventDefault();
            handleCancelCamera();
          }
        }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Scan Medicine Label or Packaging
          </DialogTitle>
          <DialogDescription>
            {scanningStatus =='camera'}Position your Medicine Label clearly in the frame
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {scanningStatus !== 'complete' && (
            <div className="space-y-2">
                {/* Scanner Status Display */}
                {scanningStatus === 'ready' && (
                  <div className="bg-gradient-to-br from-lightgreen-50 to-lightgreen-100 border-2 border-lightgreen-300 rounded-lg p-12 text-center">
                    <Scan className="h-32 w-32 mx-auto text-lightgreen-300 mb-6" />
                    <h3 className="text-lightgreen-300 font-semibold mb-3">Scanner Ready</h3>
                    <p className="font-semibold mb-6">Place your Medicine Packaging or Label on the Scanner Bed</p>
                    <div className="flex flex-col gap-2 items-center">
                      <Button size="lg" className="w-fit flex-none" onClick={handleStartScan}>
                        <Scan className="h-5 w-5 mr-2" /> Start Scanning </Button>
                      <DialogClose asChild>
                        <Button size="default" onClick={() => {
                          if (getTotalItems() > 0) {
                            setIsCartOpen(true);  
                          }
                          }} className="w-36 flex-none" variant="secondary">
                          <LogOut className="h-5 w-5 mr-2" /> Cancel</Button>
                      </DialogClose>
                    </div>
                  </div>
                )}

                {scanningStatus === 'camera' && (
                  <div>
                    <div className="w-full overflow-hidden border-2 border-lumot-900 rounded-lg">
                      <video ref={videoRef} autoPlay playsInline
                        muted className="w-full h-[400px] object-contain"/>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button size="lg" variant="outline" onClick={handleCancelCamera}>
                        Cancel </Button>
                      <Button size="lg" onClick={handleCapture} className="bg-blue-600 hover:bg-blue-700">
                        <Camera className="h-5 w-5 mr-2" />
                        Capture Photo </Button>
                    </div>

                    <canvas ref={canvasRef} className="hidden h-1" />
                  </div>
                )}

                {scanningStatus === 'scanning' && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-12 text-center">
                    <div className="relative">
                      <FileText className="h-32 w-32 mx-auto text-green-600 mb-6" />
                      <div className="absolute inset-x-0 top-1/2 h-1 bg-green-500 animate-scan"></div>
                    </div>
                    <h3 className="text-green-900 mb-3">Scanning Document...</h3>
                    <p className="text-green-700">Please wait, capturing prescription image</p>
                  </div>
                )}

                {scanningStatus === 'processing' && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-12 text-center">
                    <Loader2 className="h-32 w-32 mx-auto text-purple-600 mb-6 animate-spin" />
                    <h3 className="text-purple-900 mb-3">Processing with OCR...</h3>
                    <p className="text-purple-700 mb-2">Extracting medication information</p>
                    <p className="text-purple-600">This may take a few moments</p>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <p className="text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600">ℹ️</span>
                    <span>Make sure the prescription is clearly visible and not folded. The system will automatically extract medication names, dosages, and instructions.</span>
                  </p>
                </div>
              </div>
          )}
          {/* Scanned Results */}
          {scanningStatus === "complete" && AIResponse && (
            <>
              {!AIResponse.extractedText.Valid && (
                <InvalidDocumentView
                  error={AIResponse.extractedText.Error ?? "No prescription detected."}
                  onReset={handleReset}
                  onCancel={() => { if (getTotalItems() > 0) setIsCartOpen(true); onOpenChange(false); }}
                  errorTitle="Not A Medicine Label or Packaging"
                  errorIllustration="The scanned image does not appear to be a valid Medicine packaging.
                    Please ensure you are scanning a Medicine"
                />
              )}

              {AIResponse.extractedText.Valid && (
                <div className="grid md:grid-cols-2 gap-2">   
                  <div className="rounded-lg border border-lumot-900 bg-card p-4">
                      <SectionLabel>Recognized Medicine:</SectionLabel>
                      <div className="rounded-md border mb-2 bg-secondary/50 border-blue-500 p-4">
                        <p className="font-medium text-lg">
                          {AIResponse.extractedText.ExtractedText?.BrandName ?? 
                          AIResponse.extractedText.ExtractedText?.GenericName ?? 
                          "Unknown medicine"}
                        </p>

                        {AIResponse.extractedText.ExtractedText?.GenericName && (
                          <p className="text-lg text-muted-foreground">
                            Generic: {AIResponse.extractedText.ExtractedText.GenericName}
                          </p>
                        )}

                        <p className="text-lg text-muted-foreground">
                          {[
                            AIResponse.extractedText.ExtractedText?.DosageStrength,
                            AIResponse.extractedText.ExtractedText?.DosageForm,
                            AIResponse.extractedText.ExtractedText?.ExpiryDate && 
                              `Exp: ${AIResponse.extractedText.ExtractedText.ExpiryDate}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <SectionLabel>Available in Kiosk</SectionLabel>
                        <Badge variant={recognizedMeds ? "secondary" : "outline"}>
                          {recognizedMeds ? "1 matched" : "No match"}
                        </Badge>
                      </div>

                      {recognizedMeds ? (
                        <div className="flex items-center gap-3 py-1 mb-3">
                          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <Check className="h-3.5 w-3.5 text-green-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium truncate">{recognizedMeds.name}</p>
                            <p className="text-sm text-muted-foreground">{recognizedMeds.dosage}</p>
                            <div className="flex gap-1.5 mt-1.5 flex-wrap">
                              <Badge variant={recognizedMeds.stock > 0 ? "secondary" : "destructive"}
                                className="text-[10px] p-2">
                                {recognizedMeds.stock > 0 ? "In stock" : "Out of stock"}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] p-2">
                                ₱{recognizedMeds.price.toLocaleString("en-PH", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 space-y-1">
                          <Pill className="h-7 w-7 mx-auto text-muted-foreground/40" />
                          <p className="text-sm font-medium">No matching product</p>
                          <p className="text-base text-muted-foreground">
                            {AIResponse.message ?? "This medicine is not currently available in the kiosk."}
                          </p>
                        </div>
                      )}
                      <div className="rounded-lg border bg-card p-4">
                        <AccuracyBar level={accuracy ?? 0} />
                      </div>
                      <div className={`flex gap-3 items-start p-3 rounded-lg border text-sm ${
                          accuracy < 70
                            ? "bg-red-50 border-red-200 text-red-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}>
                        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {accuracy <= 70 ? "Pharmacist review strongly recommended" : "Pharmacist verification required"}
                          </p>
                          <p className="text-sm mt-0.5 opacity-80">
                            {accuracy < 80
                              ? `Confidence is ${AIResponse.extractedText.Accuracy}% — below the 75% threshold. A pharmacist must manually verify the original prescription.`
                              : "A licensed pharmacist must confirm this Medicine before dispensing any medication."}
                          </p>
                        </div>
                      </div>

                  </div>  
                  {/* AI POWERED medicine information */}
                  <div className="flex-1 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-y-auto max-h-[70vh]">
                    <div className="p-6 border-b-2 border-purple-500 bg-gradient-to-r from-purple-100 to-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-7 w-7 text-purple-600" />
                        <h3 className="text-2xl font-bold text-purple-900">AI-Powered Information</h3>
                    </div>
                    <p className="text-sm text-purple-700">Comprehensive medication guidance powered by AI</p>
                    </div>

                    <div className="p-6">
                    {aiLoading ? (
                        <div className="space-y-4 animate-pulse">
                        <div className="flex items-center gap-3 text-purple-600">
                            <Clock className="h-5 w-5 animate-spin" />
                            <span className="text-base font-semibold">Generating AI insights...</span>
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-purple-200 rounded w-full"></div>
                            <div className="h-4 bg-purple-200 rounded w-5/6"></div>
                            <div className="h-4 bg-purple-200 rounded w-4/6"></div>
                        </div>
                        </div>
                    ) : aiInfo ? (
                        <div className="space-y-5">
                        <div className="bg-white p-4 rounded-lg border-2 border-purple-200 shadow-sm">
                            <h4 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Overview
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{aiInfo.overview}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border-2 border-blue-200 shadow-sm">
                            <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <Pill className="h-5 w-5" /> How to Use </h4>
                            <ul className="space-y-2">
                            {aiInfo?.howToUse?.map((instruction: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                <span>{instruction}</span>
                                </li>
                            ))}
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg border-2 border-green-200 shadow-sm">
                            <h4 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Dosage Recommendations
                            </h4>
                            <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-700">Adults:</span>
                                <span className="text-gray-600 text-right ml-2">{aiInfo?.dosageRecommendations?.adults}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-700">Elderly:</span>
                                <span className="text-gray-600 text-right ml-2">{aiInfo?.dosageRecommendations?.elderly}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-700">Children:</span>
                                <span className="text-gray-600 text-right ml-2">{aiInfo?.dosageRecommendations?.children}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-green-200">
                                <p className="text-green-800 font-semibold">{aiInfo?.dosageRecommendations?.notes}</p>
                            </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border-2 border-red-200 shadow-sm">
                            <h4 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Drug Interactions
                            </h4>
                            <ul className="space-y-2">
                            {aiInfo?.drugInteractions?.map((interaction: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-red-600 font-bold mt-0.5">⚠</span>
                                <span>{interaction}</span>
                                </li>
                            ))}
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg border-2 border-orange-200 shadow-sm">
                            <h4 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Precautions
                            </h4>
                            <ul className="space-y-2">
                            {aiInfo?.precautions?.map((precaution: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-orange-600 font-bold mt-0.5">⚠</span>
                                <span>{precaution}</span>
                                </li>
                            ))}
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg border-2 border-indigo-200 shadow-sm">
                            <h4 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Storage Instructions
                            </h4>
                            <ul className="space-y-2">
                            {aiInfo?.storageInstructions?.map((instruction: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                                <span>{instruction}</span>
                                </li>
                            ))}
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg border-2 border-pink-200 shadow-sm">
                            <h4 className="text-lg font-bold text-pink-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            When to Seek Medical Help
                            </h4>
                            <ul className="space-y-2">
                            {aiInfo?.whenToSeekHelp?.map((situation: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-pink-600 font-bold mt-0.5">⚕</span>
                                <span>{situation}</span>
                                </li>
                            ))}
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg border-2 border-cyan-200 shadow-sm">
                            <h4 className="text-lg font-bold text-cyan-900 mb-3 flex items-center gap-2">
                            <Info className="h-5 w-5" /> Frequently Asked Questions </h4>
                            <div className="space-y-3">
                            {aiInfo?.faqs?.map((faq: string, idx: number) => {
                            const [question, answer] = faq.split(" A: ");
                                return (
                                    <div key={idx} className="border-b border-cyan-100 pb-3 last:border-0 last:pb-0">
                                    <p className="font-semibold text-cyan-900 text-sm mb-1">
                                        {question.replace("Q: ", "")}
                                    </p>
                                    <p className="text-gray-700 text-sm">{answer}</p>
                                    </div>
                                );
                            })}
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-purple-300">
                            <p className="text-purple-900 leading-relaxed">
                            <strong>AI Disclaimer:</strong> This information is generated by AI for general educational purposes only. Always consult your healthcare provider for personalized medical advice. This does not replace professional medical consultation.
                            </p>
                        </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                        <Sparkles className="h-12 w-12 mx-auto text-purple-300 mb-4" />
                        <p>AI information will appear here</p>
                        </div>
                    )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleReset} className="flex-1">
                      Scan Again </Button>
                    <Button onClick={handleConfirm} disabled={recognizedMeds === null}
                      className="flex-1" >
                      Add to Cart ({recognizedMeds?.name})
                    </Button>
                  </div>
                </div>
              )}
              
            </>
          )}

           
        </div>
       
      </DialogContent>
    </Dialog>
  );
} 