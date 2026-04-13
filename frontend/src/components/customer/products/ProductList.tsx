import React, { useEffect, useState } from "react";
import { ProductDetails } from "./ProductDetails";
import { Product } from "../../../services/Props";
import { ShoppingCart, ArrowLeft, Pill, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { fetchProductsByCategory } from "../../../services/fetchData.api";

interface ProductListProps {
  setSelectedCategoryId: (id: number | null) => void;
  selectedCategoryId: number | null;
  language: "en" | "fil";
}

/* ─── Skeleton loader ─────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 animate-pulse">
    <div className="h-52 bg-gradient-to-br from-slate-100 to-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 rounded-full w-3/4 mx-auto" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2 mx-auto" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 bg-slate-200 rounded-full w-20" />
        <div className="h-6 bg-slate-200 rounded-full w-16" />
      </div>
      <div className="h-9 bg-slate-100 rounded-xl w-full mt-2" />
    </div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
export const ProductList = ({
  setSelectedCategoryId,
  selectedCategoryId,
  language,
}: ProductListProps) => {
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    setCategoryProducts([]);
    if (selectedCategoryId === null || selectedCategoryId === 0) return;
    setLoading(true);
    fetchProductsByCategory(selectedCategoryId)
      .then(setCategoryProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategoryId]);

  const getImageSrc = (image: File | string | null): string => {
    if (image instanceof File) return URL.createObjectURL(image);
    if (typeof image === "string")
      return image.replace("/upload/", "/upload/f_auto,q_auto/");
    return "";
  };

  return (
    <>
      {/* ── Page wrapper ── */}
      <div style={{ minHeight: "100vh",
          padding: "1rem 1.5rem",
          fontFamily: "'DM Sans', 'Outfit', sans-serif",}}>

        <button
          onClick={() => setSelectedCategoryId(null)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginBottom: "2rem",
            padding: "0.55rem 1.2rem",
            borderRadius: "999px",
            border: "1.5px solid #e2e8f0",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            color: "#475569",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#fff";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 12px rgba(0,0,0,0.1)";
            (e.currentTarget as HTMLButtonElement).style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.85)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 1px 4px rgba(0,0,0,0.06)";
            (e.currentTarget as HTMLButtonElement).style.color = "#475569";
          }}
        >
          <ArrowLeft size={15} />
          Back to Categories
        </button>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : categoryProducts.map((product, index) => {
                // const isHovered = hoveredId === product.id;
                const isBranded = product.type === 1;
                const needsRx = product.prescriptionrequired === 1;

                return (
                  <div key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 
                      border-2 border-gray-200 flex flex-col">
                    {/* Image area */}
                    <div className="relative bg-blue-100 overflow-hidden" style={{ height: "200px",
                      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
                     }}>
                      <img src={getImageSrc(product.image)}
                        alt={product.name}
                        className="w-full h-full"
                        style={{ objectFit: "contain",
                          padding: "1rem",}}/>

                      <span
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          right: "0.75rem",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "999px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          background: isBranded
                            ? "linear-gradient(135deg, #fef9c3, #fde68a)"
                            : "linear-gradient(135deg, #fee2e2, #fecaca)",
                          color: isBranded ? "#92400e" : "#991b1b",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }}>
                        {isBranded ? "✦ Branded" : "Generic"}
                      </span>

                      {/* Prescription badge */}
                      {needsRx && (
                        <span
                          style={{
                            position: "absolute",
                            top: "0.75rem",
                            left: "0.75rem",
                            padding: "0.25rem 0.65rem",
                            borderRadius: "999px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            background: "rgba(15,23,42,0.85)",
                            color: "#e2e8f0",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          Rx
                        </span>
                      )}
                    </div>

                    {/* Card body */}
                    <div
                      style={{
                        padding: "1.25rem 1.25rem 0",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Name + dosage */}
                      <h3
                        style={{
                          margin: "0 0 0.25rem",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#0f172a",
                          lineHeight: 1.3,
                        }}
                      >
                        {product.name}
                      </h3>
                      {product.dosage && (
                        <p className="text-sm"
                          style={{
                            margin: "0 0 0.75rem",
                            color: "#94a3b8",
                            fontWeight: 500,
                          }}
                        >
                          {product.dosage}
                        </p>
                      )}

                      {/* Manufacturer */}
                      <p
                        style={{
                          margin: "0 0 1rem",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#10b981",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        {product.manufacturer}
                      </p>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: "0 1.25rem 1.25rem" }}>
                      {/* Price chip */}
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.3rem 0.85rem",
                          borderRadius: "999px",
                          background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                          color: "#065f46",
                          fontSize: "1rem",
                          fontWeight: 800,
                          marginBottom: "0.875rem",
                          letterSpacing: "0.01em",
                        }}
                      >
                        ₱{product.price.toFixed(2)}
                      </div>

                      {/* CTA button */}
                      <button
                        disabled={needsRx}
                        onClick={(e) => {
                          e.stopPropagation();
                          /* add-to-cart logic here */
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          padding: "0.65rem 1rem",
                          borderRadius: "12px",
                          border: "none",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          cursor: needsRx ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                          background: needsRx
                            ? "#f1f5f9"
                            : "linear-gradient(135deg, #059669, #10b981)",
                          color: needsRx ? "#94a3b8" : "#ffffff",
                          boxShadow: needsRx
                            ? "none"
                            : "0 4px 14px rgba(16,185,129,0.4)",
                          letterSpacing: "0.01em",
                        }}
                      >
                        <ShoppingCart size={15} />
                        {needsRx ? "Requires Prescription" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Empty state */}
        {!loading && categoryProducts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 1rem",
              color: "#94a3b8",
            }}
          >
            <Sparkles size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>
              No products available in this category.
            </p>
          </div>
        )}
      </div>

      {/* ── Keyframe styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <ProductDetails
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        language={language}
      />
    </>
  );
};