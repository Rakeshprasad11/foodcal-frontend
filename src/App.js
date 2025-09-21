import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select an image!");
    
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://foodcal-backend.onrender.com/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setResult("Error analyzing image.");
    }
  };

  return (
    <div className="App">
      <h1>FoodCal AI 🍽️</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Analyze</button>
      {result && (
        <pre style={{ textAlign: "left", marginTop: "20px" }}>{result}</pre>
      )}
    </div>
  );
}

export default App;
