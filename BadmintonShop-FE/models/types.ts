export interface User {
  id: string;
  fullname: string;
  email: string;
  username: string;
  role: "customer" | "admin";
  phoneNumber?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  tags?: string[];
  priority: "High" | "Medium" | "Low";
  startDate?: Date;
  dueDate?: Date;
  note?: string;
  subtasks?: Subtask[];
}

export interface Product {
  _id: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  isFeatured?: boolean;
  stock?: number;
  category: string;
}

export interface CartItemType {
  _id: string; // The cart item ID or product ID
  product: Product;
  quantity: number;
}
