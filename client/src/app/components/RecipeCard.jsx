const RecipeCard = ({ title, likes }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{likes} Likes</p>
    </div>
  );
};

export default RecipeCard;