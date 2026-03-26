import { Dialog, DialogContent, DialogDescription, DialogTrigger } from "../../ui/dialog";
import { Product, Category } from "../../../services/Props";
import { Button } from "../../ui/button";
import { DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import { fetchCategories } from "../../../services/fetchData.api";
import { updateProduct } from "../../../services/admin/updateData.api";
import { useAuth } from "../AuthContext";
import { detectChanges } from "../../../utils/detectChanges";
import { addProduct, addActivityLog } from "../../../services/admin/addData.api";
import { Trash2, Image, Loader2 } from "lucide-react";

export const EditMedication = ( { product, onClose, getActiveProducts}: { product: Product | null; onClose: () => void; getActiveProducts: () => void }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [uploading, setUploading] = useState(false);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({
            id: product?.id,
            name: product?.name ?? "",
            image: product?.image ?? "https://res.cloudinary.com/dhnmtnw3c/image/upload/v1774519494/placeholder_fohhpp.png",
            public_id: product?.public_id ?? "",
            category: "",
            dosage: product?.dosage ?? "",
            prescriptionrequired: product?.prescriptionrequired ?? 0,
            manufacturer: product?.manufacturer ?? "",
            barcode: product?.barcode ?? "",
            price: product?.price ?? 0,
            stock: product?.stock ?? 0,
            type: product?.type ?? 0,
            active_ingredients: product?.active_ingredients ?? "",
            // description: product?.description ?? "",
            // side_effects: product?.side_effects ?? "",
          });
    const { userId } = useAuth();
    
    useEffect(() => {
        fetchCategories()
            .then(res => {
                setCategories(res);
                const matchedCat = res.find(cat => cat.name === product?.category_name);
                setFormData(prev => ({
                    ...prev,
                    category: String(matchedCat?.id ?? ""),
                }));
                setCategoriesLoaded(true);
            })
            .catch(console.error);
    }, []);

    const getImageSrc = (image: File | string | null): string => {
        if (image instanceof File) {
        return URL.createObjectURL(image);
        }
        if (typeof image === 'string') {
        return image.replace("/upload/", "/upload/f_auto,q_auto/");
        }
        return '';
    };

    const handleCloseDialog = () => {
        onClose();
        setFormData({
            name: "",
            category: "",
            dosage: "",
            prescriptionrequired: 0,
            manufacturer: "",
            barcode: "",
            price: 0,
            stock: 0,
            active_ingredients: "",
            type: 0
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        const form = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
            form.append(key, value as string | Blob);
            }
        });
    
        try {
            if (product?.id) {
                const DetectedChanges = detectChanges(formData, product);

                const result = await updateProduct(form);
                
                addActivityLog(userId, 3, 'Product Edited', `${product.name} has been Edited`,
                {
                    productId: product.id,
                    changes: DetectedChanges
                });

                if (result.success) {
                    toast.info("Product Updated Successfully!");
                    getActiveProducts();
                    onClose();
                    
                    setFormData({
                        name: "",
                        category: "",
                        dosage: "",
                        prescriptionrequired: 0,
                        manufacturer: "",
                        barcode: "",
                        price: 0,
                        active_ingredients: "",
                        stock: 0,
                    });
                } 
            } 
            else {
                const result = await addProduct(form);

                if (result.success) {
                    toast.success(result.message);
                    getActiveProducts();
                    onClose();

                    addActivityLog(userId, 1, 'Added New Product', `${formData.name} has been added to the inventory`,
                    {
                        productId: result.product_id,
                    });

                    onClose();

                } else {
                    toast.error(result.message);
                }
            }
        } catch (error) {
            toast.message("Failed to save product");
        }
    };
    
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogTrigger asChild>
                
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle>{product ? "Edit Medication" : "Add New Medication"}</DialogTitle>
                <DialogDescription>
                    {product ? "Update medication information" : "Enter medication details to add to the inventory"}
                </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition cursor-pointer">
                            {formData.image ? (
                                <div className="relative">
                                <img src={getImageSrc(formData.image)}
                                    alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                <button onClick={() => setFormData({ ...formData, image: undefined })}
                                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition" >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                </div>
                            ) : (
                                <>
                                <input type="file" accept="image/*" className="hidden"
                                    id="image" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] ?? undefined }) } />
                                <label htmlFor="image" className="cursor-pointer">
                                    <div className="flex flex-col items-center gap-2 p-4">
                                    <Image className="w-8 h-8 text-gray-400" />
                                    <p className="text-gray-600">Click to upload or drag and drop</p>
                                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                </label>
                                </>
                            )}
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Medication Name</Label>
                                <Input id="name" value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Ibuprofen 200mg" required className="capitalize" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input id="dosage" value={formData.dosage}
                                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                    placeholder="e.g., 200mg tablets" required className="capitalize" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                {categoriesLoaded ? (
                                    <Select value={formData.category} required
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div>Loading...</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="activeIngredient">Active Ingredient</Label>
                                <Input id="activeIngredient" value={formData.active_ingredients}
                                    onChange={(e) => setFormData({ ...formData, active_ingredients: e.target.value })}
                                    placeholder="e.g., Ibuprofen" required className="capitalize" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="manufacturer">Manufacturer</Label>
                                <Input id="manufacturer" value={formData.manufacturer}
                                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                                    placeholder="e.g., PharmaCo" required className="capitalize" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="barcode">Barcode</Label>
                                <Input id="barcode" value={formData.barcode}
                                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                    placeholder="e.g., 5601234567890" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₱)</Label>
                                <Input id="price" type="number" step="0.50" min="0" value={formData.price || 0}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    placeholder="e.g., 449.50" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input id="stock" type="number" min="0" value={formData.stock || 0}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    placeholder="e.g., 45" required />
                            </div>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center space-x-2">
                        <Switch id="prescriptionRequired" checked={formData.prescriptionrequired === 1}
                            onCheckedChange={(checked: boolean) =>
                                setFormData({ ...formData, prescriptionrequired: checked ? 1 : 0 })} />
                        <Label htmlFor="prescriptionRequired">Requires Prescription</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Label>Generic</Label>
                        <Switch id="type" checked={formData.type === 1}
                            onCheckedChange={(checked: boolean) =>
                                setFormData({ ...formData, type: checked ? 1 : 0 })} />
                        <Label>Branded</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" disabled={uploading}>
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                product ? "Update Medication" : "Add Medication"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};




                {/* <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} className="capitalize"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2} placeholder="Describe the medication and usage instructions" required/>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sideEffects">Side Effects & Warnings</Label>
                    <Textarea id="sideEffects" value={formData.side_effects} onChange={(e) => setFormData({ ...formData, side_effects: e.target.value })}
                    rows={2} placeholder="List potential side effects and warnings" required className="capitalize"/>
                </div> */}