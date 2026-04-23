import { API_URL } from "./url.api";
import { Category, Product, TotalInventoryProps, ActivityLogProps,
   QueueTicket, AIOverview, PaginatedProducts,
   customerOrderProps, ActivityLogsResponse} from "./Props";

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

export const fetchActiveCategoriesByProduct = async(): Promise<Category[]> => {
  return fetchData<Category[]>(`${API_URL}/api/activeCategories`);
}

export const fetchProductsByCategory = async (categoryid: number): Promise<Product[]> => {
  return fetchData<Product[]>(`${API_URL}/api/category/${categoryid}/products`);
}


//fetch paginated products for admin dashboard
export const fetchAllProducts = async(page: number, limit: number): Promise<PaginatedProducts> => {
  return fetchData<PaginatedProducts>(`${API_URL}/api/products?page=${page}&limit=${limit}`);
}

export const fetchTotalInventory = async(): Promise<TotalInventoryProps[]> => {
  return fetchData<TotalInventoryProps[]>(`${API_URL}/api/admin/fetchTotalDashboard`);
}

//logs with pagination
export const fetchActivityLogs = async(page: number, limit: number, filter: string): Promise<ActivityLogsResponse> => {
  return fetchData<ActivityLogsResponse>(`${API_URL}/api/admin/ActivityLogs?page=${page}&limit=${limit}&filter=${filter}`);
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

//fetch orders
export const fetchCompletedOrders = async(): Promise<customerOrderProps[]> => {
  return fetchData<customerOrderProps[]>(`${API_URL}/api/admin/fetch/orders`);
}