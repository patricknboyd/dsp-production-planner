import { Box, InputLabel, Slider, Typography } from '@mui/material';
import { useState } from 'react';
import { FactoryDetails } from './components/factory/factoryDetails';
import { RecipeSelector } from './components/recipe/recipeSelector';
import { calculateFactoryRequirements, FactoryRequirement } from './models/factory';
import { Recipe, recipes } from './models/recipe';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectSavedRecipe, recipeChanged } from './slices/userSlice';

function App() {

  const [assemblerCount, setAssemblerCount] = useState(1);

  const dispatch = useAppDispatch();

  let error: string | undefined = undefined;

  const selectedRecipeId = useAppSelector(selectSavedRecipe);
  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);

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

export { App };
