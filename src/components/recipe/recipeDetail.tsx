import { Box, Stack, Typography } from '@mui/material';
import { Recipe } from '../../models/recipe';

type RecipeDetailProps = {
    recipe: Recipe,
}

export const RecipeDetail = (props: RecipeDetailProps) => {
  const { recipe } = props;

  const inputs = recipe.inputs
    .map(i => `${i.quantity}x ${i.name}`)
    .join(' + ');

  return (
    <Box>
      <Typography variant="h3">{recipe.name}</Typography>
      <Stack direction='row'>
        <Typography>{inputs}</Typography>
        <Typography> -({recipe.time}s)-&gt;</Typography>
        <Typography>{recipe.output}x {recipe.name}</Typography>
      </Stack>
    </Box>
  );
};