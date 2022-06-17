import useSWR from 'swr';
import fetcher from '../models/fetcher';
import logo from '../logo.png'

import { Layout, Menu, Input, Dropdown, Space, Slider, Button } from 'antd'
import { Children, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

const { Search } = Input
const { Header, Footer, Sider, Content, } = Layout;

function LayoutHeader({setGenre, setProfileId, setLoggedId, setPlatforms, setRatingRange, setReleaseRange, setSearchInput, releaseValue, ratingValue, searchInput, setPage}: any) {
  const menu = (
    <Menu
      items={[
        {
          key: 'release',
          type: 'group',
          label: 'Release date',
          children: [
            {
              key: 'releaseSlider',
              label: (<Slider range defaultValue={[1980, new Date().getFullYear()]} min={1980} max={new Date().getFullYear()} onChange={(value) => setReleaseRange(value)} value={releaseValue}/>),
            },
          ],
        },
        {
          key: 'rating',
          type: 'group',
          label: 'Rating',
          children: [
            {
              key: 'ratingSlider',
              label: (<Slider range defaultValue={[0, 100]} min={0} max={100} onChange={(value) => setRatingRange(value)} value={ratingValue}/>),
            },
          ],
        },
        {
          key: 'search',
          type: 'group',
          label: 'Search',
          children: [
            {
              key: 'searchInput',
              label: (<Search onSearch={(value) => setSearchInput(value)} defaultValue=''/>),
            },
          ],
        }
      ]}
    />
  );
  const headers = {
    "Content-Type": "application/json",
  }

  const navigate = useNavigate();
  const { data: genreData, error: genreError } = useSWR('http://localhost:4000/api/genres', fetcher)
  const { data: platformData, error: platformError } = useSWR('http://localhost:4000/api/platforms', fetcher)
  const valKey = [[[30, 31],["Register","Login"]],[[32, 33],["Logout","Profile page"]]]
  const [decider, setDecider] = useState(0)
  const [userId, setUserId] = useState(undefined)
  const [selectedKeys, setSelectedKeys] = useState(['11', '21'])

  useEffect(() => {
    axios.get('http://localhost:4000/api/loggedUser', {headers, withCredentials: true}).then(response => {
    setDecider(response.data.data.userId !== undefined ? 1 : 0)
    setUserId(response.data.data.userId)
  })
  }, [decider]);

  if (genreError || platformError) return <div>failed to load</div>;
  if (!genreData || !platformData) return <div>loading...</div>;

  const genres: any = genreData.data;
  const genreChildren = new Array(genres.length + 1)
  genreChildren[0] = {key: '21', label: 'All genres'}
  for (let i = 0; i < genres.length; i++) {
    genreChildren[i+1] = {key: genres[i].id, label: genres[i].name}
  }

  const platforms: any = platformData.data;
  const platformChildren = new Array(platforms.length + 1)
  platformChildren[0] = {key: '11', label: 'All platforms'}
  for (let i = 0; i < platforms.length; i++) {
    platformChildren[i + 1] = {key: platforms[i].id, label: platforms[i].name}
  }

  function menuClick({ item, key, keyPath, selectedKeys, domEvent }: any){
    setSelectedKeys(selectedKeys)
    setPage(0)
    if (genreChildren.map(genre => genre.key).includes(key)){
      if (selectedKeys.includes('21')){
        setGenre(undefined);
      }
      else {
        setGenre(selectedKeys);
      }
    }

    if (platformChildren.map(platform => platform.key).includes(key)){
      if (selectedKeys.includes('11')){
        setPlatforms(undefined);
      }
      else {
        setPlatforms(selectedKeys);
      }
    }

    if (key === "31"){
      navigate('/login')
    }
    if (key === "30"){
      navigate('/register')
    }
    if (key === "7"){
      navigate('/')
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
        <Link 
        to={'/'} 
        onClick={() => {
          setGenre(undefined); setPlatforms(undefined); setRatingRange([0, 100]); setReleaseRange([1980, new Date().getFullYear()]); setSearchInput('');
          setSelectedKeys(['11', '21']); setPage(0); setSearchInput('')
        }}><img src={logo} className='logo' alt="CSHD Logo"></img></Link>
          {window.location.pathname === "/" &&
            <Menu
                defaultSelectedKeys={['21', '11']}
                key=''
                mode='horizontal'
                theme='dark'
                multiple={true}
                selectedKeys={selectedKeys}
                onSelect={menuClick}
                onDeselect={menuClick}
                items={[
                {
                    label: 'Platforms',
                    key: 1,
                    children: platformChildren
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
                },
                {
                  label:
                    <Dropdown overlay={menu}>
                      <a onClick={e => e.preventDefault()}>
                        <Space>
                          Filters & Search
                          <DownOutlined />
                        </Space>
                      </a>
                    </Dropdown>,
                  key: 4,
                },
                ]} >
            
            </Menu>
            ||
            <Menu
            mode='horizontal'
            theme='dark'
            multiple={true}
            onClick={() => navigate('/')}
            items={[
              {
                label: 'Home',
                key: 7,
              },
            ]}
            >
            </Menu>
          }
        
    </Header>
  );
};

export default LayoutHeader;
