import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Layout, Menu, Input } from 'antd'
import { Children } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const { Search } = Input
const { Header, Footer, Sider, Content, } = Layout;

function LayoutHeader({setGenre}: any) {
  const { data, error } = useSWR('http://localhost:4000/api/genres', fetcher)

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const genres: any = data.data;
  const genreChildren = new Array(genres.length + 1)
  // USER LOGIN //
  const valKey = [[[30, 31],["Register","Login"]],[[32, 33],["Logout","Profile page"]]]
  const decider = (async () => await isLoggedIn()) ? 1 : 0
  ///////////////
  genreChildren[0] = {key: '21', label: 'All genres'}
  for (let i = 0; i < genres.length; i++) {
    genreChildren[i+1] = {key: genres[i].id, label: genres[i].name}
  }

  function menuClick({ item, key, keyPath, selectedKeys, domEvent }: any){
    setGenre(selectedKeys);
    console.log(key)
    if (key === "33") {
      console.log((async () => (await axios.get('http://localhost:4000/api/loggedUser')).data.userId))
      return( <Navigate to={`/profile/${async ()=>{
        console.log(decider)
        if (decider === 1) { // CHECK
          console.log("WOOO")
          return (await axios.get('http://localhost:4000/api/loggedUser')).data.userId
        }
      }}`}/>)
    } else if(key === "32") {
      console.log("W");
      const f = async () => {await axios.delete("http://localhost:4000/api/logout")} // ????
      f()

    }
  }

  return (
    <Header>
        <img src='logo.png' className='logo'></img>
        <Search className='menu-search'></Search>
        <Menu
            mode='horizontal'
            theme='dark'
            multiple={true}
            onSelect={menuClick}
            onDeselect={menuClick}
            items={[
            { 
                label: 'Top Rated Games',
                key: 0,
                children: [{key: 10, label: 'Last week'}, {key: 11, label: 'Last month'}, {key: 12, label: 'All time'}, ] 
            },
            { 
                label: 'Genres',
                key: 2,
                children: genreChildren
            },
            { 
                label: 'User',
                key: 3,
              
                children: [{key: valKey[decider][0][0], label: valKey[decider][1][0]}, {key: valKey[decider][0][1], label: valKey[decider][1][1]}, ],
                //children: [{key: 32, label: 'Logout'}, {key: 33, label: 'Profile page'}, ],
            },
            ]} ></Menu>
    </Header>
  );
};

export default LayoutHeader;

export async function isLoggedIn(){
  return (await axios.get('http://localhost:4000/api/loggedUser')).status !== 222
}
