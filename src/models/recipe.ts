import gameData from '../products.json';

interface Item {
  id: string,
  name: string
}

export type RawMaterial = Item
export interface GameData { rawMaterials: RawMaterial[], recipes: Recipe[] }

export interface RecipeInput extends Item {
  quantity: number,
  type: 'Recipe' | 'RawMaterial' | undefined,
}

export interface Recipe extends Item {
  output: number,
  time: number,
  inputs: RecipeInput[],
}

function initializeRecipes() {

  const recipes = gameData.recipes as Recipe[];
  const rawMaterials = gameData.rawMaterials as RawMaterial[];

  for (const recipe of recipes) {
    for (const input of recipe.inputs) {
      const inputRecipe = recipes.find(r => r.id === input.id);
      if (inputRecipe) {
        input.name = inputRecipe.name;
        input.type = 'Recipe';
      }
      else {
        const inputRaw = rawMaterials.find(rm => rm.id === input.id);
        if (inputRaw) {
          input.name = inputRaw.name;
          input.type = 'RawMaterial';
        }
        else {
          input.name = input.id;
          input.type = undefined;
        }
      }
    }
  }

  return { rawMaterials, recipes };
}

export const { rawMaterials, recipes } = initializeRecipes();