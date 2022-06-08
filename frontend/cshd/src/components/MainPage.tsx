import useSWR from 'swr';
import fetcher from '../models/fetcher';
//import { game } from '../models/types';

import { Layout, Card } from 'antd'
const { Header, Footer, Sider, Content } = Layout;

function MainPage() {
  const { data, error } = useSWR('http://localhost:4000/api/games', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const games: any = data.data;

  return (
    <>
    <Layout>
      <Header>Header</Header>
      <Content>
        <div className="site-card-border-less-wrapper">
            {games.map((item: any) => <Card title="Card title" bordered={false} style={{ width: 300 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>)}
        </div>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
    </>
  );
};

export default MainPage;