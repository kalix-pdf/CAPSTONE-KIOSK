import { AlertCircle, Edit2, Plus, Tag, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { fetchCategories } from "../../../services/fetchData.api";
import { Category } from "../../../services/Props";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { addNewCategory, addActivityLog } from "../../../services/admin/addData.api";
import { getRandomColor, getRandomIcon } from "../../../utils/iconMap";
import { useAuth } from "../AuthContext";
import { deleteCategory } from "../../../services/admin/updateData.api";

export const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editCategory, setCategoryEdit] = useState<number>();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [editDialog, setEditDialog] = useState(false);
    const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const { userId } = useAuth();

    useEffect(() => {
        getCategories();
    }, []); 
    
    const getCategories = async() => {
      const result = await fetchCategories();
      setCategories(result);
    }

    const confirmDeleteCategory = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteCategoryDialogOpen(true);
    };

    const handleAddCategory = async () => {
      if (!newCategoryName.trim()) {
        toast.error("Please enter a category name");
        return;
      }
      let result;

      if (editCategory) {
        result = await addNewCategory({name: newCategoryName, id: editCategory});   
      } else {
        result = await addNewCategory({name: newCategoryName, icon: getRandomIcon(), color: getRandomColor(), id: editCategory});   
      }

      
      if (result.success) {
        toast.success(result.message);
        getCategories();

      } else {
        toast.info(result.message);
      }

      addActivityLog(userId, 2, 'Created new Category', `New Addded Category: ${newCategoryName.trim()}`,
      {
        category_name: result.category_name
      });

      setNewCategoryName("");
      setCategoryEdit(0);
      setIsCategoryDialogOpen(false);
    };

    const handleDeleteCategory = async() => {
        if (!categoryToDelete) return;
    
        const result = await deleteCategory(categoryToDelete.id);
        if (result.success) {
          toast.success("Category deleted successfully");
          getCategories();

        } else {
          toast.error("Something went wrong");
        }

        setIsDeleteCategoryDialogOpen(false);
        setCategoryToDelete(null);
    };

    return (
        <>
        {/* EDIT CATEG */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Manage medicine categories for better organization
          </p>
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for organizing medications
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input id="categoryName" value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Mental Health, Skin Care" onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                    Cancel </Button>
                  <Button onClick={handleAddCategory}>
                    Add Category </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
          
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
            const medicationCount = category.medications_per_category
            const isInUse = medicationCount > 0 ;

            return ( <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                      <div className="flex-1">
                      <div className="flex items-center gap-2">
                          <Tag className="h-5 w-5 text-blue-600" />
                          <h3 className="text-gray-900">{category.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                          {medicationCount} medication{medicationCount !== 1 ? 's' : ''}
                      </p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => { setEditDialog(true); setNewCategoryName(category.name); setCategoryEdit(category.id) }}>
                          <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => confirmDeleteCategory(category)}
                          disabled={isInUse} className="text-red-600 hover:text-red-700 hover:bg-red-50" >
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
                  {isInUse && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-amber-600">
                          <AlertCircle className="h-3 w-3" /> <span>In use - cannot delete</span>
                      </div>
                  )}
                </CardContent>
            </Card>
            );
        })}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No categories yet</p>
            <p className="text-gray-500 text-sm mt-2">Click "Add Category" to create your first category</p>
          </div>
        )}
        </div>
        

        {/* EDIT CATEGORY Name */}
        <AlertDialog open={editDialog} onOpenChange={setEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Category</AlertDialogTitle>
            <AlertDialogDescription>
              Edit Category Name
            </AlertDialogDescription>
          </AlertDialogHeader>
          {editCategory && (
            <div className="my-4 p-4 bg-blue-50 border border-blue-500 rounded-lg">
              <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input id="categoryName" value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory();
                      }
                    }}
                  />
                </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setNewCategoryName(""); setCategoryEdit(0)}}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddCategory}
              className="bg-blue-500 hover:bg-cyan-500"> Update </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>

        {/* DELETE CATEG */}
        <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action will remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {categoryToDelete && (
            <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-red-700" />
                <p className="font-semibold text-red-900">{categoryToDelete.name}</p>
              </div>
              <div className="mt-2 text-sm text-red-600">
                <p>Medications using this category: {categoryToDelete.medications_per_category}</p>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"> Delete </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      </>
    );
}