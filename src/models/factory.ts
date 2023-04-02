import { Recipe } from './recipe';

interface RawMaterialRequirement {
    materialId: string,
    materialName: string,
    quantity: number,
}

interface AssemblerRequirement {
    recipeId: string,
    recipeName: string,
    recipeOutput: number,
    recipeTime: number,
    quantity: number,
    assemblers: number,
}

export interface FactoryRequirement {
    assemblers: AssemblerRequirement[],
    rawMaterials: RawMaterialRequirement[],
}

function mergeFactoryRequirements(a: FactoryRequirement, b: FactoryRequirement): FactoryRequirement {
  for (const raw of b.rawMaterials) {
    const index = a.rawMaterials.findIndex(r => r.materialId === raw.materialId);
    if (index >= 0) {
      a.rawMaterials[index].quantity += raw.quantity;
    }
    else {
      a.rawMaterials.push(raw);
    }
  }

  for (const recipe of b.assemblers) {
    const index = a.assemblers.findIndex(assem => assem.recipeId === recipe.recipeId);

    if (index >= 0) {
      const quantity = a.assemblers[index].quantity + recipe.quantity;
      const { recipeTime, recipeOutput } = a.assemblers[index];
      a.assemblers[index].quantity = quantity;
      a.assemblers[index].assemblers = Math.ceil(quantity / recipeTime / recipeOutput);
    }
    else {
      a.assemblers.push(recipe);
    }
  }

  return a;
}

export function calculateFactoryRequirements(allRecipes: Recipe[], recipe: Recipe, requiredAmount: number): FactoryRequirement {
  const rawInputs = recipe.inputs
    .filter(i => i.type === 'RawMaterial')
    .map(i => {
      return {
        materialId: i.id,
        materialName: i.name,
        quantity: Math.ceil((requiredAmount / recipe.output / recipe.time) * i.quantity)
      } as RawMaterialRequirement;
    });

  const assemblers = Math.ceil(requiredAmount / recipe.output / recipe.time);

  const thisAssembler: AssemblerRequirement = {
    recipeId: recipe.id,
    recipeName: recipe.name,
    recipeOutput: recipe.output,
    recipeTime: recipe.time,
    assemblers,
    quantity: requiredAmount
  };

  let factory: FactoryRequirement = { rawMaterials: rawInputs, assemblers: [thisAssembler] };

  const recipeInputs = recipe.inputs
    .filter(i => i.type === 'Recipe')
    .map(i => {

      const inputRecipe = allRecipes.find(r => r.id === i.id);

      if (!inputRecipe) {
        throw new Error(`Recipe not found ${i.id}`);
      }

      return calculateFactoryRequirements(allRecipes, inputRecipe, i.quantity * assemblers);
    });

  for (const f of recipeInputs) {
    factory = mergeFactoryRequirements(factory, f);
  }

  return factory;
}