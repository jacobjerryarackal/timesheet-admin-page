'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography } from 'antd';
import { 
  TeamOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  FileDoneOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined 
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RecentActivity from '../RecentActivity/RecentActivity';
import QuickActions from '../QuickActions/QuickActions';
import styles from './DashboardContent.module.css';

const { Title, Text } = Typography;

const DashboardContent: React.FC = () => {
  // Dummy data for charts
  const weeklyData = [
    { name: 'Mon', hours: 320, users: 45 },
    { name: 'Tue', hours: 380, users: 48 },
    { name: 'Wed', hours: 310, users: 42 },
    { name: 'Thu', hours: 410, users: 50 },
    { name: 'Fri', hours: 390, users: 49 },
    { name: 'Sat', hours: 150, users: 25 },
    { name: 'Sun', hours: 120, users: 20 },
  ];

  const stats = [
    {
      title: 'Total Users',
      value: 1245,
      icon: <TeamOutlined />,
      color: '#1890ff',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Weekly Hours',
      value: 2080,
      icon: <ClockCircleOutlined />,
      color: '#52c41a',
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Approved Timesheets',
      value: 892,
      icon: <CheckCircleOutlined />,
      color: '#faad14',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Pending Approval',
      value: 124,
      icon: <FileDoneOutlined />,
      color: '#ff4d4f',
      change: '-3%',
      trend: 'down',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <Title level={2} className={styles.dashboardTitle}>
          Dashboard Overview
        </Title>
        <Text type="secondary">Welcome back, Admin! Here's what's happening today.</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15` }}>
                {React.cloneElement(stat.icon, { 
                  style: { color: stat.color, fontSize: '20px' } 
                })}
              </div>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: '#1f1f1f', fontSize: '28px' }}
              />
              <div className={styles.statTrend}>
                <span className={styles.trendValue} style={{ color: stat.trend === 'up' ? '#52c41a' : '#ff4d4f' }}>
                  {stat.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {stat.change}
                </span>
                <span className={styles.trendText}> from last week</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Grid */}
      <Row gutter={[16, 16]} className={styles.mainContent}>
        {/* Weekly Hours Chart */}
        <Col xs={24} lg={16}>
          <Card 
            title={<Title level={4}>Weekly Hours Overview</Title>}
            className={styles.chartCard}
          >
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#1890ff" name="Total Hours" />
                  <Bar dataKey="users" fill="#52c41a" name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Progress Section */}
        <Col xs={24} lg={8}>
          <Card 
            title={<Title level={4}>System Health</Title>}
            className={styles.progressCard}
          >
            <div className={styles.progressSection}>
              <div className={styles.progressItem}>
                <Text>Timesheet Compliance</Text>
                <Progress percent={92} strokeColor="#52c41a" />
              </div>
              <div className={styles.progressItem}>
                <Text>User Activity</Text>
                <Progress percent={78} strokeColor="#1890ff" />
              </div>
              <div className={styles.progressItem}>
                <Text>System Uptime</Text>
                <Progress percent={99.9} strokeColor="#faad14" />
              </div>
              <div className={styles.progressItem}>
                <Text>Approval Rate</Text>
                <Progress percent={88} strokeColor="#722ed1" />
              </div>
            </div>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={16}>
          <RecentActivity />
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <QuickActions />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;