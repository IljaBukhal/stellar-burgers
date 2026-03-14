import ingredientsReducer, {
  fetchIngredients
} from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const initialState = {
  isLoading: false,
  ingredients: [],
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Ingredient 1',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  },
  {
    _id: '2',
    name: 'Ingredient 2',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 200,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('ingredients slice', () => {
  test('установить isLoading в true при pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('установить ингредиенты и isLoading в false при fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('установить ошибку и isLoading в false при rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.ingredients).toEqual([]);
  });
});
