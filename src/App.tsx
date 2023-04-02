import { Box, InputLabel, Slider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FactoryDetails } from './components/factory/factoryDetails';
import { RecipeSelector } from './components/recipe/recipeSelector';
import { calculateFactoryRequirements, FactoryRequirement } from './models/factory';
import { loadAllRecipes, Recipe, RawMaterial } from './models/recipe';

function App() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const [assemblerCount, setAssemblerCount] = useState(1);

  useEffect(() => {

    const loadGameData = async () => {
      const [raw, rec] = await loadAllRecipes();

      setRecipes(rec);
      setRawMaterials(raw);
      setSelectedRecipe(rec[0]);
    };

    loadGameData();
  }, []);

  if (rawMaterials.length > 0) {
    console.debug(`Found raw materials: ${rawMaterials.join(',')}`);
  }

  let error: string | undefined = undefined;

  if (selectedRecipe) {
    const invalidInputs = selectedRecipe.inputs.filter(input => !input.type);

    if (invalidInputs.length > 0) {
      error = `Unable to find the following inputs: ${invalidInputs.map(input => input.name).join(', ')}`;
    }
  }

  const factory: FactoryRequirement | undefined = selectedRecipe ? calculateFactoryRequirements(recipes, selectedRecipe, assemblerCount * selectedRecipe.output * selectedRecipe.time) : undefined;

  if (recipes && recipes.length > 0 && selectedRecipe) {
    return (
      <Box sx={{ m: 3 }}>
        <RecipeSelector recipes={recipes} selectedRecipe={selectedRecipe} onSelection={selected => setSelectedRecipe(selected)} />
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
