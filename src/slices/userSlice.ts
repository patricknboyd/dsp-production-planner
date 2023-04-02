import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface CounterState {
  selectedRecipe: string;
}

const initialState: CounterState = {
  selectedRecipe: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    recipeChanged: (state, action: PayloadAction<string>) => {
      const recipeId = action.payload;
      return { ...state, selectedRecipe: recipeId };
    }
  },
});

export const { recipeChanged } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectSavedRecipe = (state: RootState) => state.user.selectedRecipe;

export const { reducer: userReducer } = userSlice;
