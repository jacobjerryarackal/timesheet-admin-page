'use client';

import React from 'react';
import { Card, List, Tag, Avatar, Space, Button } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  UserAddOutlined, 
  FileTextOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from './RecentActivity.module.css';

dayjs.extend(relativeTime);

interface ActivityItem {
  id: string;
  type: 'timesheet' | 'user' | 'approval' | 'system' | 'leave';
  title: string;
  description: string;
  user?: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  action?: string;
}

const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'timesheet',
      title: 'New Timesheet Submitted',
      description: 'John Doe submitted timesheet for week Jan 08-12',
      user: 'John Doe',
      timestamp: '2024-01-15 14:30',
      status: 'info',
      action: 'Review',
    },
    {
      id: '2',
      type: 'approval',
      title: 'Timesheet Approved',
      description: 'Jane Smith\'s timesheet approved by Admin',
      user: 'Jane Smith',
      timestamp: '2024-01-15 11:15',
      status: 'success',
    },
    {
      id: '3',
      type: 'user',
      title: 'New User Added',
      description: 'Michael Brown joined the Marketing team',
      user: 'Michael Brown',
      timestamp: '2024-01-15 09:45',
      status: 'success',
      action: 'View',
    },
    {
      id: '4',
      type: 'leave',
      title: 'Leave Request Pending',
      description: 'Sarah Williams requested 3 days of vacation',
      user: 'Sarah Williams',
      timestamp: '2024-01-14 16:20',
      status: 'warning',
      action: 'Approve',
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update',
      description: 'Weekly backup completed successfully',
      timestamp: '2024-01-14 23:00',
      status: 'success',
    },
    {
      id: '6',
      type: 'timesheet',
      title: 'Timesheet Rejected',
      description: 'Robert Johnson\'s timesheet rejected - missing entries',
      user: 'Robert Johnson',
      timestamp: '2024-01-14 15:30',
      status: 'error',
      action: 'Resubmit',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'timesheet':
        return <FileTextOutlined />;
      case 'user':
        return <UserAddOutlined />;
      case 'approval':
        return <CheckCircleOutlined />;
      case 'leave':
        return <ClockCircleOutlined />;
      case 'system':
        return <WarningOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'warning':
        return 'gold';
      case 'error':
        return 'red';
      case 'info':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <ArrowUpOutlined />;
      case 'error':
        return <ArrowDownOutlined />;
      default:
        return null;
    }
  };

  return (
    <Card 
      title="Recent Activity" 
      className={styles.recentActivity}
      extra={<Button type="link">View All</Button>}
    >
      <List
        dataSource={activities}
        renderItem={(item) => (
          <List.Item className={styles.activityItem}>
            <div className={styles.activityContent}>
              <div className={styles.activityIcon}>
                {getActivityIcon(item.type)}
              </div>
              <div className={styles.activityDetails}>
                <div className={styles.activityHeader}>
                  <div className={styles.activityTitle}>
                    {item.title}
                    {item.status && (
                      <Tag 
                        color={getStatusColor(item.status)}
                        className={styles.statusTag}
                        icon={getStatusIcon(item.status)}
                      >
                        {item.status}
                      </Tag>
                    )}
                  </div>
                  <div className={styles.activityTime}>
                    {dayjs(item.timestamp).fromNow()}
                  </div>
                </div>
                <div className={styles.activityDescription}>
                  {item.description}
                </div>
                {item.user && (
                  <div className={styles.activityUser}>
                    <Avatar size="small" className={styles.userAvatar}>
                      {item.user.charAt(0)}
                    </Avatar>
                    <span className={styles.userName}>{item.user}</span>
                  </div>
                )}
              </div>
            </div>
            {item.action && (
              <Button type="link" size="small" className={styles.actionButton}>
                {item.action}
              </Button>
            )}
          </List.Item>
        )}
        className={styles.activityList}
      />
    </Card>
  );
};

export default RecentActivity;