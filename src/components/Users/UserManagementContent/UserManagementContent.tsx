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
  Form,
  Drawer,
  message 
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  DownloadOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import UserTable from '../UserTable/UserTable';  
import UserForm from '../UserForm/UserForm';    
import UserDetail from '../UserDetail/UserDetail';  // Add this import
import { UserType } from '@/types';    
import styles from './UserManagementContent.module.css';

const { Option } = Select;

const UserManagementContent: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);  // New state
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);  // New state
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [selectedRows, setSelectedRows] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Dummy data - In real app, this would come from an API
  const dummyUsers: UserType[] = [
    {
      key: '1',
      id: 'USR-001',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'admin',
      department: 'engineering',
      status: 'active',
      lastLogin: '2024-01-15T14:30:00',
      hoursThisWeek: 42,
      jobTitle: 'Senior Developer',
      phone: '+1 (555) 123-4567',
      startDate: '2023-01-15',
      manager: 'Jane Smith',
    },
    {
      key: '2',
      id: 'USR-002',
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'manager',
      department: 'marketing',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00',
      hoursThisWeek: 38,
      jobTitle: 'Marketing Director',
      phone: '+1 (555) 987-6543',
      startDate: '2022-08-20',
    },
    {
      key: '3',
      id: 'USR-003',
      name: 'Bob Johnson',
      email: 'bob@company.com',
      role: 'user',
      department: 'sales',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00',
      hoursThisWeek: 40,
      jobTitle: 'Sales Executive',
      phone: '+1 (555) 456-7890',
      startDate: '2023-03-10',
      manager: 'Jane Smith',
    },
    {
      key: '4',
      id: 'USR-004',
      name: 'Alice Brown',
      email: 'alice@company.com',
      role: 'supervisor',
      department: 'hr',
      status: 'pending',
      lastLogin: '2024-01-13T11:20:00',
      hoursThisWeek: 35,
      jobTitle: 'HR Supervisor',
      phone: '+1 (555) 321-6547',
      startDate: '2023-06-22',
    },
    {
      key: '5',
      id: 'USR-005',
      name: 'Charlie Wilson',
      email: 'charlie@company.com',
      role: 'auditor',
      department: 'finance',
      status: 'inactive',
      lastLogin: '2024-01-10T13:15:00',
      hoursThisWeek: 0,
      jobTitle: 'Financial Auditor',
      phone: '+1 (555) 789-0123',
      startDate: '2022-11-30',
      manager: 'John Doe',
    },
  ];

  const filteredUsers = dummyUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.id.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // --- HANDLER FUNCTIONS ---

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleView = (userId: string) => {
    // Find the user from dummy data
    const user = dummyUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDetailDrawerOpen(true);
    } else {
      message.error('User not found');
    }
  };

  const handleDelete = (userId: string) => {
    Modal.confirm({
      title: 'Delete User',
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        message.success(`User ${userId} deleted successfully`);
        // In real app, make API call to delete user
      },
    });
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingUser) {
        message.success(`User ${editingUser.name} updated successfully`);
      } else {
        message.success('New user added successfully');
      }
      
      setLoading(false);
      setIsModalOpen(false);
      form.resetFields();
    }, 1000);
  };

  const handleExport = () => {
    message.success('Users exported successfully');
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      message.warning('Please select users to delete');
      return;
    }
    
    Modal.confirm({
      title: `Delete ${selectedRows.length} Users`,
      content: 'Are you sure you want to delete all selected users? This action cannot be undone.',
      okText: 'Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        message.success(`${selectedRows.length} users deleted successfully`);
        setSelectedRows([]);
      },
    });
  };

  const handleSelectRows = (selectedRowKeys: React.Key[], selectedRows: UserType[]) => {
    setSelectedRows(selectedRows);
  };

  const handleCloseDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Manage all system users and their permissions</p>
        </div>
        <div className={styles.headerRight}>
          <Space>
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export
            </Button>
            {selectedRows.length > 0 && (
              <Button 
                danger
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedRows.length})
              </Button>
            )}
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={handleAddUser}
            >
              Add New User
            </Button>
          </Space>
        </div>
      </div>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search users by name, email, or ID..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              size="large"
              style={{ width: '100%' }}
              placeholder="Role"
              value={roleFilter}
              onChange={setRoleFilter}
              allowClear
            >
              <Option value="all">All Roles</Option>
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="user">User</Option>
              <Option value="supervisor">Supervisor</Option>
              <Option value="auditor">Auditor</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              size="large"
              style={{ width: '100%' }}
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="pending">Pending</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          </Col>
          <Col xs={24} md={10}>
            <Space style={{ float: 'right' }}>
              <Button 
                size="large"
                onClick={() => {
                  setSearchText('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
              >
                Reset Filters
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Users Table - USING THE NEW UserTable COMPONENT */}
      <Card className={styles.tableCard}>
        <UserTable
          data={filteredUsers}
          loading={loading}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onSelectRows={handleSelectRows}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} users`,
            position: ['bottomRight'],
          }}
        />
      </Card>

      {/* User Form Modal */}
      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <UserForm 
          form={form} 
          editingUser={editingUser} 
          onSubmit={handleSubmit} 
        />
      </Modal>

      {/* User Detail Drawer */}
      <Drawer
        title="User Details"
        placement="right"
        size="large"
        open={isDetailDrawerOpen}
        onClose={handleCloseDetailDrawer}
        width={800}
        extra={[
          <Button key="close" onClick={handleCloseDetailDrawer}>
            Close
          </Button>
        ]}
      >
        {selectedUser && (
          <UserDetail 
            userId={selectedUser.id}
            // If you want to pass the full user data, update UserDetail props
          />
        )}
      </Drawer>
    </div>
  );
};

export default UserManagementContent;