'use client';

import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Input, 
  Select, 
  Space, 
  Modal, 
  DatePicker,
  Badge,
  Dropdown,
  message,
  Tooltip,
  Tabs,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import TimesheetTable from '../TimesheetTable/TimesheetTable';
import TimesheetApproval from '../TimesheetApproval/TimesheetApproval';
import TimesheetDetail from '../TimesheetDetail/TimesheetDetail';
import { Timesheet, TimeEntry } from '@/types';
import styles from './TimesheetManagementContent.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const TimesheetManagementContent: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<Timesheet[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Enhanced dummy data with TimeEntry[]
  const dummyTimesheets: Timesheet[] = [
    {
      id: 'TS-001',
      userId: 'USR-001',
      userName: 'John Doe',
      userEmail: 'john@company.com',
      weekStart: new Date('2024-01-08'),
      weekEnd: new Date('2024-01-12'),
      totalHours: 42,
      targetHours: 40,
      project: 'Project Alpha',
      department: 'Engineering',
      status: 'approved',
      submittedDate: '2024-01-12T16:30:00',
      approvedBy: 'Admin User',
      approvedDate: '2024-01-13T10:15:00',
      entries: [
        {
          id: 'TE-001',
          userId: 'USR-001',
          date: new Date('2024-01-08'),
          hours: 8,
          type: 'work',
          project: 'Project Alpha',
          description: 'Developed new feature',
          status: 'approved',
        },
        {
          id: 'TE-002',
          userId: 'USR-001',
          date: new Date('2024-01-09'),
          hours: 8,
          type: 'work',
          project: 'Project Alpha',
          description: 'Code review and testing',
          status: 'approved',
        },
        {
          id: 'TE-003',
          userId: 'USR-001',
          date: new Date('2024-01-10'),
          hours: 8,
          type: 'meeting',
          project: 'Project Alpha',
          description: 'Team planning meeting',
          status: 'approved',
        },
        {
          id: 'TE-004',
          userId: 'USR-001',
          date: new Date('2024-01-11'),
          hours: 9,
          type: 'work',
          project: 'Project Alpha',
          description: 'Bug fixes and deployment',
          status: 'approved',
        },
        {
          id: 'TE-005',
          userId: 'USR-001',
          date: new Date('2024-01-12'),
          hours: 9,
          type: 'work',
          project: 'Project Alpha',
          description: 'Documentation and cleanup',
          status: 'approved',
        },
      ],
    },
    {
      id: 'TS-002',
      userId: 'USR-002',
      userName: 'Jane Smith',
      userEmail: 'jane@company.com',
      weekStart: new Date('2024-01-08'),
      weekEnd: new Date('2024-01-12'),
      totalHours: 38,
      targetHours: 40,
      project: 'Project Beta',
      department: 'Marketing',
      status: 'submitted',
      submittedDate: '2024-01-12T17:45:00',
      entries: [
        {
          id: 'TE-006',
          userId: 'USR-002',
          date: new Date('2024-01-08'),
          hours: 8,
          type: 'work',
          project: 'Project Beta',
          description: 'Marketing campaign planning',
          status: 'approved',
        },
        {
          id: 'TE-007',
          userId: 'USR-002',
          date: new Date('2024-01-09'),
          hours: 8,
          type: 'work',
          project: 'Project Beta',
          description: 'Content creation',
          status: 'approved',
        },
        {
          id: 'TE-008',
          userId: 'USR-002',
          date: new Date('2024-01-10'),
          hours: 8,
          type: 'leave',
          description: 'Sick leave',
          status: 'approved',
        },
        {
          id: 'TE-009',
          userId: 'USR-002',
          date: new Date('2024-01-11'),
          hours: 7,
          type: 'work',
          project: 'Project Beta',
          description: 'Social media management',
          status: 'approved',
        },
        {
          id: 'TE-010',
          userId: 'USR-002',
          date: new Date('2024-01-12'),
          hours: 7,
          type: 'meeting',
          project: 'Project Beta',
          description: 'Client presentation',
          status: 'approved',
        },
      ],
    },
    // Add more dummy timesheets as needed...
  ];

  const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta', 'Project Epsilon'];

  // Filter timesheets based on active tab
  const filteredTimesheets = dummyTimesheets.filter(timesheet => {
    const matchesSearch = 
      timesheet.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
      timesheet.userEmail?.toLowerCase().includes(searchText.toLowerCase()) ||
      timesheet.project?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || timesheet.status === statusFilter;
    const matchesProject = projectFilter === 'all' || timesheet.project === projectFilter;
    
    let matchesDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      const timesheetDate = dayjs(timesheet.weekStart);
      matchesDate = timesheetDate.isBetween(startDate, endDate, null, '[]');
    }
    
    // Filter by tab
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && timesheet.status === 'submitted') ||
                      (activeTab === 'approved' && timesheet.status === 'approved') ||
                      (activeTab === 'rejected' && timesheet.status === 'rejected') ||
                      (activeTab === 'draft' && timesheet.status === 'draft');
    
    return matchesSearch && matchesStatus && matchesProject && matchesDate && matchesTab;
  });

  // Get pending timesheets for the approval component
  const pendingTimesheets = dummyTimesheets.filter(t => t.status === 'submitted');

  const stats = {
    total: dummyTimesheets.length,
    pending: dummyTimesheets.filter(t => t.status === 'submitted').length,
    approved: dummyTimesheets.filter(t => t.status === 'approved').length,
    rejected: dummyTimesheets.filter(t => t.status === 'rejected').length,
    draft: dummyTimesheets.filter(t => t.status === 'draft').length,
  };

  // Handler functions
  const handleView = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setViewModalOpen(true);
  };

  const handleApprove = (timesheetId: string, notes?: string) => {
    Modal.confirm({
      title: 'Approve Timesheet',
      content: notes ? `Approve with notes: ${notes}` : 'Are you sure you want to approve this timesheet?',
      okText: 'Approve',
      okType: 'primary',
      onOk: () => {
        message.success(`Timesheet ${timesheetId} approved successfully`);
        // In real app, update the timesheet status here
      },
    });
  };

  const handleReject = (timesheetId: string, notes?: string) => {
    Modal.confirm({
      title: 'Reject Timesheet',
      content: notes ? `Reject with reason: ${notes}` : 'Are you sure you want to reject this timesheet?',
      okText: 'Reject',
      okType: 'danger',
      onOk: () => {
        message.success(`Timesheet ${timesheetId} rejected`);
        // In real app, update the timesheet status here
      },
    });
  };

  const handleEdit = (timesheet: Timesheet) => {
    message.info(`Edit timesheet ${timesheet.id}`);
    // In real app, navigate to edit page or open edit modal
  };

  const handleDelete = (timesheetId: string) => {
    Modal.confirm({
      title: 'Delete Timesheet',
      content: 'Are you sure you want to delete this timesheet? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        message.success(`Timesheet ${timesheetId} deleted successfully`);
        // In real app, delete the timesheet here
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

  const handleSelectRows = (selectedRowKeys: React.Key[], selectedRows: Timesheet[]) => {
    setSelectedRows(selectedRows);
  };

  const handleDownload = (timesheet: Timesheet) => {
    message.success(`Downloading timesheet ${timesheet.id}`);
    // In real app, trigger PDF download
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
        <Col xs={24} sm={12} md={4.8}>
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
        <Col xs={24} sm={12} md={4.8}>
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
        <Col xs={24} sm={12} md={4.8}>
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
        <Col xs={24} sm={12} md={4.8}>
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
        <Col xs={24} sm={12} md={4.8}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: '#722ed115' }}>
                <EditOutlined style={{ color: '#722ed1' }} />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.draft}</div>
                <div className={styles.statLabel}>Draft</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs for different views */}
      <Card className={styles.tabsCard}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                All Timesheets
              </span>
            } 
            key="all"
          >
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
                    <Option value="draft">Draft</Option>
                    <Option value="submitted">Pending</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="rejected">Rejected</Option>
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

            {/* Timesheet Table */}
            <div className={styles.tableSection}>
              <TimesheetTable
                data={filteredTimesheets}
                onApprove={handleApprove}
                onReject={handleReject}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelectRows={handleSelectRows}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} timesheets`,
                }}
              />
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ClockCircleOutlined />
                Pending Approvals
                {pendingTimesheets.length > 0 && (
                  <Badge 
                    count={pendingTimesheets.length} 
                    style={{ marginLeft: 8 }}
                  />
                )}
              </span>
            } 
            key="pending"
          >
            <TimesheetApproval
              pendingTimesheets={pendingTimesheets}
              onApprove={handleApprove}
              onReject={handleReject}
              onView={handleView}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <CheckCircleOutlined />
                Approved
              </span>
            } 
            key="approved"
          >
            <div className={styles.tableSection}>
              <TimesheetTable
                data={filteredTimesheets.filter(t => t.status === 'approved')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Timesheet Detail Modal */}
      <Modal
        title="Timesheet Details"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={1000}
        className={styles.detailModal}
      >
        {selectedTimesheet && (
          <TimesheetDetail
            timesheet={selectedTimesheet}
            onEdit={handleEdit}
            onApprove={handleApprove}
            onReject={handleReject}
            onDownload={handleDownload}
          />
        )}
      </Modal>
    </div>
  );
};

export default TimesheetManagementContent;