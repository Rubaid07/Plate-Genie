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
    <div className="p-4 bg-card rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4 text-foreground">Your Pantry Items</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow p-2 border border-border rounded-l-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
          className="bg-primary p-2 rounded-r-md hover:bg-primary-dark transition-colors"
          onClick={handleAddItem}
        >
          Add
        </button>
      </div>

      <ul className="list-none pl-0 mb-4 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between items-center p-2 rounded-md bg-background text-foreground shadow-sm">
            <span>{item}</span>
            <button
              className="ml-4 text-red-500 hover:text-red-700 transition-colors"
              onClick={() => handleRemoveItem(item)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button
        className="w-full bg-primary p-3 rounded-md font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
        onClick={() => onGenerate(items)}
        disabled={items.length === 0}
      >
        Generate Recipe
      </button>
    </div>
  );
};

export default Items;