'use client';

import React from 'react';
import { Card, Button, Space, Badge, List, Tag } from 'antd';
import { 
  PlusOutlined, 
  UserAddOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  SettingOutlined,
  BarChartOutlined,
  CalendarOutlined,
  BellOutlined,
  TeamOutlined
} from '@ant-design/icons';
import styles from './QuickActions.module.css';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
  badge?: 'new' | 'urgent' | 'pending';
}

const QuickActions: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Add New User',
      description: 'Create a new user account',
      icon: <UserAddOutlined />,
      color: '#1890ff',
    },
    {
      id: '2',
      title: 'Approve Timesheets',
      description: '12 pending approvals',
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      count: 12,
      badge: 'pending',
    },
    {
      id: '3',
      title: 'Generate Report',
      description: 'Weekly performance report',
      icon: <BarChartOutlined />,
      color: '#722ed1',
    },
    {
      id: '4',
      title: 'Leave Requests',
      description: '5 pending requests',
      icon: <CalendarOutlined />,
      color: '#faad14',
      count: 5,
      badge: 'urgent',
    },
  ];

  const pendingItems = [
    {
      id: '1',
      title: 'Timesheets Pending',
      count: 12,
      icon: <FileTextOutlined />,
      color: '#1890ff',
    },
    {
      id: '2',
      title: 'Leave Requests',
      count: 5,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
    },
    {
      id: '3',
      title: 'New Users',
      count: 3,
      icon: <TeamOutlined />,
      color: '#52c41a',
    },
    {
      id: '4',
      title: 'System Alerts',
      count: 2,
      icon: <BellOutlined />,
      color: '#ff4d4f',
    },
  ];

  const systemTasks = [
    {
      id: '1',
      title: 'Backup Database',
      status: 'completed',
      time: 'Last night',
    },
    {
      id: '2',
      title: 'Update User Permissions',
      status: 'pending',
      time: 'Due today',
    },
    {
      id: '3',
      title: 'Generate Monthly Report',
      status: 'pending',
      time: 'Due in 2 days',
    },
    {
      id: '4',
      title: 'System Maintenance',
      status: 'scheduled',
      time: 'Scheduled for Saturday',
    },
  ];

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'new':
        return 'blue';
      case 'urgent':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      title="Quick Actions" 
      className={styles.quickActions}
      extra={
        <Space>
          <Button type="text" size="small" icon={<DownloadOutlined />}>
            Export
          </Button>
          <Button type="text" size="small" icon={<SettingOutlined />}>
            Settings
          </Button>
        </Space>
      }
    >
      {/* Quick Action Buttons */}
      <div className={styles.actionButtons}>
        {quickActions.map((action) => (
          <div key={action.id} className={styles.actionButtonWrapper}>
            <Button
              type="text"
              className={styles.actionButton}
              onClick={() => console.log(`Action: ${action.title}`)}
            >
              <div className={styles.actionIcon} style={{ backgroundColor: `${action.color}15` }}>
                {React.cloneElement(action.icon as React.ReactElement, { 
                  style: { color: action.color, fontSize: '20px' } 
                })}
              </div>
              <div className={styles.actionContent}>
                <div className={styles.actionTitle}>
                  {action.title}
                  {action.badge && (
                    <Tag 
                      color={getBadgeColor(action.badge)} 
                      className={styles.actionBadge}
                    >
                      {action.badge}
                    </Tag>
                  )}
                </div>
                <div className={styles.actionDescription}>
                  {action.description}
                </div>
              </div>
              {action.count && (
                <Badge 
                  count={action.count} 
                  style={{ backgroundColor: action.color }}
                  className={styles.actionCount}
                />
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Pending Items */}
      <div className={styles.pendingSection}>
        <div className={styles.sectionTitle}>
          <ClockCircleOutlined />
          <span>Pending Items</span>
        </div>
        <div className={styles.pendingItems}>
          {pendingItems.map((item) => (
            <div key={item.id} className={styles.pendingItem}>
              <div className={styles.pendingIcon} style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className={styles.pendingContent}>
                <div className={styles.pendingTitle}>{item.title}</div>
                <div className={styles.pendingTime}>{item.count} pending</div>
              </div>
              <Button 
                type="link" 
                size="small"
                className={styles.pendingAction}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* System Tasks */}
      <div className={styles.tasksSection}>
        <div className={styles.sectionTitle}>
          <CheckCircleOutlined />
          <span>System Tasks</span>
        </div>
        <List
          dataSource={systemTasks}
          renderItem={(task) => (
            <List.Item className={styles.taskItem}>
              <div className={styles.taskContent}>
                <div className={styles.taskTitle}>{task.title}</div>
                <div className={styles.taskTime}>{task.time}</div>
              </div>
              <Tag 
                color={
                  task.status === 'completed' ? 'green' :
                  task.status === 'urgent' ? 'red' :
                  task.status === 'scheduled' ? 'blue' : 'orange'
                }
                className={styles.taskStatus}
              >
                {task.status}
              </Tag>
            </List.Item>
          )}
          className={styles.tasksList}
        />
      </div>
    </Card>
  );
};

export default QuickActions;