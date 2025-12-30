'use client';

import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Tabs, 
  DatePicker, 
  Select, 
  Button, 
  Table, 
  Statistic,
  Space,
  Input,
  Tag
} from 'antd';
import { 
  DownloadOutlined, 
  FilePdfOutlined, 
  FileExcelOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import type { ColumnsType } from 'antd/es/table';
import styles from './ReportsContent.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface ReportDataType {
  key: string;
  user: string;
  totalHours: number;
  overtime: number;
  leaveHours: number;
  meetingHours: number;
  compliance: number;
  projects: number;
}

interface DepartmentData {
  name: string;
  value: number;
  color: string;
}

const ReportsContent: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>([null, null]);
  const [reportType, setReportType] = useState('weekly');
  const [activeTab, setActiveTab] = useState('summary');

  // Dummy data for charts
  const weeklyData = [
    { name: 'Week 1', hours: 320, users: 45 },
    { name: 'Week 2', hours: 380, users: 48 },
    { name: 'Week 3', hours: 310, users: 42 },
    { name: 'Week 4', hours: 410, users: 50 },
    { name: 'Week 5', hours: 390, users: 49 },
  ];

  const departmentData: DepartmentData[] = [
    { name: 'Engineering', value: 1245, color: '#1890ff' },
    { name: 'Marketing', value: 892, color: '#52c41a' },
    { name: 'Sales', value: 756, color: '#faad14' },
    { name: 'HR', value: 523, color: '#722ed1' },
    { name: 'Operations', value: 432, color: '#ff4d4f' },
  ];

  const projectData = [
    { name: 'Project Alpha', hours: 1560, budget: 50000 },
    { name: 'Project Beta', hours: 1280, budget: 45000 },
    { name: 'Project Gamma', hours: 980, budget: 35000 },
    { name: 'Project Delta', hours: 750, budget: 28000 },
    { name: 'Project Epsilon', hours: 520, budget: 20000 },
  ];

  const reportData: ReportDataType[] = [
    {
      key: '1',
      user: 'John Doe',
      totalHours: 168,
      overtime: 8,
      leaveHours: 16,
      meetingHours: 12,
      compliance: 95,
      projects: 3,
    },
    {
      key: '2',
      user: 'Jane Smith',
      totalHours: 160,
      overtime: 0,
      leaveHours: 8,
      meetingHours: 16,
      compliance: 100,
      projects: 2,
    },
    {
      key: '3',
      user: 'Robert Johnson',
      totalHours: 165,
      overtime: 5,
      leaveHours: 0,
      meetingHours: 10,
      compliance: 98,
      projects: 4,
    },
    {
      key: '4',
      user: 'Sarah Williams',
      totalHours: 152,
      overtime: 0,
      leaveHours: 24,
      meetingHours: 8,
      compliance: 90,
      projects: 2,
    },
    {
      key: '5',
      user: 'Michael Brown',
      totalHours: 172,
      overtime: 12,
      leaveHours: 0,
      meetingHours: 14,
      compliance: 96,
      projects: 3,
    },
  ];

  const columns: ColumnsType<ReportDataType> = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 150,
    },
    {
      title: 'Total Hours',
      dataIndex: 'totalHours',
      key: 'totalHours',
      width: 120,
      sorter: (a, b) => a.totalHours - b.totalHours,
    },
    {
      title: 'Overtime',
      dataIndex: 'overtime',
      key: 'overtime',
      width: 100,
      render: (hours) => (
        <Tag color={hours > 0 ? 'orange' : 'green'}>
          {hours > 0 ? `+${hours} hrs` : 'None'}
        </Tag>
      ),
    },
    {
      title: 'Leave Hours',
      dataIndex: 'leaveHours',
      key: 'leaveHours',
      width: 100,
    },
    {
      title: 'Meeting Hours',
      dataIndex: 'meetingHours',
      key: 'meetingHours',
      width: 120,
    },
    {
      title: 'Compliance %',
      dataIndex: 'compliance',
      key: 'compliance',
      width: 120,
      render: (percent) => (
        <div className={styles.complianceCell}>
          <div className={styles.complianceBar}>
            <div 
              className={styles.complianceFill} 
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className={styles.complianceValue}>{percent}%</span>
        </div>
      ),
    },
    {
      title: 'Projects',
      dataIndex: 'projects',
      key: 'projects',
      width: 100,
    },
  ];

  const handleExport = (type: 'pdf' | 'excel') => {
    console.log(`Exporting ${type} report`);
  };

  return (
    <div className={styles.reportsContent}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Reports & Analytics</h1>
          <p className={styles.subtitle}>Generate detailed reports and analytics</p>
        </div>
        <div className={styles.headerRight}>
          <Space>
            <Button 
              icon={<FilePdfOutlined />} 
              onClick={() => handleExport('pdf')}
            >
              Export PDF
            </Button>
            <Button 
              icon={<FileExcelOutlined />}
              onClick={() => handleExport('excel')}
            >
              Export Excel
            </Button>
          </Space>
        </div>
      </div>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              value={reportType}
              onChange={setReportType}
            >
              <Option value="daily">Daily Report</Option>
              <Option value="weekly">Weekly Report</Option>
              <Option value="monthly">Monthly Report</Option>
              <Option value="yearly">Yearly Report</Option>
              <Option value="custom">Custom Period</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker 
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select Department"
              allowClear
            >
              <Option value="all">All Departments</Option>
              <Option value="engineering">Engineering</Option>
              <Option value="marketing">Marketing</Option>
              <Option value="sales">Sales</Option>
              <Option value="hr">HR</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button type="primary" block>
              Generate Report
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Total Hours This Month"
              value={1245}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div className={styles.statTrend}>+12% from last month</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Active Users"
              value={89}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div className={styles.statTrend}>+5% from last week</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Average Compliance"
              value={94.5}
              suffix="%"
              prefix={<PieChartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div className={styles.statTrend}>+2.3% improvement</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Overtime Hours"
              value={156}
              suffix="hrs"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div className={styles.statTrend}>-8% from last month</div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card className={styles.mainCard}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Summary Report" key="summary">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Weekly Hours Trend">
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="hours" 
                          stroke="#1890ff" 
                          activeDot={{ r: 8 }} 
                          name="Total Hours"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#52c41a" 
                          name="Active Users"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Hours by Department">
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="Project Hours Distribution">
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={projectData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="hours" fill="#1890ff" name="Hours" />
                        <Bar dataKey="budget" fill="#52c41a" name="Budget ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Detailed Report" key="detailed">
            <Card>
              <Table
                columns={columns}
                dataSource={reportData}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                scroll={{ x: 900 }}
              />
            </Card>
          </TabPane>

          <TabPane tab="Compliance Report" key="compliance">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="User Compliance Overview">
                  <div className={styles.complianceGrid}>
                    {reportData.map((user) => (
                      <div key={user.key} className={styles.complianceCard}>
                        <div className={styles.complianceHeader}>
                          <UserOutlined />
                          <span>{user.user}</span>
                        </div>
                        <div className={styles.complianceValue}>
                          {user.compliance}%
                        </div>
                        <div className={styles.complianceDetails}>
                          <div>Total Hours: {user.totalHours}</div>
                          <div>Projects: {user.projects}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ReportsContent;