// src/api.js
const BACKEND_URL = "https://foodcal-backend.onrender.com";

export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from backend");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API Error:", error);
    return { error: error.message };
  }
};
