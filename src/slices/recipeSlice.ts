import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { RawMaterial, Recipe } from '../models/recipe';


export interface RecipeState {
  recipes: Recipe[],
  rawMaterials: RawMaterial[],
}

const initialState: RecipeState = {
  recipes: [],
  rawMaterials: [],
};



export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    recipesLoaded: (state, action: PayloadAction<Recipe[]>) => {
      const recipes = action.payload;
      return { ...state, recipes };
    },
    rawMaterialsLoaded: (state, action: PayloadAction<RawMaterial[]>) => {
      const rawMaterials = action.payload;
      return { ...state, rawMaterials };
    },
  },
});

export const { recipesLoaded, rawMaterialsLoaded } = recipeSlice.actions;

export const selectAllRecipes = (state: RootState) => state.recipe.recipes;
export const selectRecipe = (recipeId: string) => (state: RootState) => state.recipe.recipes.find(recipe => recipe.id === recipeId);

export const selectAllRawMaterials = (state: RootState) => state.recipe.rawMaterials;
export const selectRawMaterial = (state: RootState, materialId: string) => state.recipe.rawMaterials.find(mat => mat.id === materialId);

export const { reducer: recipeReducer } = recipeSlice;
