import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Layout, Menu, Input } from 'antd'
import { Children, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';

const { Search } = Input
const { Header, Footer, Sider, Content, } = Layout;

function LayoutHeader({setGenre}: any) {
  const { data, error } = useSWR('http://localhost:4000/api/genres', fetcher)
  const valKey = [[[30, 31],["Register","Login"]],[[32, 33],["Logout","Profile page"]]]
  const [decider, setDecider] = useState(0)

  axios.get('http://localhost:4000/api/loggedUser').then((response) => {
      setDecider(response.data.status === 'error' ? 0 : 1)
  });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const genres: any = data.data;
  const genreChildren = new Array(genres.length + 1)
  genreChildren[0] = {key: '21', label: 'All genres'}
  for (let i = 0; i < genres.length; i++) {
    genreChildren[i+1] = {key: genres[i].id, label: genres[i].name}
  }

  function menuClick({ item, key, keyPath, selectedKeys, domEvent }: any){
    if (selectedKeys.includes('21')){
      setGenre(undefined);
    }
    else {
      setGenre(selectedKeys);
    }
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
      console.log(decider);
      const f = async () => {console.log(await axios.delete("http://localhost:4000/api/logout"))} // ????
      f()
      console.log(decider);
    }
  }

  return (
    <Header>
        <Link to={'/'}><img src='logo.png' className='logo'></img></Link>
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
  const x = (await axios.get('http://localhost:4000/api/loggedUser')).data.status
  console.log('test');
  return x !== 'error'
}
