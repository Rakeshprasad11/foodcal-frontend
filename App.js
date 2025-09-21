import React, { useState, useRef } from "react";
import { Camera, Upload, Zap, Target, TrendingUp, Share2 } from "lucide-react";

const FOOD_DATABASE = {
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: 'fruit' },
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: 'fruit' },
  'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10, category: 'fast food' },
  'burger': { calories: 295, protein: 17, carbs: 24, fat: 17, category: 'fast food' },
  'salad': { calories: 20, protein: 1.8, carbs: 3.6, fat: 0.2, category: 'vegetable' },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: 'grain' },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'meat' },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, category: 'grain' },
  'sandwich': { calories: 250, protein: 12, carbs: 30, fat: 8, category: 'mixed' },
  'cake': { calories: 350, protein: 4, carbs: 55, fat: 12, category: 'dessert' },
  'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, category: 'fruit' },
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, category: 'grain' }
};

const App = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedPortion, setSelectedPortion] = useState("medium");
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const analyzeImage = async (imageData) => {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      const blob = await (await fetch(imageData)).blob();
      formData.append("image", blob, "food.jpg");

      const response = await fetch("https://foodcal-ai-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult({
        food: data.food,
        confidence: data.confidence,
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        analyzeImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCalories = () => {
    if (!result) return null;
    const foodData = FOOD_DATABASE[result.food];
    if (!foodData) return null;

    const portionMultipliers = { small: 0.7, medium: 1.0, large: 1.4 };
    const multiplier = portionMultipliers[selectedPortion];
    const baseServing = 100;

    return {
      calories: Math.round(foodData.calories * multiplier),
      protein: Math.round(foodData.protein * multiplier * 10) / 10,
      carbs: Math.round(foodData.carbs * multiplier * 10) / 10,
      fat: Math.round(foodData.fat * multiplier * 10) / 10,
      category: foodData.category,
      serving: Math.round(baseServing * multiplier)
    };
  };

  const saveToHistory = () => {
    const calories = calculateCalories();
    if (calories && result) {
      const entry = {
        id: Date.now(),
        food: result.food,
        portion: selectedPortion,
        calories: calories.calories,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory([entry, ...history.slice(0, 4)]);
    }
  };

  const calories = calculateCalories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-3 rounded-2xl mr-3">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">FoodCal AI</h1>
          </div>
          <p className="text-blue-200 text-lg">AI-Powered Calorie Estimation from Food Photos</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Camera className="mr-2" /> Food Image Analysis
            </h2>

            {!image ? (
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-white/30 rounded-2xl p-12 text-center hover:border-white/50 transition-colors cursor-pointer bg-white/5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-16 w-16 text-white/60 mx-auto mb-4" />
                  <p className="text-white/80 text-lg mb-2">Click to upload food image</p>
                  <p className="text-white/60 text-sm">Supports JPG, PNG, WebP</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-violet-600 transition-all flex items-center justify-center"
                  >
                    <Upload className="mr-2 h-5 w-5" /> Upload Photo
                  </button>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 bg-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/30 transition-all flex items-center justify-center"
                  >
                    <Camera className="mr-2 h-5 w-5" /> Take Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img src={image} alt="Food" className="w-full h-64 object-cover rounded-2xl" />
                  <button
                    onClick={() => {
                      setImage(null);
                      setResult(null);
                    }}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white/80">Analyzing your food...</p>
                  </div>
                )}

                {result && (
                  <div className="bg-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white capitalize">{result.food}</h3>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        {Math.round(result.confidence * 100)}% confident
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Portion Size</label>
                        <select
                          value={selectedPortion}
                          onChange={(e) => setSelectedPortion(e.target.value)}
                          className="w-full bg-white/20 text-white rounded-lg p-3 border border-white/30"
                        >
                          <option value="small">Small Portion</option>
                          <option value="medium">Medium Portion</option>
                          <option value="large">Large Portion</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="camera" onChange={handleImageUpload} className="hidden" />
          </div>

          <div className="space-y-6">
            {calories && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Target className="mr-2" /> Nutrition Facts
                </h2>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">{calories.calories}</div>
                    <div className="text-white/60">Calories</div>
                    <div className="text-white/40 text-sm">~{calories.serving}g serving</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-300">{calories.protein}g</div>
                      <div className="text-white/60 text-sm">Protein</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-300">{calories.carbs}g</div>
                      <div className="text-white/60 text-sm">Carbs</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-yellow-300">{calories.fat}g</div>
                      <div className="text-white/60 text-sm">Fat</div>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={saveToHistory}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
                    >
                      Save to History
                    </button>
                    <button className="bg-white/20 text-white px-4 py-3 rounded-xl hover:bg-white/30 transition-all">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="mr-2" /> Recent History
                </h2>

                <div className="space-y-3">
                  {history.map((entry) => (
                    <div key={entry.id} className="bg-white/10 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium capitalize">{entry.food}</div>
                        <div className="text-white/60 text-sm">{entry.portion} • {entry.timestamp}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{entry.calories}</div>
                        <div className="text-white/60 text-sm">cal</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex justify-between text-white">
                    <span>Today's Total</span>
                    <span className="font-bold">
                      {history.reduce((sum, entry) => sum + entry.calories, 0)} cal
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3">How it works</h3>
              <div className="space-y-2 text-white/80 text-sm">
                <div>1. Upload or take a photo of your food</div>
                <div>2. AI identifies the food type with confidence score</div>
                <div>3. Select portion size for accurate estimation</div>
                <div>4. Get detailed nutritional breakdown</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
