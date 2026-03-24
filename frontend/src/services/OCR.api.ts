import { API_URL } from "./url.api";
import { AIResponse } from "./Props";

export const uploadAndProcessImage = async (imageBlob: Blob, ocrType: string): Promise<{orderId: number}> => {
    try {
        const formData = new FormData();
        formData.append('prescription', imageBlob, `prescription_${Date.now()}.jpg`);
        formData.append('ocr_type', ocrType);

        const response = await fetch(`${API_URL}/api/ocr/process`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Failed to process image: ${response.status}`;
            throw new Error(errorMessage);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
}

export const AIPoweredOCR = async (imageBlob: Blob): Promise<AIResponse> => {
    try {
        const formData = new FormData();
        formData.append('prescription', imageBlob, `prescription_${Date.now()}.jpg`);

        const response = await fetch(`${API_URL}/api/ocr/readPrescription`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Failed to process image: ${response.status}`;
            const error = new Error(errorMessage);
            (error as any).status = response.status;
            throw error;
        }
        const data: AIResponse = await response.json();
        
        return data;

    } catch (error) {
        throw error;
    }
}

export const AIPoweredOCRMedicine = async (imageBlob: Blob): Promise<AIResponse> => {
    try {
        const formData = new FormData();
        formData.append('medicine', imageBlob, `prescription_${Date.now()}.jpg`);

        const response = await fetch(`${API_URL}/api/ocr/product/scan`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Failed to process image: ${response.status}`;
            const error = new Error(errorMessage);
            (error as any).status = response.status;
            throw error;
        }
        const data: AIResponse = await response.json();
        
        return data;

    } catch (error) {
        throw error;
    }
}