import { rootReducer } from '../store';

describe('rootReducer', () => {
  test('при вызове с неопределенным состоянием и неизвестным действием возвращать исходное состояние', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    const expectedState = {
      ingredients: {
        isLoading: false,
        ingredients: [],
        error: null
      },
      order: {
        isLoading: false,
        order: null,
        error: null
      },
      user: {
        isInit: false,
        isLoading: false,
        user: null,
        error: null
      },
      feed: {
        isLoading: false,
        feed: null,
        orders: [],
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      }
    };

    expect(state).toEqual(expectedState);
  });
});
