'use client';

import { useState, useEffect } from 'react';
import { Product } from '../types';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('billing-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('billing-products', JSON.stringify(products));
    }
  }, [products]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price.trim()) return;

    const price = parseFloat(newProduct.price);
    if (isNaN(price) || price <= 0) return;

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name.trim(),
      price: price
    };

    setProducts(prevProducts => [...prevProducts, product]);
    setNewProduct({ name: '', price: '' });
    setShowAddForm(false); // Hide form after adding
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;

    const price = parseFloat(editingProduct.price.toString());
    if (isNaN(price) || price <= 0) return;

    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: editingProduct.name.trim(), price: price }
          : p
      )
    );
    
    setEditingProduct(null);
    setIsEditing(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
  };

  const startEditing = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setIsEditing(false);
  };

  const clearAll = () => {
    localStorage.removeItem('billing-products');
    setProducts([]);
  };

  return (
    <div className="space-y-6">
      {/* Add Product Button */}
      {!showAddForm && !isEditing && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Product
        </button>
      )}

      {/* Add/Edit Product Form */}
      {(showAddForm || isEditing) && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          
          <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct} className="space-y-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={isEditing ? editingProduct?.name || '' : newProduct.name}
                onChange={(e) => isEditing 
                  ? setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)
                  : setNewProduct(prev => ({ ...prev, name: e.target.value }))
                }
                className="input-field"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                id="productPrice"
                step="0.01"
                min="0"
                value={isEditing ? editingProduct?.price || '' : newProduct.price}
                onChange={(e) => isEditing 
                  ? setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)
                  : setNewProduct(prev => ({ ...prev, price: e.target.value }))
                }
                className="input-field"
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (isEditing) {
                    cancelEditing();
                  } else {
                    setShowAddForm(false);
                    setNewProduct({ name: '', price: '' });
                  }
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            📦 Products ({products.length})
          </h2>
          {products.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products added yet.</p>
            <p className="text-sm mt-1">Click "Add New Product" to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">₹{product.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      startEditing(product);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
