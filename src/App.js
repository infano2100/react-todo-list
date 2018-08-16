import React from 'react'
import Note from './pages/note'
import { Layout } from 'antd'

const { Content } = Layout

export const App = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <Content style={{ margin: '24px 16px 0' }}>
      <div>
        <Note />
      </div>
    </Content>
  </Layout>
)

export default App
