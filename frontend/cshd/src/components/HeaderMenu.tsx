import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Layout, Card, Menu } from 'antd'
import { Children } from 'react';
const { Header, Footer, Sider, Content, } = Layout;

function HeaderMenu() {
  const { data, error } = useSWR('http://localhost:4000/api/genres', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const genres: any = data.data;

  return (
    <Menu
        mode='horizontal'
        theme='dark'
        items={[
          { 
            label: 'Top Rated Games',
            key: 0,
            children: [{key: 10, label: 'Last week'}, {key: 11, label: 'Last month'}, {key: 12, label: 'All time'}, ] 
          },
          { 
            label: 'New and Noteworthy',
            key: 1 
          },
          { 
            label: 'Genres',
            key: 2,
            children: genres.map((genre: any) => ({key: genre.id, label: genre.name}))
          },
        ]} />
  );
};

export default HeaderMenu;