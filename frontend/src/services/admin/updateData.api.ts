import { API_URL } from "../url.api";
import { Product } from "../Props";

export const updateData = async (endpoint: string, body: any) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), 
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return response.json();
};

export const DeactivateProduct = async (productId: number) => {
  return updateData(`${API_URL}/api/admin/deactivate/product`, { product_id: productId });
};

export const updateProduct = async (product: Partial<Product> & { id: number }) => {
  return updateData(`${API_URL}/api/admin/update/product`, product);
};

export const updateOrder = async(type: number, orderId: number) => {
  return updateData(`${API_URL}/api/admin/update/order`, { status_type: type, order_id: orderId });
}

export const SSE = () => {
  const es = new EventSource(`${API_URL}/api/queue/stream`);
  return es;
}