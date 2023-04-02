import { Stack, Typography } from '@mui/material';
import { FactoryRequirement } from '../../models/factory';
import { Recipe } from '../../models/recipe';
import { RecipeDetail } from '../recipe/recipeDetail';

type FactoryDetailProps = {
  assemblerCount: number,
  recipe: Recipe,
  factory: FactoryRequirement,
}

const FactoryDetails = (props: FactoryDetailProps) => {

  const { assemblerCount, recipe, factory } = props;

  const rawMaterialElements = factory.rawMaterials
    .sort((a, b) => a.quantity === b.quantity ? 0 : (a.quantity > b.quantity ? -1 : 1))
    .map(r => {
      return <Typography key={r.materialId}>{r.quantity * 60} {r.materialName}</Typography>;
    });

  const assemblerElements = factory.assemblers
    .sort((a, b) => a.assemblers === b.assemblers ? 0 : (a.assemblers > b.assemblers ? -1 : 1))
    .map(a => {
      return <Typography key={a.recipeId}>{a.assemblers} {a.recipeName}</Typography>;
    });

  return (
    <Stack>
      <RecipeDetail recipe={recipe} />
      <Typography variant="h3">{`To produce ${assemblerCount}x ${recipe.name} (${assemblerCount * 60 * recipe.output / recipe.time} per 60s)`}</Typography>
      <Typography variant="h4">Raw Materials (per 60s)</Typography>
      {rawMaterialElements}
      <Typography variant="h4">Assemblers</Typography>
      {assemblerElements}
    </Stack>
  );

};

export { FactoryDetails };