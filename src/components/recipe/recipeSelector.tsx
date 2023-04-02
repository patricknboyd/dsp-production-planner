import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Recipe } from '../../models/recipe';

type RecipeSelectorProps = {
    recipes: Recipe[],
    selectedRecipe: Recipe,
    onSelection(selected: Recipe): void;
}

const RecipeSelector = (props: RecipeSelectorProps) => {

  const { recipes, selectedRecipe } = props;

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const recipe = recipes.find(r => r && r.id === value);

    if(!recipe) {
      throw new Error('Couldn\'t get recipe.');
    }

    props.onSelection(recipe);
  };

  const recipeItems = recipes
    .sort((a, b) => a.name === b.name ? 0 : (a.name < b.name ? -1 : 1))
    .map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>);

  return (
    <>
      <InputLabel id="recipe-selector-label">Select a Recipe</InputLabel>
      <Select
        labelId="recipe-selector-label"
        id="recipe-selector"
        value={selectedRecipe.id}
        onChange={handleChange}>
        {recipeItems}
      </Select>
    </>
  );

};

export { RecipeSelector };