'use client';

import React from 'react';
import { Layout, Button, Dropdown, Badge, Avatar, Space } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BellOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from '@/styles/header.module.css';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Profile Settings',
    },
    {
      key: '2',
      label: 'System Logs',
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: 'Logout',
      danger: true,
    },
  ];

  const notificationItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className={styles.notificationItem}>
          <div className={styles.notificationTitle}>New timesheet submitted</div>
          <div className={styles.notificationTime}>2 minutes ago</div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className={styles.notificationItem}>
          <div className={styles.notificationTitle}>Leave request pending</div>
          <div className={styles.notificationTime}>1 hour ago</div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div className={styles.notificationItem}>
          <div className={styles.notificationTitle}>System update completed</div>
          <div className={styles.notificationTime}>3 hours ago</div>
        </div>
      ),
    },
  ];

  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerLeft}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className={styles.collapseButton}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        />
        <div className={styles.searchBar}>
          <SearchOutlined className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search users, timesheets, reports..." 
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.headerRight}>
        <Space size="middle">
          <Dropdown menu={{ items: notificationItems }} placement="bottomRight">
            <Badge count={5} size="small" className={styles.notificationBadge}>
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                className={styles.headerButton}
                aria-label="Notifications"
              />
            </Badge>
          </Dropdown>
          
          <Button 
            type="text" 
            icon={<QuestionCircleOutlined />} 
            className={styles.headerButton}
            aria-label="Help"
          />
          
          <Dropdown menu={{ items }} placement="bottomRight">
            <div className={styles.userDropdown}>
              <Avatar size="default" icon={<UserOutlined />} />
              <div className={styles.userInfo}>
                <div className={styles.userName}>Admin User</div>
                <div className={styles.userEmail}>admin@timetrackpro.com</div>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;