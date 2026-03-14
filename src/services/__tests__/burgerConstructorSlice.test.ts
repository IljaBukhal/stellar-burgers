import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../../services/slices/burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const initialState = {
  bun: null,
  ingredients: []
};

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 300,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockMain: TIngredient = {
  ...mockBun,
  _id: 'main-1',
  name: 'Котлета',
  type: 'main'
};

describe('burgerConstructor slice', () => {
  test('добавление ингридиента булочек', () => {
    const action = addIngredient(mockBun);
    const newState = burgerConstructorReducer(initialState, action);

    expect(newState.bun).toEqual({ ...mockBun, id: expect.any(String) });
    expect(newState.ingredients).toHaveLength(0);
  });

  test('добавление ингредиентов, не связанных с булочками', () => {
    const action = addIngredient(mockMain);
    const newState = burgerConstructorReducer(initialState, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...mockMain,
      id: expect.any(String)
    });
  });

  test('удаление ингредиента по идентификатору', () => {
    const addAction1 = addIngredient(mockMain);
    const addAction2 = addIngredient({ ...mockMain, _id: 'main-2' });
    let state = burgerConstructorReducer(initialState, addAction1);
    state = burgerConstructorReducer(state, addAction2);

    const idToRemove = state.ingredients[0].id;
    const removeAction = removeIngredient(idToRemove);
    const newState = burgerConstructorReducer(state, removeAction);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0].id).not.toBe(idToRemove);
  });

  test('перемещение ингридиентов', () => {
    const addAction1 = addIngredient(mockMain);
    const addAction2 = addIngredient({ ...mockMain, _id: 'main-2' });
    let state = burgerConstructorReducer(initialState, addAction1);
    state = burgerConstructorReducer(state, addAction2);

    const moveAction = moveIngredient({ from: 0, to: 1 });
    const newState = burgerConstructorReducer(state, moveAction);

    expect(newState.ingredients[0]._id).toBe('main-2');
    expect(newState.ingredients[1]._id).toBe('main-1');
  });

  test('очистка конструктора', () => {
    const addBun = addIngredient(mockBun);
    const addMain = addIngredient(mockMain);
    let state = burgerConstructorReducer(initialState, addBun);
    state = burgerConstructorReducer(state, addMain);

    const newState = burgerConstructorReducer(state, clearConstructor());
    expect(newState).toEqual(initialState);
  });
});
