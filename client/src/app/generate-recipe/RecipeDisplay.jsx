const RecipeDisplay = ({ recipes }) => {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center text-lg text-foreground">
        No recipes to display. Try different ingredients.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recipes.map((recipe, index) => (
        <div key={index} className="bg-card p-6 rounded-lg shadow-md border border-border">
          <h3 className="text-2xl font-bold text-primary mb-2">{recipe.name}</h3>
          
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-foreground">Ingredients:</h4>
            <ul className="list-disc list-inside mt-1 space-y-1 text-foreground">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-foreground">Instructions:</h4>
            <p className="mt-1 text-foreground leading-relaxed">{recipe.instructions}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeDisplay;