import { useEffect, useRef, useState } from "react";
import { AlertCircle, AlertTriangle, Clock, Info, Package, Pill, Shield, ShoppingCart, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { CartItem, useCart } from "../cart/GlobalCart";
import { AIOverview, Product } from "../../../services/Props";
import { generateProductDetailsAI } from "../../../services/admin/addData.api";
import { PrescriptionScanner } from "../OCR/PrescriptionScanner";

export interface ProductDetailsProps {
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
    language: "en" | "fil";
}

const aiInfoCache = new Map<string, AIOverview>();

export const ProductDetails = ({ selectedProduct, setSelectedProduct, language }: ProductDetailsProps) => {
    const [aiLoading, setAiLoading] = useState(false);
    const [aiInfo, setAiInfo] = useState<AIOverview>();
    const { addToCart } = useCart(); 
    const [showPrescriptionScanner, setShowPrescriptionScanner] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleAdd = (selectedProduct: Product) => {
        addToCart(selectedProduct);
    };

    const fetchAIInfo = async () => {
        if (!selectedProduct?.name) return;

        const cacheKey = `${selectedProduct.name}__${language}`;

        // Return cached result immediately if available
        if (aiInfoCache.has(cacheKey)) {
            setAiInfo(aiInfoCache.get(cacheKey));
            return;
        }

        // abortControllerRef.current?.abort();
        // abortControllerRef.current = new AbortController();

        try {
            setAiLoading(true);
            const result = await generateProductDetailsAI(
                selectedProduct.name,
                language,
                // abortControllerRef.current.signal 
            );
            aiInfoCache.set(cacheKey, result);
            setAiInfo(result);
        } catch (error: any) {
            if (error.name === 'AbortError') return;
            console.error('Failed to fetch AI info:', error);
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        if (selectedProduct?.name) {
            const cacheKey = `${selectedProduct.name}__${language}`;
            if (aiInfoCache.has(cacheKey)) {
                setAiInfo(aiInfoCache.get(cacheKey));
                return;
            }
            fetchAIInfo();
        }
    }, [selectedProduct, language]);
    
    return (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
                {selectedProduct && (
                    <>
                    <DialogHeader className="border-b-2 border-blue-500 pb-4">
                        <DialogTitle className="text-3xl font-bold text-blue-900">{selectedProduct.name}</DialogTitle>
                        <DialogDescription className="text-base text-gray-600">
                        Complete medication information with AI-powered guidance
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 h-full -mx-6 -mb-6 mt-4">
                        <div className="border-r border-gray-200 overflow-y-auto max-h-[70vh]">
                            <div className="p-6 border-b-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <h3 className="text-2xl font-bold text-blue-900 mb-1">{selectedProduct.name}</h3>
                                <p className="text-base text-gray-700">{selectedProduct.dosage}</p>
                            </div>

                            <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Category</p>
                                <p className="text-base text-gray-900 font-semibold">{selectedProduct.category}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Manufacturer</p>
                                <p className="text-base text-gray-900 font-semibold">{selectedProduct.manufacturer}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Barcode</p>
                                <p className="text-sm text-gray-900 font-mono">{selectedProduct.barcode}</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                                <p className="text-sm text-gray-500 mb-1">Price</p>
                                <p className="text-2xl text-blue-600 font-bold">₱{selectedProduct.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-base text-gray-600 mb-2 font-semibold">Stock Available</p>
                                <p className={`text-3xl font-bold ${selectedProduct.stock === 0 ? 'text-red-600' : selectedProduct.stock <= 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {selectedProduct.stock} units
                                </p>
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                <p className="text-base text-gray-600 mb-2 font-semibold">Active Ingredient</p>
                                <p className="text-base text-gray-900 font-bold">{selectedProduct.active_ingredients}</p>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                {selectedProduct.prescriptionrequired === 1 ? (
                                <Badge className="bg-red-500 text-base px-4 py-2">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Prescription Required
                                </Badge>
                                ) : (
                                <Badge className="bg-green-500 text-base px-4 py-2">
                                    Over-the-Counter </Badge> )}
                                <Badge variant="outline" className={`text-base px-4 py-2 font-semibold ${
                                    selectedProduct.type === 0 
                                    ? "bg-purple-50 text-purple-700 border-purple-300" 
                                    : "bg-amber-50 text-amber-700 border-amber-300"
                                }`}> {selectedProduct.type === 1 ? "Branded" : "Generic"} </Badge>
                            </div>

                            {/* <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg">
                                <p className="text-yellow-900 mb-2 text-lg font-bold flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Side Effects & Warnings
                                </p>
                                <p className="text-black-800 text-sm font-semibold leading-relaxed">{selectedProduct.side_effects}</p>
                            </div> */}

                            {selectedProduct.prescriptionrequired === 1 && (
                                <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg">
                                <p className="text-red-900 flex items-center gap-2 text-lg font-bold mb-2">
                                    <Shield className="h-5 w-5" />
                                    Prescription Required
                                </p>
                                <p className="text-red-700 text-sm">
                                    This medication requires a prescription and cannot be added to cart directly. Please use the Prescription Scanner feature to add this medication.
                                </p>
                                </div>
                            )}
                            {selectedProduct.stock === 0 && (
                                <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg">
                                <p className="text-red-900 flex items-center gap-2 text-lg font-bold mb-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Out of Stock
                                </p>
                                <p className="text-red-700 text-sm">
                                    This medication is currently unavailable. Please consult with our pharmacist for alternatives.
                                </p>
                                </div>
                            )}
                            {selectedProduct.stock > 0 && selectedProduct.stock <= 10 && (
                                <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg">
                                <p className="text-yellow-900 flex items-center gap-2 text-lg font-bold mb-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Low Stock
                                </p>
                                <p className="text-yellow-700 text-sm">
                                    Only {selectedProduct.stock} units remaining
                                </p>
                                </div>
                            )}

                            <Button className="w-full text-xl py-6 rounded-lg hover:scale-105 transition-all font-bold shadow-lg"
                                size="lg" onClick={(e) => { e.stopPropagation(); handleAdd(selectedProduct); setSelectedProduct(null); }}
                                disabled={selectedProduct.stock === 0 || selectedProduct.prescriptionrequired === 1}
                                variant={selectedProduct.prescriptionrequired === 1 ? "secondary" : "default"} >
                                {selectedProduct.prescriptionrequired === 1 ? (
                                <>
                                    <Shield className="h-6 w-6 mr-3" />
                                    Prescription Required - Cannot Add
                                </>
                                ) : (
                                <>
                                    <ShoppingCart className="h-6 w-6 mr-3" />
                                    {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </>
                                )}
                            </Button>
                            {selectedProduct.prescriptionrequired === 1 && (
                                <Button className="w-full text-base py-6 rounded-lg hover:scale-105 transition-all font-bold shadow-lg"
                                onClick={() => setShowPrescriptionScanner(true)}>
                                    <Info className="h-4 w-4" />
                                    Use Prescription Scanner instead / Gamitin ang Prescription Scanner
                                </Button>
                            )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-y-auto max-h-[70vh]">
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
                                    <p className="text-purple-900 text-xs leading-relaxed">
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
                    </div>
                    <PrescriptionScanner
                        open={showPrescriptionScanner}
                        onOpenChange={setShowPrescriptionScanner}
                        onBrowser={() => {
                            setShowPrescriptionScanner(false);
                        }}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
        
    );
}


