import React, { useState } from 'react';

function MealUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an image");
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="container">
      <h1>Nutri.ai</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleSubmit}>Analyze Meal</button>
      {result && (
        <div style={{marginTop: '20px'}}>
          <h3>Results:</h3>
          <p>Calories: {result.calories} kcal</p>
          <p>Protein: {result.protein} g</p>
          <p>Carbs: {result.carbs} g</p>
          <p>Fat: {result.fat} g</p>
          <p>Fiber: {result.fiber} g</p>
          <p>Vitamins: {JSON.stringify(result.vitamins)}</p>
        </div>
      )}
    </div>
  );
}

export default MealUploader;
