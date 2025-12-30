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
  Tooltip,
  Calendar,
  List,
  Avatar
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
  CalendarOutlined,
  UserOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import styles from './LeaveManagementContent.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface LeaveType {
  key: string;
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  leaveType: 'vacation' | 'sick' | 'personal' | 'birthday' | 'other';
  startDate: string;
  endDate: string;
  totalDays: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  submittedDate: string;
  reason: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

const LeaveManagementContent: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs());
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveType | null>(null);

  // Dummy data
  const dummyLeaves: LeaveType[] = [
    {
      key: '1',
      id: 'LV-001',
      userId: 'USR-001',
      userName: 'John Doe',
      userEmail: 'john@company.com',
      leaveType: 'vacation',
      startDate: '2024-01-15',
      endDate: '2024-01-19',
      totalDays: 5,
      status: 'approved',
      submittedDate: '2024-01-10 14:30',
      reason: 'Family vacation',
      approvedBy: 'Admin User',
      approvedDate: '2024-01-11 10:15',
    },
    {
      key: '2',
      id: 'LV-002',
      userId: 'USR-002',
      userName: 'Jane Smith',
      userEmail: 'jane@company.com',
      leaveType: 'sick',
      startDate: '2024-01-22',
      endDate: '2024-01-23',
      totalDays: 2,
      status: 'pending',
      submittedDate: '2024-01-20 09:45',
      reason: 'Medical appointment',
    },
    {
      key: '3',
      id: 'LV-003',
      userId: 'USR-003',
      userName: 'Robert Johnson',
      userEmail: 'robert@company.com',
      leaveType: 'birthday',
      startDate: '2024-01-25',
      endDate: '2024-01-25',
      totalDays: 1,
      status: 'approved',
      submittedDate: '2024-01-18 11:20',
      reason: 'Birthday celebration',
      approvedBy: 'Admin User',
      approvedDate: '2024-01-19 09:30',
    },
    {
      key: '4',
      id: 'LV-004',
      userId: 'USR-004',
      userName: 'Sarah Williams',
      userEmail: 'sarah@company.com',
      leaveType: 'personal',
      startDate: '2024-02-01',
      endDate: '2024-02-02',
      totalDays: 2,
      status: 'rejected',
      submittedDate: '2024-01-25 16:15',
      reason: 'Personal matters',
      notes: 'Not enough notice given',
    },
    {
      key: '5',
      id: 'LV-005',
      userId: 'USR-005',
      userName: 'Michael Brown',
      userEmail: 'michael@company.com',
      leaveType: 'other',
      startDate: '2024-02-05',
      endDate: '2024-02-07',
      totalDays: 3,
      status: 'pending',
      submittedDate: '2024-01-30 13:40',
      reason: 'Wedding ceremony',
    },
  ];

  const leaveTypeColors = {
    vacation: 'blue',
    sick: 'red',
    personal: 'purple',
    birthday: 'green',
    other: 'orange',
  };

  const leaveTypeLabels = {
    vacation: 'Vacation',
    sick: 'Sick Leave',
    personal: 'Personal',
    birthday: 'Birthday Time',
    other: 'Other',
  };

  const statusColors = {
    pending: 'gold',
    approved: 'green',
    rejected: 'red',
    cancelled: 'gray',
  };

  const statusIcons = {
    pending: <ClockCircleOutlined />,
    approved: <CheckCircleOutlined />,
    rejected: <CloseCircleOutlined />,
    cancelled: <CloseCircleOutlined />,
  };

  const columns: ColumnsType<LeaveType> = [
    {
      title: 'Leave ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <div className={styles.userCell}>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div className={styles.userName}>{text}</div>
            <div className={styles.userEmail}>{record.userEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      width: 120,
      render: (type: string) => (
        <Tag color={leaveTypeColors[type as keyof typeof leaveTypeColors]}>
          {leaveTypeLabels[type as keyof typeof leaveTypeLabels]}
        </Tag>
      ),
    },
    {
      title: 'Date Range',
      dataIndex: 'startDate',
      key: 'dateRange',
      width: 200,
      render: (_, record) => (
        <div className={styles.dateCell}>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {dayjs(record.startDate).format('MMM DD')} - {dayjs(record.endDate).format('MMM DD, YYYY')}
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'totalDays',
      key: 'totalDays',
      width: 100,
      render: (days) => (
        <div className={styles.durationCell}>
          <span className={styles.durationValue}>{days}</span>
          <span className={styles.durationLabel}>day{days > 1 ? 's' : ''}</span>
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
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
      ellipsis: true,
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
        </Space>
      ),
    },
  ];

  const filteredLeaves = dummyLeaves.filter(leave => {
    const matchesSearch = 
      leave.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.leaveType === typeFilter;
    
    let matchesDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      const leaveStart = dayjs(leave.startDate);
      const leaveEnd = dayjs(leave.endDate);
      matchesDate = leaveStart.isBetween(startDate, endDate, null, '[]') ||
                   leaveEnd.isBetween(startDate, endDate, null, '[]') ||
                   (leaveStart.isBefore(startDate) && leaveEnd.isAfter(endDate));
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const stats = {
    total: filteredLeaves.length,
    pending: filteredLeaves.filter(l => l.status === 'pending').length,
    approved: filteredLeaves.filter(l => l.status === 'approved').length,
    rejected: filteredLeaves.filter(l => l.status === 'rejected').length,
  };

  // Calendar events
  const getCalendarEvents = (date: Dayjs) => {
    const events = dummyLeaves
      .filter(leave => {
        const startDate = dayjs(leave.startDate);
        const endDate = dayjs(leave.endDate);
        return date.isBetween(startDate, endDate, 'day', '[]');
      })
      .map(leave => ({
        id: leave.id,
        userName: leave.userName,
        leaveType: leave.leaveType,
        status: leave.status,
      }));

    return events;
  };

  const dateCellRender = (date: Dayjs) => {
    const events = getCalendarEvents(date);
    
    if (events.length === 0) {
      return null;
    }

    return (
      <div className={styles.calendarEvents}>
        {events.map((event, index) => (
          <div 
            key={`${event.id}-${index}`}
            className={`${styles.calendarEvent} ${styles[event.status]}`}
            title={`${event.userName} - ${leaveTypeLabels[event.leaveType as keyof typeof leaveTypeLabels]}`}
          >
            <div className={styles.eventDot} />
          </div>
        ))}
      </div>
    );
  };

  const handleView = (leave: LeaveType) => {
    setSelectedLeave(leave);
    setViewModalOpen(true);
  };

  const handleApprove = (leaveId: string) => {
    Modal.confirm({
      title: 'Approve Leave Request',
      content: 'Are you sure you want to approve this leave request?',
      okText: 'Approve',
      okType: 'primary',
      onOk: () => {
        message.success(`Leave request ${leaveId} approved successfully`);
      },
    });
  };

  const handleReject = (leaveId: string) => {
    Modal.confirm({
      title: 'Reject Leave Request',
      content: 'Are you sure you want to reject this leave request?',
      okText: 'Reject',
      okType: 'danger',
      onOk: () => {
        message.success(`Leave request ${leaveId} rejected`);
      },
    });
  };

  const handleAddLeave = () => {
    message.info('Add new leave request');
  };

  return (
    <div className={styles.leaveManagement}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Leave Management</h1>
          <p className={styles.subtitle}>Manage vacation, sick leave, and time-off requests</p>
        </div>
        <div className={styles.headerRight}>
          <Space>
            <Button icon={<DownloadOutlined />}>
              Export
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddLeave}
            >
              Add Leave Request
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
                <CalendarOutlined style={{ color: '#1890ff' }} />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.total}</div>
                <div className={styles.statLabel}>Total Requests</div>
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
                <div className={styles.statLabel}>Pending</div>
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

      <Row gutter={[16, 16]}>
        {/* Calendar View */}
        <Col xs={24} lg={12}>
          <Card 
            title="Leave Calendar"
            className={styles.calendarCard}
            extra={
              <Button type="text" icon={<HistoryOutlined />}>
                View History
              </Button>
            }
          >
            <Calendar
              value={calendarDate}
              onChange={setCalendarDate}
              dateCellRender={dateCellRender}
              className={styles.calendar}
            />
            <div className={styles.calendarLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.pending}`} />
                <span>Pending</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.approved}`} />
                <span>Approved</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.rejected}`} />
                <span>Rejected</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Filters */}
        <Col xs={24} lg={12}>
          <Card className={styles.filterCard}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24}>
                <Input
                  placeholder="Search leave requests..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={12} sm={8}>
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
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Col>
              <Col xs={12} sm={8}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Leave Type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  allowClear
                >
                  <Option value="all">All Types</Option>
                  <Option value="vacation">Vacation</Option>
                  <Option value="sick">Sick Leave</Option>
                  <Option value="personal">Personal</Option>
                  <Option value="birthday">Birthday</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <RangePicker 
                  style={{ width: '100%' }}
                  placeholder={['Start Date', 'End Date']}
                  value={dateRange}
                  onChange={setDateRange}
                />
              </Col>
              <Col xs={24}>
                <Space style={{ float: 'right' }}>
                  <Button onClick={() => {
                    setSearchText('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                    setDateRange(null);
                  }}>
                    Reset Filters
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Upcoming Leaves */}
          <Card title="Upcoming Approved Leaves" className={styles.upcomingCard}>
            <List
              dataSource={dummyLeaves
                .filter(leave => leave.status === 'approved')
                .slice(0, 5)
              }
              renderItem={(leave) => (
                <List.Item className={styles.upcomingItem}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={leave.userName}
                    description={`${leave.leaveType} • ${leave.totalDays} day${leave.totalDays > 1 ? 's' : ''}`}
                  />
                  <div className={styles.upcomingDate}>
                    {dayjs(leave.startDate).format('MMM DD')}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Leave Requests Table */}
      <Card className={styles.tableCard} title="All Leave Requests">
        <Table
          columns={columns}
          dataSource={filteredLeaves}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} requests`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* View Leave Modal */}
      <Modal
        title="Leave Request Details"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>,
          selectedLeave?.status === 'pending' && (
            <>
              <Button 
                key="reject" 
                danger
                onClick={() => handleReject(selectedLeave?.id || '')}
              >
                Reject
              </Button>
              <Button 
                key="approve" 
                type="primary"
                onClick={() => handleApprove(selectedLeave?.id || '')}
              >
                Approve
              </Button>
            </>
          ),
        ]}
        width={600}
      >
        {selectedLeave && (
          <div className={styles.leaveDetail}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Request ID:</label>
                  <span>{selectedLeave.id}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Status:</label>
                  <Tag 
                    icon={statusIcons[selectedLeave.status]} 
                    color={statusColors[selectedLeave.status]}
                  >
                    {selectedLeave.status.toUpperCase()}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>User:</label>
                  <span>{selectedLeave.userName}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Leave Type:</label>
                  <Tag color={leaveTypeColors[selectedLeave.leaveType]}>
                    {leaveTypeLabels[selectedLeave.leaveType as keyof typeof leaveTypeLabels]}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Start Date:</label>
                  <span>{dayjs(selectedLeave.startDate).format('MMM DD, YYYY')}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>End Date:</label>
                  <span>{dayjs(selectedLeave.endDate).format('MMM DD, YYYY')}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Duration:</label>
                  <span>
                    <strong>{selectedLeave.totalDays}</strong> day{selectedLeave.totalDays > 1 ? 's' : ''}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Submitted:</label>
                  <span>{dayjs(selectedLeave.submittedDate).format('MMM DD, YYYY HH:mm')}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.detailItem}>
                  <label>Reason:</label>
                  <div className={styles.reason}>{selectedLeave.reason}</div>
                </div>
              </Col>
              {selectedLeave.approvedBy && (
                <Col span={12}>
                  <div className={styles.detailItem}>
                    <label>Approved By:</label>
                    <span>{selectedLeave.approvedBy}</span>
                  </div>
                </Col>
              )}
              {selectedLeave.approvedDate && (
                <Col span={12}>
                  <div className={styles.detailItem}>
                    <label>Approved Date:</label>
                    <span>{dayjs(selectedLeave.approvedDate).format('MMM DD, YYYY HH:mm')}</span>
                  </div>
                </Col>
              )}
              {selectedLeave.notes && (
                <Col span={24}>
                  <div className={styles.detailItem}>
                    <label>Admin Notes:</label>
                    <div className={styles.notes}>{selectedLeave.notes}</div>
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

export default LeaveManagementContent;