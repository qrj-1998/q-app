import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

import Router from './routers';

import { Layout, Menu, theme } from 'antd';
const { Header, Content, Sider } = Layout;


const menus = [
  {
    key: '1',
    label: <li><Link to="/">React</Link></li>,
  },
  {
    key: '2',
    label: <li><Link to="/vue-app">Vue</Link></li>,
  }
]

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <BrowserRouter>
      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="demo-logo" />
        </Header>
        <div
          style={{
            padding: '0 48px',
          }}
        >
          <Layout
            style={{
              padding: '24px 0',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Sider
              style={{
                background: colorBgContainer,
              }}
              width={200}
            >
              <Menu
                mode="inline"
                style={{
                  height: '100%',
                }}
                items={menus}
              />
            </Sider>
            <Content
              style={{
                padding: '0 24px',
                minHeight: 280,
              }}
            >
              <Router />
            </Content>
          </Layout>
        </div>
      </Layout>
    </BrowserRouter>
  );
}

export default App;