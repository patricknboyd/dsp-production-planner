interface Item {
  id: string,
  name: string
}

export type RawMaterial = Item

export interface RecipeInput extends Item {
  quantity: number,
  type: 'Recipe' | 'RawMaterial' | undefined,
}

export interface Recipe extends Item {
  output: number,
  time: number,
  inputs: RecipeInput[],
}

export async function loadAllRecipes(): Promise<[RawMaterial[], Recipe[]]> {
  const data = await fetch('products.json');
  if (data.ok) {
    const body = await data.json();

    const recipes = body.recipes as Recipe[];
    const rawMaterials = body.rawMaterials as RawMaterial[];

    for (const recipe of recipes) {
      for (const input of recipe.inputs) {
        const inputRecipe = recipes.find(r => r.id === input.id);
        if (inputRecipe) {
          input.name = inputRecipe.name;
          input.type = 'Recipe';
        }
        else {
          const inputRaw = rawMaterials.find(rm => rm.id === input.id);
          if(inputRaw) {
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

    return [rawMaterials, recipes];
  }
  else {
    throw new Error(`Error loading products.json: ${data.statusText}`);
  }
}