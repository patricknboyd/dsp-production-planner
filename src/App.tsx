import { Box, InputLabel, Slider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FactoryDetails } from './components/factory/factoryDetails';
import { RecipeSelector } from './components/recipe/recipeSelector';
import { calculateFactoryRequirements, FactoryRequirement } from './models/factory';
import { loadAllRecipes, Recipe } from './models/recipe';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectSavedRecipe, recipeChanged } from './slices/userSlice';
import { rawMaterialsLoaded, recipesLoaded, selectAllRecipes, selectRecipe } from './slices/recipeSlice';

function App() {

  const [assemblerCount, setAssemblerCount] = useState(1);

  const dispatch = useAppDispatch();

  useEffect(() => {

    const loadGameData = async () => {
      const [raw, rec] = await loadAllRecipes();

      dispatch(recipesLoaded(rec));
      dispatch(rawMaterialsLoaded(raw));
    };


    loadGameData();
  }, []);

  let error: string | undefined = undefined;

  const recipes = useAppSelector(selectAllRecipes);
  const selectedRecipeId = useAppSelector(selectSavedRecipe);
  const selectedRecipe = useAppSelector(selectRecipe(selectedRecipeId));

  let factory: FactoryRequirement | undefined;

  if (selectedRecipe) {
    const invalidInputs = selectedRecipe.inputs.filter(input => !input.type);

    if (invalidInputs.length > 0) {
      error = `Unable to find the following inputs: ${invalidInputs.map(input => input.name).join(', ')}`;
    }
    factory = selectedRecipe ? calculateFactoryRequirements(recipes, selectedRecipe, assemblerCount * selectedRecipe.output * selectedRecipe.time) : undefined;
  }

  const handleRecipeChange = (selected: Recipe) => {
    console.log('in change handler...');
    dispatch(recipeChanged(selected.id));
  };


  if (recipes && recipes.length > 0) {
    return (
      <Box sx={{ m: 3 }}>
        <RecipeSelector recipes={recipes} selectedRecipeId={selectedRecipeId} onSelection={handleRecipeChange} />
        <Box>
          <InputLabel htmlFor="assembler-count">Assemblers:</InputLabel>
          <Slider
            id="assembler-count"
            valueLabelDisplay='auto'
            getAriaValueText={(value: number) => value.toString()}
            sx={{ width: 300, ml: 2 }}
            value={assemblerCount}
            step={1}
            marks
            min={1}
            max={10}
            onChange={(_, value) => setAssemblerCount(Array.isArray(value) ? value[0] : value)} />
        </Box>
        {error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
        {!error && factory && selectedRecipe && <FactoryDetails assemblerCount={assemblerCount} factory={factory} recipe={selectedRecipe} />}
      </Box>
    );
  }
  else {
    return <Typography>Loading...</Typography>;
  }
}

export { App };
