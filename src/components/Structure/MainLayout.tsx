'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb/Breadcrumb';
import styles from '@/styles/layout.module.css';

const { Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={styles.mainLayout}>
      <Sidebar collapsed={collapsed} />
      <Layout 
        className={`${styles.siteLayout} ${collapsed ? styles.siteLayoutCollapsed : styles.siteLayoutExpanded}`}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className={styles.content}>
          <Breadcrumb />
          <div className={styles.contentInner}>
            {children}
          </div>
        </Content>
        <Footer className={styles.footer}>
          TimeTrack Pro ©{new Date().getFullYear()} - Admin Dashboard
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;