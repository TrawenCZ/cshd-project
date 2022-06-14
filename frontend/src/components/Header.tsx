import useSWR from 'swr';
import fetcher from '../models/fetcher';
import logo from '../logo.png'

import { Layout, Menu, Input } from 'antd'
import { Children, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const { Search } = Input
const { Header, Footer, Sider, Content, } = Layout;

function LayoutHeader({setGenre, setProfileId, setLoggedId}: any) {
  const headers = {
    "Content-Type": "application/json",
  }

  const navigate = useNavigate();
  const { data, error } = useSWR('http://localhost:4000/api/genres', fetcher)
  const valKey = [[[30, 31],["Register","Login"]],[[32, 33],["Logout","Profile page"]]]
  const [decider, setDecider] = useState(0)
  const [userId, setUserId] = useState(undefined)

  useEffect(() => {
    axios.get('http://localhost:4000/api/loggedUser', {headers, withCredentials: true}).then(response => {
    setDecider(response.data.data.userId !== undefined ? 1 : 0)
    setUserId(response.data.data.userId)
  })
  }, [decider]);

  // const req = axios.get('http://localhost:4000/api/loggedUser', {headers, withCredentials: true})
  // req.then(response => {
  //   setUserId(response.data.data.userId)
  // })

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const genres: any = data.data;
  const genreChildren = new Array(genres.length + 1)
  genreChildren[0] = {key: '21', label: 'All genres'}
  for (let i = 0; i < genres.length; i++) {
    genreChildren[i+1] = {key: genres[i].id, label: genres[i].name}
  }

  function menuClick({ item, key, keyPath, selectedKeys, domEvent }: any){
    if (genreChildren.map(genre => genre.key).includes(key)){
      if (selectedKeys.includes('21')){
        setGenre(undefined);
      }
      else {
        setGenre(selectedKeys);
      }
    }

    if (key == "31"){
      navigate('/login')
    }
    if (key === "33") {
      navigate(`/user/${userId}`)
      setProfileId(userId)
    } else if(key === "32") {
      setDecider(0)
      setLoggedId && setLoggedId('0')
      axios.delete("http://localhost:4000/api/logout", {
        headers: headers,
        withCredentials: true
      })
    }
  }

  return (
    <Header>
        <Link to={'/'}><img src={logo} className='logo' alt="CSHD Logo"></img></Link>
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

const test = async () => {
  const headers = {
    "Content-Type": "application/json",
  }

  const output = await axios.get('http://localhost:4000/api/loggedUser', {headers, withCredentials: true})
  return (output.data.userId)
}
