'use client';

import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
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
  Avatar,
  Drawer,
  Form
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
import LeaveTable from '../LeaveTable/LeaveTable'; // Import the new LeaveTable component
import dayjs from "@/utils/dayjs";
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
  const [selectedRows, setSelectedRows] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    {
      key: '6',
      id: 'LV-006',
      userId: 'USR-001',
      userName: 'John Doe',
      userEmail: 'john@company.com',
      leaveType: 'sick',
      startDate: '2024-02-10',
      endDate: '2024-02-11',
      totalDays: 2,
      status: 'pending',
      submittedDate: '2024-02-05 08:30',
      reason: 'Flu symptoms',
    },
    {
      key: '7',
      id: 'LV-007',
      userId: 'USR-002',
      userName: 'Jane Smith',
      userEmail: 'jane@company.com',
      leaveType: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      totalDays: 6,
      status: 'approved',
      submittedDate: '2024-01-30 10:20',
      reason: 'Holiday trip',
      approvedBy: 'Admin User',
      approvedDate: '2024-01-31 14:45',
    },
    {
      key: '8',
      id: 'LV-008',
      userId: 'USR-006',
      userName: 'Emily Davis',
      userEmail: 'emily@company.com',
      leaveType: 'personal',
      startDate: '2024-01-28',
      endDate: '2024-01-29',
      totalDays: 2,
      status: 'cancelled',
      submittedDate: '2024-01-25 11:10',
      reason: 'Family emergency',
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
    birthday: 'Birthday',
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

  const filteredLeaves = dummyLeaves.filter(leave => {
    const matchesSearch = 
      leave.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.id.toLowerCase().includes(searchText.toLowerCase());
    
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
    cancelled: filteredLeaves.filter(l => l.status === 'cancelled').length,
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

  // Handlers for LeaveTable
  const handleView = (leave: LeaveType) => {
    setSelectedLeave(leave);
    setViewModalOpen(true);
  };

  const handleEdit = (leave: LeaveType) => {
    message.info(`Editing leave ${leave.id}`);
    // In real app, open edit form/drawer
    setIsDrawerOpen(true);
  };

  const handleApprove = (leaveId: string) => {
    Modal.confirm({
      title: 'Approve Leave Request',
      content: 'Are you sure you want to approve this leave request?',
      okText: 'Approve',
      okType: 'primary',
      onOk: () => {
        message.success(`Leave request ${leaveId} approved successfully`);
        // In real app, make API call to update status
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
        // In real app, make API call to update status
      },
    });
  };

  const handleDelete = (leaveId: string) => {
    Modal.confirm({
      title: 'Delete Leave Request',
      content: 'Are you sure you want to delete this leave request? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        message.success(`Leave request ${leaveId} deleted successfully`);
        // In real app, make API call to delete leave
      },
    });
  };

  const handleSelectRows = (selectedRowKeys: React.Key[], selectedRows: LeaveType[]) => {
    setSelectedRows(selectedRows);
  };

  const handleAddLeave = () => {
    message.info('Add new leave request');
    setIsDrawerOpen(true);
  };

  const handleExport = () => {
    message.success('Leave data exported successfully');
  };

  // Bulk actions
  const handleBulkApprove = () => {
    if (selectedRows.length === 0) {
      message.warning('Please select leave requests to approve');
      return;
    }
    
    Modal.confirm({
      title: `Approve ${selectedRows.length} Leave Requests`,
      content: 'Are you sure you want to approve all selected leave requests?',
      okText: 'Approve All',
      okType: 'primary',
      onOk: () => {
        message.success(`${selectedRows.length} leave requests approved successfully`);
        setSelectedRows([]);
        // In real app, make API call to update status for all selected
      },
    });
  };

  const handleBulkReject = () => {
    if (selectedRows.length === 0) {
      message.warning('Please select leave requests to reject');
      return;
    }
    
    Modal.confirm({
      title: `Reject ${selectedRows.length} Leave Requests`,
      content: 'Are you sure you want to reject all selected leave requests?',
      okText: 'Reject All',
      okType: 'danger',
      onOk: () => {
        message.success(`${selectedRows.length} leave requests rejected`);
        setSelectedRows([]);
        // In real app, make API call to update status for all selected
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      message.warning('Please select leave requests to delete');
      return;
    }
    
    Modal.confirm({
      title: `Delete ${selectedRows.length} Leave Requests`,
      content: 'Are you sure you want to delete all selected leave requests? This action cannot be undone.',
      okText: 'Delete All',
      okType: 'danger',
      onOk: () => {
        message.success(`${selectedRows.length} leave requests deleted successfully`);
        setSelectedRows([]);
        // In real app, make API call to delete all selected
      },
    });
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
            {selectedRows.length > 0 && (
              <>
                <Button 
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleBulkApprove}
                >
                  Approve ({selectedRows.length})
                </Button>
                <Button 
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={handleBulkReject}
                >
                  Reject ({selectedRows.length})
                </Button>
                <Button 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBulkDelete}
                >
                  Delete ({selectedRows.length})
                </Button>
              </>
            )}
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
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
                <div className={styles.statValue}>{stats.rejected + stats.cancelled}</div>
                <div className={styles.statLabel}>Rejected/Cancelled</div>
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
                  placeholder="Search by user name, email, reason, or ID..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  size="large"
                />
              </Col>
              <Col xs={12} sm={8}>
                <Select
                  size="large"
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
                  size="large"
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
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={['Start Date', 'End Date']}
                  value={dateRange}
                  onChange={setDateRange}
                />
              </Col>
              <Col xs={24}>
                <Space style={{ float: 'right' }}>
                  <Button 
                    size="large"
                    onClick={() => {
                      setSearchText('');
                      setStatusFilter('all');
                      setTypeFilter('all');
                      setDateRange(null);
                    }}
                  >
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
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .slice(0, 5)
              }
              renderItem={(leave) => (
                <List.Item className={styles.upcomingItem}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={leave.userName}
                    description={`${leaveTypeLabels[leave.leaveType]} • ${leave.totalDays} day${leave.totalDays > 1 ? 's' : ''}`}
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

      {/* Leave Requests Table - USING THE NEW LeaveTable COMPONENT */}
      <Card className={styles.tableCard} title="All Leave Requests">
        <LeaveTable
          data={filteredLeaves}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onSelectRows={handleSelectRows}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} requests`,
            position: ['bottomRight'],
          }}
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
                onClick={() => {
                  handleReject(selectedLeave?.id || '');
                  setViewModalOpen(false);
                }}
              >
                Reject
              </Button>
              <Button 
                key="approve" 
                type="primary"
                onClick={() => {
                  handleApprove(selectedLeave?.id || '');
                  setViewModalOpen(false);
                }}
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
                  <span className={styles.detailValue}>{selectedLeave.id}</span>
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
                  <div className={styles.detailValue}>
                    <div>{selectedLeave.userName}</div>
                    <div className={styles.detailSubtext}>{selectedLeave.userEmail}</div>
                  </div>
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
                  <span className={styles.detailValue}>
                    {dayjs(selectedLeave.startDate).format('MMM DD, YYYY')}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>End Date:</label>
                  <span className={styles.detailValue}>
                    {dayjs(selectedLeave.endDate).format('MMM DD, YYYY')}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Duration:</label>
                  <span className={styles.detailValue}>
                    <strong>{selectedLeave.totalDays}</strong> day{selectedLeave.totalDays > 1 ? 's' : ''}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <label>Submitted:</label>
                  <span className={styles.detailValue}>
                    {dayjs(selectedLeave.submittedDate).format('MMM DD, YYYY HH:mm')}
                  </span>
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
                    <span className={styles.detailValue}>{selectedLeave.approvedBy}</span>
                  </div>
                </Col>
              )}
              {selectedLeave.approvedDate && (
                <Col span={12}>
                  <div className={styles.detailItem}>
                    <label>Approved Date:</label>
                    <span className={styles.detailValue}>
                      {dayjs(selectedLeave.approvedDate).format('MMM DD, YYYY HH:mm')}
                    </span>
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

      {/* Add/Edit Leave Drawer (Placeholder) */}
      <Drawer
        title="Add New Leave Request"
        placement="right"
        size="large"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={500}
      >
        <div style={{ padding: '20px 0' }}>
          <p>Leave form will be implemented here</p>
          <p>This would include:</p>
          <ul>
            <li>User selection</li>
            <li>Leave type selection</li>
            <li>Date range picker</li>
            <li>Reason text area</li>
            <li>Attachment upload</li>
          </ul>
        </div>
      </Drawer>
    </div>
  );
};

export default LeaveManagementContent;