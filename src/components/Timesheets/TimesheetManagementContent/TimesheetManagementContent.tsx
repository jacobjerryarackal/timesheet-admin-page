'use client';

import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Modal, 
  DatePicker,
  Badge,
  Dropdown,
  message,
  Progress,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  FileTextOutlined,
  CheckCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from "@/utils/dayjs";
import styles from './TimesheetManagementContent.module.css';


const { RangePicker } = DatePicker;
const { Option } = Select;

interface TimesheetType {
  key: string;
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  targetHours: number;
  project: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

const TimesheetManagementContent: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<TimesheetType[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetType | null>(null);

  // Dummy data
  const dummyTimesheets: TimesheetType[] = [
    {
      key: '1',
      id: 'TS-001',
      userId: 'USR-001',
      userName: 'John Doe',
      userEmail: 'john@company.com',
      weekStart: '2024-01-08',
      weekEnd: '2024-01-12',
      totalHours: 42,
      targetHours: 40,
      project: 'Project Alpha',
      status: 'approved',
      submittedDate: '2024-01-12 16:30',
      approvedBy: 'Admin User',
      approvedDate: '2024-01-13 10:15',
    },
    {
      key: '2',
      id: 'TS-002',
      userId: 'USR-002',
      userName: 'Jane Smith',
      userEmail: 'jane@company.com',
      weekStart: '2024-01-08',
      weekEnd: '2024-01-12',
      totalHours: 38,
      targetHours: 40,
      project: 'Project Beta',
      status: 'pending',
      submittedDate: '2024-01-12 17:45',
    },
    {
      key: '3',
      id: 'TS-003',
      userId: 'USR-003',
      userName: 'Robert Johnson',
      userEmail: 'robert@company.com',
      weekStart: '2024-01-08',
      weekEnd: '2024-01-12',
      totalHours: 40,
      targetHours: 40,
      project: 'Project Gamma',
      status: 'approved',
      submittedDate: '2024-01-12 15:20',
      approvedBy: 'Admin User',
      approvedDate: '2024-01-13 09:45',
    },
    {
      key: '4',
      id: 'TS-004',
      userId: 'USR-004',
      userName: 'Sarah Williams',
      userEmail: 'sarah@company.com',
      weekStart: '2024-01-01',
      weekEnd: '2024-01-05',
      totalHours: 32,
      targetHours: 40,
      project: 'Project Alpha',
      status: 'rejected',
      submittedDate: '2024-01-05 14:10',
      notes: 'Missing time entries for Wednesday',
    },
    {
      key: '5',
      id: 'TS-005',
      userId: 'USR-005',
      userName: 'Michael Brown',
      userEmail: 'michael@company.com',
      weekStart: '2024-01-01',
      weekEnd: '2024-01-05',
      totalHours: 45,
      targetHours: 40,
      project: 'Project Delta',
      status: 'draft',
      submittedDate: '2024-01-04 11:30',
    },
  ];

  const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta', 'Project Epsilon'];

  const statusColors = {
    pending: 'gold',
    approved: 'green',
    rejected: 'red',
    draft: 'blue',
  };

  const statusIcons = {
    pending: <ClockCircleOutlined />,
    approved: <CheckCircleOutlined />,
    rejected: <CloseCircleOutlined />,
    draft: <EditOutlined />,
  };

  const columns: ColumnsType<TimesheetType> = [
    {
      title: 'Timesheet ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <div className={styles.userCell}>
          <div className={styles.userAvatar}>
            {record.userName.charAt(0)}
          </div>
          <div>
            <div className={styles.userName}>{text}</div>
            <div className={styles.userEmail}>{record.userEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Week',
      dataIndex: 'weekStart',
      key: 'week',
      width: 200,
      render: (_, record) => (
        <div className={styles.weekCell}>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {dayjs(record.weekStart).format('MMM DD')} - {dayjs(record.weekEnd).format('MMM DD, YYYY')}
        </div>
      ),
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      width: 150,
    },
    {
      title: 'Hours',
      dataIndex: 'totalHours',
      key: 'totalHours',
      width: 180,
      render: (hours, record) => (
        <div className={styles.hoursCell}>
          <div className={styles.hoursInfo}>
            <span className={styles.hoursValue}>{hours}</span>
            <span className={styles.hoursTarget}>/ {record.targetHours} hrs</span>
          </div>
          <Progress 
            percent={Math.min((hours / record.targetHours) * 100, 100)} 
            size="small" 
            strokeColor={hours >= record.targetHours ? '#52c41a' : '#1890ff'}
            showInfo={false}
          />
          {hours > record.targetHours && (
            <Tag color="orange" style={{ marginTop: 4, fontSize: 10 }}>
              +{hours - record.targetHours} overtime
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag 
          icon={statusIcons[status as keyof typeof statusIcons]} 
          color={statusColors[status as keyof typeof statusColors]}
          style={{ textTransform: 'capitalize' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      width: 180,
      render: (date: string) => dayjs(date).format('MMM DD, YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckCircleOutlined />} 
                  style={{ color: '#52c41a' }}
                  onClick={() => handleApprove(record.id)}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />} 
                  style={{ color: '#ff4d4f' }}
                  onClick={() => handleReject(record.id)}
                />
              </Tooltip>
            </>
          )}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit',
                  icon: <EditOutlined />,
                  disabled: record.status === 'approved',
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const filteredTimesheets = dummyTimesheets.filter(timesheet => {
    const matchesSearch = 
      timesheet.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      timesheet.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      timesheet.project.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || timesheet.status === statusFilter;
    const matchesProject = projectFilter === 'all' || timesheet.project === projectFilter;
    
    let matchesDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      const timesheetDate = dayjs(timesheet.weekStart);
      matchesDate = timesheetDate.isBetween(startDate, endDate, null, '[]');
    }
    
    return matchesSearch && matchesStatus && matchesProject && matchesDate;
  });

  const stats = {
    total: filteredTimesheets.length,
    pending: filteredTimesheets.filter(t => t.status === 'pending').length,
    approved: filteredTimesheets.filter(t => t.status === 'approved').length,
    rejected: filteredTimesheets.filter(t => t.status === 'rejected').length,
  };

  const handleView = (timesheet: TimesheetType) => {
    setSelectedTimesheet(timesheet);
    setViewModalOpen(true);
  };

  const handleApprove = (timesheetId: string) => {
    Modal.confirm({
      title: 'Approve Timesheet',
      content: 'Are you sure you want to approve this timesheet?',
      okText: 'Approve',
      okType: 'primary',
      onOk: () => {
        message.success(`Timesheet ${timesheetId} approved successfully`);
      },
    });
  };

  const handleReject = (timesheetId: string) => {
    Modal.confirm({
      title: 'Reject Timesheet',
      content: 'Are you sure you want to reject this timesheet?',
      okText: 'Reject',
      okType: 'danger',
      onOk: () => {
        message.success(`Timesheet ${timesheetId} rejected`);
      },
    });
  };

  const handleBulkApprove = () => {
    if (selectedRows.length === 0) {
      message.warning('Please select timesheets to approve');
      return;
    }
    
    Modal.confirm({
      title: `Approve ${selectedRows.length} Timesheets`,
      content: 'Are you sure you want to approve all selected timesheets?',
      okText: 'Approve All',
      okType: 'primary',
      onOk: () => {
        message.success(`${selectedRows.length} timesheets approved successfully`);
        setSelectedRows([]);
      },
    });
  };

  const handleExport = () => {
    message.success('Timesheets exported successfully');
  };

  return (
    <div className={styles.timesheetManagement}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Timesheet Management</h1>
          <p className={styles.subtitle}>Review, approve, and manage all timesheets</p>
        </div>
        <div className={styles.headerRight}>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Export
            </Button>
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={handleBulkApprove}
              disabled={selectedRows.length === 0}
            >
              Approve Selected ({selectedRows.length})
            </Button>
          </Space>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: '#1890ff15' }}>
                <FileTextOutlined style={{ color: '#1890ff' }} />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.total}</div>
                <div className={styles.statLabel}>Total Timesheets</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: '#faad1415' }}>
                <ClockCircleOutlined style={{ color: '#faad14' }} />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.pending}</div>
                <div className={styles.statLabel}>Pending Review</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: '#52c41a15' }}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.approved}</div>
                <div className={styles.statLabel}>Approved</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: '#ff4d4f15' }}>
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.rejected}</div>
                <div className={styles.statLabel}>Rejected</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search timesheets..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              <Option value="all">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Project"
              value={projectFilter}
              onChange={setProjectFilter}
              allowClear
            >
              <Option value="all">All Projects</Option>
              {projects.map(project => (
                <Option key={project} value={project}>{project}</Option>
              ))}
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
          <Col xs={24} sm={12} md={2}>
            <Space style={{ float: 'right' }}>
              <Button onClick={() => {
                setSearchText('');
                setStatusFilter('all');
                setProjectFilter('all');
                setDateRange(null);
              }}>
                Reset
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Timesheets Table */}
      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={filteredTimesheets}
          rowSelection={{
            selectedRowKeys: selectedRows.map(row => row.key),
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} timesheets`,
          }}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* View Timesheet Modal */}
      <Modal
        title="Timesheet Details"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>,
          selectedTimesheet?.status === 'pending' && (
            <Button key="approve" type="primary" onClick={() => handleApprove(selectedTimesheet?.id || '')}>
              Approve
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedTimesheet && (
          <div className={styles.timesheetDetail}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Timesheet ID:</label>
                  <span>{selectedTimesheet.id}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Status:</label>
                  <Tag 
                    icon={statusIcons[selectedTimesheet.status]} 
                    color={statusColors[selectedTimesheet.status]}
                  >
                    {selectedTimesheet.status.toUpperCase()}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>User:</label>
                  <span>{selectedTimesheet.userName}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Project:</label>
                  <span>{selectedTimesheet.project}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Week:</label>
                  <span>
                    {dayjs(selectedTimesheet.weekStart).format('MMM DD')} - {dayjs(selectedTimesheet.weekEnd).format('MMM DD, YYYY')}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Hours:</label>
                  <span>
                    <strong>{selectedTimesheet.totalHours}</strong> / {selectedTimesheet.targetHours} hours
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Submitted:</label>
                  <span>{dayjs(selectedTimesheet.submittedDate).format('MMM DD, YYYY HH:mm')}</span>
                </div>
              </Col>
              {selectedTimesheet.approvedBy && (
                <Col span={12}>
                  <div className={styles.detailItem}>
                    <label>Approved By:</label>
                    <span>{selectedTimesheet.approvedBy}</span>
                  </div>
                </Col>
              )}
              {selectedTimesheet.approvedDate && (
                <Col span={12}>
                  <div className={styles.detailItem}>
                    <label>Approved Date:</label>
                    <span>{dayjs(selectedTimesheet.approvedDate).format('MMM DD, YYYY HH:mm')}</span>
                  </div>
                </Col>
              )}
              {selectedTimesheet.notes && (
                <Col span={24}>
                  <div className={styles.detailItem}>
                    <label>Notes:</label>
                    <div className={styles.notes}>{selectedTimesheet.notes}</div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TimesheetManagementContent;