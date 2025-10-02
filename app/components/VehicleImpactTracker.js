'use client';

import React, { useState, useRef } from 'react';
import { Camera, Download, Trash2, RotateCcw } from 'lucide-react';

export default function VehicleImpactTracker() {
  const [image, setImage] = useState(null);
  const [impacts, setImpacts] = useState([]);
  const [selectedColor, setSelectedColor] = useState('red');
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setImpacts([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e) => {
    if (!image || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setImpacts([...impacts, { x, y, color: selectedColor, id: Date.now() }]);
  };

  const handleTouchClick = (e) => {
    if (!image || !imageRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    setImpacts([...impacts, { x, y, color: selectedColor, id: Date.now() }]);
  };

  const removeImpact = (id, e) => {
    e.stopPropagation();
    setImpacts(impacts.filter(impact => impact.id !== id));
  };

  const clearAll = () => {
    setImpacts([]);
  };

  const resetApp = () => {
    setImage(null);
    setImpacts([]);
  };

  const downloadImage = () => {
    if (!image) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      impacts.forEach(impact => {
        const x = (impact.x / 100) * canvas.width;
        const y = (impact.y / 100) * canvas.height;
        const radius = Math.max(12, canvas.width * 0.008);

        ctx.fillStyle = impact.color === 'red' ? '#ef4444' : '#22c55e';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      const link = document.createElement('a');
      link.download = `impact-vehicule-${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = image;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📋 Relevé d'Impacts Carrosserie
          </h1>

          {!image ? (
            <div className="text-center py-12">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
                id="fileInput"
              />
              <button
                onClick={triggerFileInput}
                type="button"
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-5 px-10 rounded-xl inline-flex items-center gap-3 text-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Camera size={32} />
                Prendre une photo
              </button>
              <p className="text-gray-600 mt-6 text-lg">
                Prenez une photo du véhicule pour commencer
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedColor('red')}
                  className={`py-4 px-8 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${
                    selectedColor === 'red'
                      ? 'bg-red-500 text-white ring-4 ring-red-200 shadow-lg scale-105'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <span className="w-7 h-7 rounded-full bg-red-500 border-3 border-white shadow-md"></span>
                  Gommette Rouge
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedColor('green')}
                  className={`py-4 px-8 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${
                    selectedColor === 'green'
                      ? 'bg-green-500 text-white ring-4 ring-green-200 shadow-lg scale-105'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <span className="w-7 h-7 rounded-full bg-green-500 border-3 border-white shadow-md"></span>
                  Gommette Verte
                </button>
              </div>

              <div className="relative inline-block w-full mb-6">
                <img
                  ref={imageRef}
                  src={image}
                  alt="Véhicule"
                  onClick={handleImageClick}
                  onTouchStart={handleTouchClick}
                  className="w-full h-auto rounded-xl cursor-crosshair shadow-xl select-none"
                  draggable="false"
                />
                {impacts.map((impact) => (
                  <button
                    key={impact.id}
                    type="button"
                    onClick={(e) => removeImpact(impact.id, e)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      removeImpact(impact.id, e);
                    }}
                    style={{
                      left: `${impact.x}%`,
                      top: `${impact.y}%`,
                      backgroundColor: impact.color === 'red' ? '#ef4444' : '#22c55e',
                      width: '20px',
                      height: '20px'
                    }}
                    className="absolute rounded-full border-3 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 active:scale-125 transition-transform"
                  />
                ))}
              </div>

              <div className="text-center mb-6 bg-gray-50 rounded-xl p-4">
                <p className="text-xl font-bold text-gray-700">
                  Total: <span className="text-red-600">{impacts.filter(i => i.color === 'red').length} rouge(s)</span>
                  {' · '}
                  <span className="text-green-600">{impacts.filter(i => i.color === 'green').length} verte(s)</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Touchez la photo pour ajouter · Touchez une gommette pour la retirer
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={impacts.length === 0}
                  className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <Trash2 size={22} />
                  Effacer gommettes
                </button>
                <button
                  type="button"
                  onClick={downloadImage}
                  disabled={impacts.length === 0}
                  className="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <Download size={22} />
                  Télécharger
                </button>
                <button
                  type="button"
                  onClick={resetApp}
                  className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <RotateCcw size={22} />
                  Nouvelle photo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
            }
