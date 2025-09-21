// Example: api.js or inside component
export const analyzeFood = async (formData) => {
  try {
    const response = await fetch(
      "https://foodcal-ai-backend.onrender.com/analyze", // <-- live backend
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
};
