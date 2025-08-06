import RecipeCard from "./RecipeCard";

const FeaturedRecipes = () => {
  return (
    <div className="container mx-auto px-4 text-left mt-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Trending Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <RecipeCard title="Spicy Chicken Curry" likes={25} />
        <RecipeCard title="Creamy Pasta" likes={18} />
        <RecipeCard title="Veggie Stir-fry" likes={32} />
      </div>
    </div>
  );
};

export default FeaturedRecipes;