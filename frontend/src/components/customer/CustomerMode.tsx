import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart, FileText, Scan, Badge } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { getTextSizeClass } from "./common/textSize";
import { translations } from "../../catalog/translation";
import Categories from "./products/Categories";
import { ProductList } from "./products/ProductList";
import { Cart } from "./cart/cart";
import { useCart } from "./cart/GlobalCart";
import { PrescriptionScanner } from "./OCR/PrescriptionScanner";
import { MedicineScannerModal } from "./OCR/MedicineScannerModal";
import { KioskHeader } from "./common/KioskHeader";
import { toast } from "sonner";

export function CustomerMode() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // kiosk header
  const [voiceAssistanceEnabled, setVoiceAssistanceEnabled] = useState(false);
  const [language, setLanguage] = useState<"en" | "fil">("en");
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">("medium");

  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [showPrescriptionScanner, setShowPrescriptionScanner] = useState(false);
  const [showMedicineScanner, setshowMedicineScanner] = useState(false);
  
  const t = translations[language];

  const { getTotalItems } = useCart();

  // Voice assistance function
  const speak = (text: string) => {
    if (!voiceAssistanceEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-US" : "fil-PH";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  };


  return (
    <>
    <KioskHeader 
      mode="customer" 
      isAuthenticated={false} 
      onLogout={() => {}} 
      voiceAssistanceEnabled={voiceAssistanceEnabled} 
      onVoiceAssistanceToggle={() => { const newState = !voiceAssistanceEnabled; 
        setVoiceAssistanceEnabled(newState);
            const message = language === "en"
              ? `Voice assistance ${newState ? "enabled" : "disabled"}`
              : `Tulong sa boses ay ${newState ? "naka-on" : "naka-off"}`;
            toast.success(message);
          }}
          language={language}
          onLanguageChange={(lang) => {
            setLanguage(lang);
            const message = lang === "en"
              ? "Language changed to English"
              : "Ang wika ay napalitan sa Filipino";
            toast.success(message);
          }}
          textSize={textSize}
          onTextSizeChange={(size) => {
            setTextSize(size);
            const sizeLabel = language === "en"
              ? size
              : size === "small" ? "maliit" : size === "medium" ? "katamtaman" : "malaki";
            const message = language === "en"
              ? `Text size changed to ${size}`
              : `Laki ng text ay napalitan sa ${sizeLabel}`;
            toast.success(message); }}/>

  {/* browse medicine mode */}
    <div className="h-screen p-6" 
      data-text-size={textSize}>
        <div className="fixed left-4 bottom-1 mb-6">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button size="lg"
                className={`relative h-16 px-8 ${getTextSizeClass("text-xl")} font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105`}
                onClick={() => speak(t.viewCart)}>
                <ShoppingCart className="h-6 w-6" /> View Cart
                {getTotalItems() > 0 && (
                  <Badge className={`absolute -top-2 -left-2 bg-red-500 text-white ${getTextSizeClass("text-sm")} px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center rounded-full`}>
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle className={getTextSizeClass("text-xl")}>{t.shoppingCart}</SheetTitle>
                <SheetDescription className={getTextSizeClass("text-base")}>
                  {t.reviewItems}
                </SheetDescription>
              </SheetHeader>
              <Cart />
            </SheetContent>
          </Sheet>
        </div>
      <div className="w-full mx-auto"> 
        <div className="flex gap-4 w-full">
          <div className="w-15 flex-initial space-y-4">
            {/* Prescription Scanner Button */}
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 border-green-400 bg-gradient-to-br from-green-50 to-white"
              onClick={() => { setShowPrescriptionScanner(true); speak(t.scanPrescription); }}>
              <CardContent className="p-5">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-green-500 p-4 rounded-2xl shadow-lg">
                    <FileText className="h-10 w-10 text-white" />
                  </div>    
                  <div className="text-center">
                    <h3 className={`${getTextSizeClass("text-xl")} font-bold text-gray-900 mb-1`}>{t.scanPrescription}</h3>
                    <p className={`${getTextSizeClass("text-base")} text-gray-600`}>{t.scanPrescriptionDesc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medicine Scanner Button */}
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 border-lightgreen-300 bg-gradient-to-br from-blue-50 to-white"
              onClick={() => { setshowMedicineScanner(true); 
                              speak(t.scanToSearch || "Scan to search"); }}>
              <CardContent className="p-5">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-lightgreen-300 p-4 rounded-2xl shadow-lg">
                    <Scan className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className={`${getTextSizeClass("text-xl")} font-bold text-gray-900 mb-1`}>{t.scanToSearch}</h3>
                    <p className={`${getTextSizeClass("text-base")} text-gray-600`}>{t.medicineScannerDesc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

                {/* <div className="flex flex-col text-center text-sm">
                  <span>A CAPSTONE/THESIS PROJECT:</span>
                  <span>Developed By: Aringo et al.,</span>
                  <span>Section: BC8DA</span>
                  <span>Github:</span>
                </div> */}
          </div>

          <div className="flex-1 border-2 rounded-xl border-lumot-600 p-6 overflow-hidden overflow-y-auto h-50vh">
            {/* Categories */}
            {!selectedCategoryId && (
              <Categories
                selectedCategoryID={selectedCategoryId ?? 0}
                setSelectedCategoryID={setSelectedCategoryId}
              />
            )}

            {/* Products List */}
            {selectedCategoryId !== null && (
              <ProductList
                setSelectedCategoryId={setSelectedCategoryId}
                selectedCategoryId={selectedCategoryId} 
                language={language}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    <PrescriptionScanner
        open={showPrescriptionScanner}
        onOpenChange={setShowPrescriptionScanner}
        onBrowser={() => {
          setShowPrescriptionScanner(false);
        }}
        />
    <MedicineScannerModal
        open={showMedicineScanner}
        onOpenChange={setshowMedicineScanner} 
        onBrowse={() => {
          setshowMedicineScanner(false);
        }}
        />
    </>

);
}