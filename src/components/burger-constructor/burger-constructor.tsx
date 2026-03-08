import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  constructorState
} from '../../services/slices/burgerConstructorSlice';
import {
  clearOrderState,
  createOrder,
  selectOrder
} from '../../services/slices/orderSlice';
import { selectIsLoading, selectIsInit } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const constructorItems = useSelector(constructorState);
  const orderRequest = useSelector(selectIsLoading);
  const orderModalData = useSelector(selectOrder);
  const isAuthenticated = useSelector(selectIsInit);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;
    const ingredientsId: string[] = [
      constructorItems.bun._id,
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];
    dispatch(createOrder(ingredientsId));
  };
  const closeOrderModal = () => {
    dispatch(clearOrderState());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
