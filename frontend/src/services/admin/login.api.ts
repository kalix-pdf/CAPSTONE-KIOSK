import { API_URL } from "../url.api";

export const loginService = async(username: string, password: string) => {
    const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify({
            username: username,
            password: password         
       }),
    });

    const result = await response.json();

    if (!response.ok) {
        if (response.status >= 500) {
            throw new Error("Something went wrong. Please try again later.");
        }
    }

    return result;
}