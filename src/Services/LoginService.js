import axios from "axios";

export async function loginUser(username, password, endpoint) {
  try {
    const response = await axios.post(
      endpoint,
      {
        username, // Use "username" instead of "email"
        password,
        role: "admin", // Include the "role" field as per the reference
      },
      {
        headers: {
          "Content-Type": "application/json",
          apiKey: import.meta.env.VITE_SUPABASE_KEY, // Use the API key from environment variables
        },
      }
    );

    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
}
