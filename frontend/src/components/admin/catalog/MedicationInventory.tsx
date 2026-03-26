import { Edit, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { fetchAllProducts } from "../../../services/fetchData.api";
import { DeactivateProduct } from "../../../services/admin/updateData.api";
import { Product } from "../../../services/Props";
import { EditMedication } from "./EditMedication";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { addActivityLog } from "../../../services/admin/addData.api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";

export const MedicationInventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);    
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { userId } = useAuth();

    useEffect(() => {
        getActiveProducts();
    }, [])

    const getActiveProducts = async() => {
        const result = await fetchAllProducts();
        setProducts(result);
    }

    const handleEdit = (product: Product) => {
        setIsDialogOpen(true)
        setEditingProduct(product);
    };

    const confirmDelete = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        try {
            const productId = productToDelete.id;

            const result = await DeactivateProduct(productId);

            if (result.success) {
                toast.success(result.message);
                getActiveProducts();

                addActivityLog(userId, 5, 'Deleted Product', `${productToDelete.name} has been Deactivated.`,
                    {
                        product_name: result.product_name
                    }
                )

            } else {
                toast.info(result.message);
            }
          
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);

        } catch (error) {
            toast.error("Failed to delete medication");
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
        }
      };

    return (
        <>
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Add, edit, or remove medications from the pharmacy database
            </p>
            <Button onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Medication
            </Button>
        </div>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {products.map((product) => (
                <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>{product.dosage}</TableCell>
                <TableCell>₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell>
                    <Badge variant={product.stock > 20 ? "default" : product.stock < 0 ? "destructive" : "destructive"}>
                    {product.stock} units
                    </Badge>
                </TableCell>
                <TableCell>
                    {product.prescriptionrequired ? (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                        Prescription
                    </Badge>
                    ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        OTC
                    </Badge>
                    )}
                </TableCell>
                <TableCell>
                    <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => confirmDelete(product)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        {isDialogOpen  && (
            <EditMedication 
            product={editingProduct} 
            onClose={() => { setIsDialogOpen(false); setEditingProduct(null); }}
            getActiveProducts={() => getActiveProducts()}
            />
        )}
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete Medication</AlertDialogTitle>
                <AlertDialogDescription>
                Are you sure you want to delete this medication? This action will remove it from inventory.
                </AlertDialogDescription>
            </AlertDialogHeader>
            {productToDelete && (
                <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-red-900">{productToDelete.name}</p>
                <p className="text-sm text-red-700 mt-1">{productToDelete.dosage}</p>
                <div className="mt-2 text-sm text-red-600">
                    <p>Category: {productToDelete.category}</p>
                    <p>Current Stock: {productToDelete.stock} units</p>
                    <p>Price: ₱{productToDelete.price.toFixed(2)}</p>
                </div>
                </div>
            )}
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction  onClick={handleDelete} className="bg-red-600 hover:bg-red-700" > Delete
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}