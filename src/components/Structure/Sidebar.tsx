'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Tooltip } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  BarChartOutlined, 
  CalendarOutlined, 
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/styles/sidebar.module.css';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState(pathname);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: 'User Management',
    },
    {
      key: '/timesheets',
      icon: <FileTextOutlined />,
      label: 'Timesheets',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
    {
      key: '/leave',
      icon: <CalendarOutlined />,
      label: 'Leave Management',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    router.push(key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={styles.sider}
      width={250}
    >
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          {collapsed ? 'TP' : 'TimeTrack Pro'}
        </div>
        <div className={styles.logoSubtitle}>
          {!collapsed && 'Admin Panel'}
        </div>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        className={styles.menu}
      />

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <Avatar 
            size={collapsed ? 32 : 40} 
            icon={<UserOutlined />} 
            className={styles.avatar}
          />
          {!collapsed && (
            <div className={styles.userDetails}>
              <div className={styles.userName}>Admin User</div>
              <div className={styles.userRole}>Administrator</div>
            </div>
          )}
        </div>
        
        <Tooltip title="Logout" placement="right">
          <div className={styles.logoutButton}>
            <LogoutOutlined />
            {!collapsed && <span>Logout</span>}
          </div>
        </Tooltip>
      </div>
    </Sider>
  );
};

export default Sidebar;