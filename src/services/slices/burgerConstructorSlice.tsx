import { createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID)
    return crypto.randomUUID();

  return (
    '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  );
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: {
    ingredients: [] as TConstructorIngredient[],
    bun: null as TIngredient | null
  },
  reducers: {
    addIngredient: {
      reducer: (state, action: { payload: TConstructorIngredient }) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const idIngredient: TConstructorIngredient = {
          ...ingredient,
          id: generateId()
        };
        return { payload: idIngredient };
      }
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient: (
      state,
      action: { payload: { from: number; to: number } }
    ) => {
      const { from, to } = action.payload;
      const ingredients = [...state.ingredients];
      const [movedItem] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, movedItem);
      state.ingredients = ingredients;
    }
  },
  selectors: {
    constructorState: (state) => state
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const { constructorState } = burgerConstructorSlice.selectors;

export type BurgerConstructorState = ReturnType<
  typeof burgerConstructorSlice.reducer
>;

export default burgerConstructorSlice.reducer;
