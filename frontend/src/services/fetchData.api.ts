import { API_URL } from "./url.api";
import { Category, Product, TotalInventoryProps, ActivityLogProps,
   QueueTicket, AIOverview } from "./Props";

export const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const fetchCategories = async (): Promise<Category[]> => {
  return fetchData<Category[]>(`${API_URL}/api/categories`);
};

export const fetchProductsByCategory = async (categoryid: number): Promise<Product[]> => {
  return fetchData<Product[]>(`${API_URL}/api/category/${categoryid}/products`);
}

export const fetchAllProducts = async(): Promise<Product[]> => {
  return fetchData<Product[]>(`${API_URL}/api/products`);
}

export const fetchTotalInventory = async(): Promise<TotalInventoryProps[]> => {
  return fetchData<TotalInventoryProps[]>(`${API_URL}/api/admin/fetchTotalDashboard`);
}

export const fetchActivityLogs = async(): Promise<ActivityLogProps[]> => {
  return fetchData<ActivityLogProps[]>(`${API_URL}/api/admin/ActivityLogs`);
}

export const fetchOrders = async(statuses: number []): Promise<QueueTicket[]> => {
  const params = statuses.map(s => `status=${s}`).join('&')
  return fetchData<QueueTicket[]>(`${API_URL}/api/admin/orders?${params}`);
}

//public queue display
export const fetchAllOrders = async(): Promise<QueueTicket[]> => {
  return fetchData<QueueTicket[]>(`${API_URL}/api/admin/AllOrders`);
}

export const fetchTotalCompletedToday = async(): Promise<{ total: number }[]> => {
  return fetchData<{ total: number }[]>(`${API_URL}/api/admin/completedToday`);
}
