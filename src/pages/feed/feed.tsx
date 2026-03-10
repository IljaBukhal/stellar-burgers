import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchFeed,
  selectFeed,
  selectIsLoading,
  selectOrdersFeed
} from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrdersFeed);
  const isLoading = useSelector(selectIsLoading);
  const feed = useSelector(selectFeed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (!orders.length) return 'Нет заказов';
  if (isLoading || !feed) return <Preloader />;
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
