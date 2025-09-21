import React, { useState } from 'react';

const MealUploader = ({ onMealUpload }) => {
  const [mealImage, setMealImage] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setMealImage(URL.createObjectURL(file));
    onMealUpload(file);
  };

  return (
    <div>
      <h2>Upload Your Meal</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {mealImage && <img src={mealImage} alt="Meal" width="200" />}
    </div>
  );
};

export default MealUploader;
