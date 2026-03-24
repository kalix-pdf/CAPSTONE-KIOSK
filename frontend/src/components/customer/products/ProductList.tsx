import React, { useEffect, useState } from "react";
import { ProductDetails } from "./ProductDetails";
import { Product } from "../../../services/Props";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardImage, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { fetchProductsByCategory } from "../../../services/fetchData.api";

interface ProductListProps { 
  setSelectedCategoryId: (id: number | null) => void;
  selectedCategoryId: number | null; 
}

export const ProductList = ({setSelectedCategoryId, selectedCategoryId}: ProductListProps) => {
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setCategoryProducts([]);
    if (selectedCategoryId === null || selectedCategoryId === 0) return;

    setLoading(true);
    fetchProductsByCategory(selectedCategoryId)
      .then(setCategoryProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategoryId]);
  
  return (
    <>
    <div className="bg-gray overflow-y-auto max-h-screen">
      <Button variant="outline" onClick={() => setSelectedCategoryId(null)} className="mb-6" >
        ← Back to Categories
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{          categoryProducts.map((product) => (
            <Card key={product.id} onClick={() => setSelectedProduct(product)} 
              className="cursor-pointer hover:shadow-lg transition-shadow shadow-md">
              <CardImage src={`/images/${product.image_url}`} alt={product.name} />

              <CardContent className="flex-1 flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle>{product.name} {product.dosage}</CardTitle>
                               
                
                </CardHeader>
              
                {/* <CardDescription className="text-justify ">
                  {product.description}; <span className="font-semibold">Tap to view more Information.</span> 
                </CardDescription> */}

              </CardContent>

              <CardFooter className="flex-col items-start gap-2 mt-4">
                <div className="flex gap-2">
                  <Badge variant={product.type === 1 ? "yellow" : "destructive"}>
                    {product.type === 1 ? "Branded" : "Generic"} </Badge>
                  <Badge>₱{product.price.toFixed(2)}</Badge>
                </div>
                <Badge variant="default">
                      Manufacturer: {product.manufacturer}
                    </Badge>     
              </CardFooter>

              <Button className="w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none" 
                variant={product.prescriptionrequired === 1 ? "secondary" : "default"}
                disabled={product.prescriptionrequired === 1}>
                <ShoppingCart className="mr-2" />
                {product.prescriptionrequired === 1 ? "Requires Prescription" : "Add to Cart"}
              </Button>
                
            </Card>
          ))
        }
      </div>
    </div>

    <ProductDetails
      selectedProduct={selectedProduct}
      setSelectedProduct={setSelectedProduct}
    />
    </>
  );
};