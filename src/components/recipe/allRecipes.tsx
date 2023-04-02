import { Stack, Typography, Box } from '@mui/material';
import { RawMaterial, Recipe } from '../../models/recipe';
import { RawMaterialDetail } from '../rawMaterial/rawMaterialDetail';
import { RecipeDetail } from './recipeDetail';

type AllRecipesProps = {
    recipes: Recipe[],
    rawMaterials: RawMaterial[],
}

const AllRecipes = (props: AllRecipesProps) => {

  const { recipes, rawMaterials } = props;

  const rawMaterialElements = rawMaterials
    .sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1)
    .map(rm => <RawMaterialDetail key={rm.id} material={rm} />);
  const recipeElements = recipes
    .sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1)
    .map(r => <RecipeDetail key={r.id} recipe={r} />);

  return (
    <Box>
      <Typography variant="h1">Raw Materials</Typography>
      <Stack spacing={{ mb: 2 }}>
        {rawMaterialElements}
      </Stack>
      <Typography variant="h1">Recipes</Typography>
      <Stack>
        {recipeElements}
      </Stack>
    </Box>
  );
};

export { AllRecipes };