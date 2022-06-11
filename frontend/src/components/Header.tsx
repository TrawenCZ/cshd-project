import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Layout, Menu, Input } from 'antd'
import { Children } from 'react';

const { Search } = Input
const { Header, Footer, Sider, Content, } = Layout;

function LayoutHeader({setGenre}: any) {
  const { data, error } = useSWR('http://localhost:4000/api/genres', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const genres: any = data.data;
  const genreChildren = new Array(genres.length + 1)
  genreChildren[0] = {key: '21', label: 'All genres'}
  for (let i = 0; i < genres.length; i++) {
    genreChildren[i+1] = {key: genres[i].id, label: genres[i].name}
  }

  function menuClick({ item, key, keyPath, selectedKeys, domEvent }: any){
    setGenre(key);
  }

  return (
    <Header>
        <img src='logo.png' className='logo'></img>
        <Search className='menu-search'></Search>
        <Menu
            mode='horizontal'
            theme='dark'
            multiple={true}
            defaultSelectedKeys={['1']}
            onClick={menuClick}
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
                children: genreChildren
            },
            { 
                label: 'User',
                key: 3,
            },
            ]} ></Menu>
    </Header>
  );
};

export default LayoutHeader;
