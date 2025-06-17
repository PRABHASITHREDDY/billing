'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, BillItem } from '../types';
import Select from 'react-select';

// Custom styles for react-select
const customStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '42px',
    background: 'white',
    borderColor: '#e5e7eb',
    '&:hover': {
      borderColor: '#e5e7eb',
    },
    boxShadow: 'none',
    '&:focus-within': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
  }),
  option: (base: any, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#f3f4f6'
      : 'white',
    color: state.isSelected ? 'white' : '#111827',
    cursor: 'pointer',
    padding: '10px 12px',
    borderBottom: '1px solid #e5e7eb',
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:active': {
      backgroundColor: state.isSelected ? '#3b82f6' : '#e5e7eb',
    },
  }),
  menu: (base: any) => ({
    ...base,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderRadius: '0.5rem',
    marginTop: '4px',
    overflow: 'hidden',
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: '168px',
    padding: '0',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#c1c1c1 #f1f1f1',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '3px',
      '&:hover': {
        background: '#a8a8a8',
      },
    },
  }),
};

export default function BillGenerator() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load products and bill items from localStorage
  useEffect(() => {
    const loadProducts = () => {
      const savedProducts = localStorage.getItem('billing-products');
      const savedBillItems = localStorage.getItem('billing-items');
      
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
      if (savedBillItems) {
        setBillItems(JSON.parse(savedBillItems));
      }
    };

    loadProducts();

    // Listen for storage changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'billing-products') {
        loadProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save bill items to localStorage whenever they change
  useEffect(() => {
    if (billItems.length > 0 || localStorage.getItem('billing-items')) {
      localStorage.setItem('billing-items', JSON.stringify(billItems));
    }
  }, [billItems]);

  const handleAddItem = () => {
    if (!selectedProduct || !quantity) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: BillItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      quantity: parseFloat(quantity),
      price: product.price,
      total: product.price * parseFloat(quantity)
    };

    setBillItems(prevItems => [...prevItems, newItem]);
    setSelectedProduct('');
    setQuantity('');
  };

  const handleRemoveItem = (id: string) => {
    setBillItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (value: string) => {
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleUpdateItem = (id: string, newQuantity: string, newPrice: string) => {
    setBillItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const updatedQuantity = parseFloat(newQuantity) || item.quantity;
        const updatedPrice = parseFloat(newPrice) || item.price;
        return {
          ...item,
          quantity: updatedQuantity,
          price: updatedPrice,
          total: updatedQuantity * updatedPrice
        };
      }
      return item;
    }));
    setEditingItem(null);
  };

  const total = billItems.reduce((sum, item) => sum + item.total, 0);

  const shareOnWhatsApp = () => {
    if (billItems.length === 0) return;

    const message = `*Bill Details*\n\n${billItems
      .map(item => `${item.productName}\n${item.quantity} x ₹${item.price.toFixed(2)} = ₹${item.total.toFixed(2)}`)
      .join('\n\n')}\n\n*Total: ₹${total.toFixed(2)}*`;

    const phoneNumber = '918919971913'; // Adding country code (91) and removing any special characters
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  // Format products for react-select
  const productOptions = products.map(product => ({
    value: product.id,
    label: `${product.name} - ₹${product.price.toFixed(2)}`,
    price: product.price
  }));

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Generate Bill</h1>
        
        {/* Product Selection Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 sm:mb-6">
          <div className="p-4 sm:p-5 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">Add Items</h2>
          </div>
          
          <div className="p-4 sm:p-5 space-y-4">
            {/* Product Dropdown */}
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <Select
                id="product"
                instanceId="product-select"
                options={productOptions}
                value={productOptions.find(option => option.value === selectedProduct)}
                onChange={(option) => setSelectedProduct(option?.value || '')}
                styles={customStyles}
                isClearable
                isSearchable
                placeholder="Choose a product..."
                noOptionsMessage={() => "No products found"}
              />
            </div>

            {/* Quantity Input */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="relative">
                <input
                  id="quantity"
                  type="text"
                  inputMode="decimal"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  placeholder="Enter quantity"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button 
                    className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md border border-gray-200 transition-colors duration-200"
                    onClick={() => handleQuantityChange((parseFloat(quantity || '0') - 1).toString())}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 sm:h-4 w-3.5 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md border border-gray-200 transition-colors duration-200"
                    onClick={() => handleQuantityChange((parseFloat(quantity || '0') + 1).toString())}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 sm:h-4 w-3.5 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Add Button */}
            <button 
              className="w-full px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddItem}
              disabled={!selectedProduct || !quantity}
            >
              Add to Bill
            </button>
          </div>
        </div>

        {/* Bill Items List */}
        {billItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 sm:mb-6">
            <div className="p-4 sm:p-5 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Bill Items</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {billItems.map(item => (
                <div key={item.id} className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900">{item.productName}</h3>
                      {editingItem === item.id ? (
                        <div className="mt-3 space-y-3">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                              <input
                                type="text"
                                className="w-full sm:w-24 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                defaultValue={item.quantity}
                                id={`quantity-${item.id}`}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Price (₹)</label>
                              <input
                                type="text"
                                className="w-full sm:w-24 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                defaultValue={item.price}
                                id={`price-${item.id}`}
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <button
                                onClick={() => handleUpdateItem(
                                  item.id,
                                  (document.getElementById(`quantity-${item.id}`) as HTMLInputElement)?.value || item.quantity.toString(),
                                  (document.getElementById(`price-${item.id}`) as HTMLInputElement)?.value || item.price.toString()
                                )}
                                className="flex-1 sm:flex-none px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="flex-1 sm:flex-none px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.quantity} x ₹{item.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                      <span className="text-base font-medium text-gray-900">₹{item.total.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Share Section */}
            <div className="p-4 sm:p-5 bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-medium text-gray-700">Total Amount</span>
                <span className="text-base sm:text-lg font-semibold text-gray-900">₹{total.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={shareOnWhatsApp}
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#20BD5C] text-white rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
