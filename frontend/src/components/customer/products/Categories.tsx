import { useEffect, useState } from "react";
import { Category } from "../../../services/Props";
import { fetchActiveCategoriesByProduct } from "../../../services/fetchData.api";
import { iconMap } from "../../../utils/iconMap";
import { Package } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";

interface CategoriesProps {
  selectedCategoryID: number;
  setSelectedCategoryID: (value: number) => void;
}

const Categories = ({selectedCategoryID, setSelectedCategoryID}: CategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveCategoriesByProduct()
      .then(res => {
        setCategories(res); 
      })
      .catch(console.error).finally(() => setLoading(false));
  }, []); 

  if (loading) return <p className="flex items-center justify-center">Please Wait while waking up the Server...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] ?? Package;

        return (
          <Card
            key={category.id}
            className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-200 hover:border-blue-500"
            onClick={() => setSelectedCategoryID(category.id)}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`${category.color} p-5 rounded-2xl shadow-lg`}>
                  <Icon className="h-12 w-12 text-white" /> </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {category.name} </h3>

                <Badge variant="secondary" className="text-sm px-4 py-1">
                  {category.medications_per_category } Medication{category.medications_per_category !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Categories;
