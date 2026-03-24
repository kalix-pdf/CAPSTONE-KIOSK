 {/* Search Results */}
        {/* {searchTerm && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-300">
            <div className="flex items-center gap-4 mb-6">
              <h2 className={`${getTextSizeClass("text-2xl")} font-bold text-blue-900`}>{t.searchResults}</h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  speak(t.clearSearch);
                }}
                className={`${getTextSizeClass("text-base")} px-6 py-3 border-2 hover:scale-105 transition-all font-bold`}
              >
                {t.clearSearch}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-200 hover:border-blue-500"
                  onClick={() => {
                    setSelectedProduct(product);
                    generateAIInfo(product);
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-gray-900 font-bold text-lg mb-2">{product.name}</CardTitle>
                        <CardDescription className="text-sm">{product.dosage}</CardDescription>
                      </div>
                      <Info className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.prescriptionRequired ? (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 text-xs px-3 py-1">
                          <Shield className="h-3 w-3 mr-1" />
                          Prescription Required
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs px-3 py-1">
                          Over-the-Counter
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-3 py-1 font-semibold ${
                          product.type === "branded" 
                            ? "bg-purple-50 text-purple-700 border-purple-300" 
                            : "bg-amber-50 text-amber-700 border-amber-300"
                        }`}
                      >
                        {product.type === "branded" ? t.branded : t.generic}
                      </Badge>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">
                        ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Badge variant={product.stock > 20 ? "default" : "destructive"} className="text-xs px-3 py-1">
                      Stock: {product.stock}
                    </Badge>
                    <p className="text-gray-600 line-clamp-2 text-sm">{product.description}</p>
                    <div className="text-gray-600 text-sm">
                      <strong>Manufacturer:</strong> {product.manufacturer}
                    </div>
                    <Button
                      className="w-full text-base py-3 rounded-lg hover:scale-105 transition-all font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.stock === 0 || product.prescriptionRequired}
                      variant={product.prescriptionRequired ? "secondary" : "default"}
                    >
                      {product.prescriptionRequired ? (
                        <>
                          <Shield className="h-5 w-5 mr-2" />
                          Prescription Required
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {filteredProducts.length === 0 && (
                <Card className="border-2 border-gray-200 col-span-full">
                  <CardContent className="p-12 text-center">
                    <Pill className="h-20 w-20 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl font-semibold text-gray-600">No medications found for "{searchTerm}"</p>
                    <p className="text-base text-gray-500 mt-2">Try a different search term</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )} */}
