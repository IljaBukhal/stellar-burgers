import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке ингредиентов';
      });
  },
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectIngredientsState: (state) => state,
    selectIngredients: (state) => state.ingredients,
    selectError: (state) => state.error
  }
});

export const {
  selectIngredientsState,
  selectIngredients,
  selectIsLoading,
  selectError
} = ingredientsSlice.selectors;

export const getIngredientsByType = createSelector(
  [selectIngredients],
  (ingredients) => {
    const buns = ingredients.filter((item) => item.type === 'bun');
    const mains = ingredients.filter((item) => item.type === 'main');
    const sauces = ingredients.filter((item) => item.type === 'sauce');
    return { buns, mains, sauces };
  }
);

export default ingredientsSlice.reducer;
