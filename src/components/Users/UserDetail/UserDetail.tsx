'use client';

import React from 'react';
import { Card, Descriptions, Tag, Avatar, Row, Col, Statistic, Progress, Button, Space } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import styles from './UserDetail.module.css';

interface UserDetailProps {
  userId: string;
}

const UserDetail: React.FC<UserDetailProps> = ({ userId }) => {
  // Mock user data - in real app, fetch by userId
  const user = {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john@company.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    department: 'IT',
    jobTitle: 'Senior Developer',
    status: 'active',
    startDate: '2023-01-15',
    lastLogin: '2024-01-15 14:30',
    avatar: null,
  };

  const stats = {
    totalHours: 1245,
    weeklyAverage: 42,
    compliance: 95,
    projects: 3,
  };

  const recentActivity = [
    { id: 1, action: 'Submitted timesheet', date: '2024-01-15 14:30' },
    { id: 2, action: 'Logged 8 hours', date: '2024-01-14 17:45' },
    { id: 3, action: 'Updated profile', date: '2024-01-12 10:20' },
    { id: 4, action: 'Approved leave request', date: '2024-01-10 09:15' },
  ];

  return (
    <div className={styles.userDetail}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar size={64} icon={<UserOutlined />} className={styles.avatar} />
          <div className={styles.userMain}>
            <h1 className={styles.userName}>{user.name}</h1>
            <div className={styles.userMeta}>
              <Tag color="blue">{user.role.toUpperCase()}</Tag>
              <span className={styles.userDepartment}>{user.department}</span>
              <Tag color="green">{user.status.toUpperCase()}</Tag>
            </div>
          </div>
        </div>
        <Space>
          <Button icon={<EditOutlined />}>Edit Profile</Button>
          <Button icon={<DownloadOutlined />}>Export Data</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {/* User Details */}
        <Col xs={24} lg={12}>
          <Card title="User Information" className={styles.infoCard}>
            <Descriptions column={1}>
              <Descriptions.Item label={<><UserOutlined /> Employee ID</>}>
                {user.id}
              </Descriptions.Item>
              <Descriptions.Item label={<><MailOutlined /> Email</>}>
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                {user.phone}
              </Descriptions.Item>
              <Descriptions.Item label={<><TeamOutlined /> Job Title</>}>
                {user.jobTitle}
              </Descriptions.Item>
              <Descriptions.Item label={<><CalendarOutlined /> Start Date</>}>
                {user.startDate}
              </Descriptions.Item>
              <Descriptions.Item label={<><ClockCircleOutlined /> Last Login</>}>
                {user.lastLogin}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Stats */}
        <Col xs={24} lg={12}>
          <Card title="Performance Stats" className={styles.statsCard}>
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Statistic
                  title="Total Hours"
                  value={stats.totalHours}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Weekly Average"
                  value={stats.weeklyAverage}
                  suffix="hrs"
                />
              </Col>
              <Col xs={12}>
                <div className={styles.complianceStat}>
                  <div className={styles.statLabel}>Compliance</div>
                  <div className={styles.statValue}>{stats.compliance}%</div>
                  <Progress percent={stats.compliance} size="small" />
                </div>
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Active Projects"
                  value={stats.projects}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col span={24}>
          <Card title="Recent Activity" className={styles.activityCard}>
            <div className={styles.activityList}>
              {recentActivity.map(activity => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>{activity.action}</div>
                    <div className={styles.activityDate}>{activity.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDetail;