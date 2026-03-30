import { API_URL } from "../url.api";
import { Category, Product, ActivityLogProps, AIOverview } from "../Props";

export const addData = async (endpoint: string, body: any, signal?: AbortSignal) => {
  const isFormData = body instanceof FormData;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? body : JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const error = new Error(`Failed to fetch: ${response.status}`) as any;
    error.status = response.status; 
    throw error;
  }

  return response.json();
};


// Generative AI
export const generateProductDetailsAI = async(product_name: string, language: "en" | "fil", signal?: AbortSignal): Promise<AIOverview> => {
  return addData(`${API_URL}/api/generate/product/details`, { product_name, language }, signal);
}


export const addProduct = async(product: FormData) => {
    return addData(`${API_URL}/api/admin/add/product`, product);
}

export const addNewCategory = async (categoryData: Partial<Category>) => {
    return addData(`${API_URL}/api/admin/add/category`, categoryData);
}

export const addActivityLog = async(user_id: ActivityLogProps['user'], type: ActivityLogProps['type'], action: ActivityLogProps['action'], 
            description: ActivityLogProps['description'], metadata: ActivityLogProps['metadata']) => {
    const response = await fetch(`${API_URL}/api/admin/add/ActivityLogs`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, type, action, description, metadata }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error("Failed to add Activity Logs");
    }

    return result;
}