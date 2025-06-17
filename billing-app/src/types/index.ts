export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface BillItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
} 
