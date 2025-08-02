"use client"; 

import { useState } from 'react';
const Items = ({ onGenerate }) => {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    setItems(items.filter((item) => item !== itemToRemove));
  };

  return (
    <div className="p-4  rounded-md">
      <h2 className="text-xl font-bold mb-4">Your Pantry Items</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-md"
          placeholder="Enter an ingredient..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddItem();
            }
          }}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
          onClick={handleAddItem}
        >
          Add
        </button>
      </div>

      <ul className="list-disc pl-5 mb-4">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between items-center p-2 rounded-md mb-2 shadow-sm">
            <span>{item}</span>
            <button
              className="ml-4 text-red-500 hover:text-red-700"
              onClick={() => handleRemoveItem(item)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button
        className="w-full bg-green-500 text-white p-3 rounded-md font-bold hover:bg-green-600 disabled:opacity-50"
        onClick={() => onGenerate(items)}
        disabled={items.length === 0}
      >
        Generate Recipe
      </button>
    </div>
  );
};

export default Items;