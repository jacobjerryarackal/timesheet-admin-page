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
  Form,
  Dropdown,
  message 
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  UserAddOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import UserForm from './UserForm';
import styles from './UserManagementContent.module.css';

const { Option } = Select;

interface UserType {
  key: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  hoursThisWeek: number;
  avatar?: string;
}

const UserManagementContent: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [form] = Form.useForm();

  // Dummy data
  const dummyUsers: UserType[] = [
    {
      key: '1',
      id: 'USR-001',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'admin',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-15 14:30',
      hoursThisWeek: 42,
    },
    {
      key: '2',
      id: 'USR-002',
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'manager',
      department: 'HR',
      status: 'active',
      lastLogin: '2024-01-15 09:15',
      hoursThisWeek: 38,
    },
    {
      key: '3',
      id: 'USR-003',
      name: 'Robert Johnson',
      email: 'robert@company.com',
      role: 'user',
      department: 'Engineering',
      status: 'active',
      lastLogin: '2024-01-14 16:45',
      hoursThisWeek: 40,
    },
    {
      key: '4',
      id: 'USR-004',
      name: 'Sarah Williams',
      email: 'sarah@company.com',
      role: 'user',
      department: 'Marketing',
      status: 'inactive',
      lastLogin: '2024-01-10 11:20',
      hoursThisWeek: 0,
    },
    {
      key: '5',
      id: 'USR-005',
      name: 'Michael Brown',
      email: 'michael@company.com',
      role: 'manager',
      department: 'Sales',
      status: 'pending',
      lastLogin: '2024-01-13 13:10',
      hoursThisWeek: 35,
    },
  ];

  const columns: ColumnsType<UserType> = [
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className={styles.userCell}>
          <div className={styles.avatar}>
            {record.name.charAt(0)}
          </div>
          <div>
            <div className={styles.userName}>{text}</div>
            <div className={styles.userEmail}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => {
        const colors = {
          admin: 'red',
          manager: 'blue',
          user: 'green',
        };
        return (
          <Tag color={colors[role as keyof typeof colors]} style={{ textTransform: 'capitalize' }}>
            {role}
          </Tag>
        );
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colors = {
          active: 'success',
          inactive: 'default',
          pending: 'warning',
        };
        return (
          <Tag color={colors[status as keyof typeof colors]} style={{ textTransform: 'capitalize' }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Hours This Week',
      dataIndex: 'hoursThisWeek',
      key: 'hoursThisWeek',
      width: 140,
      render: (hours: number) => (
        <div className={styles.hoursCell}>
          <span className={styles.hoursValue}>{hours}</span>
          <span className={styles.hoursLabel}>/40 hrs</span>
          <div className={styles.hoursProgress}>
            <div 
              className={styles.hoursProgressBar} 
              style={{ width: `${Math.min((hours / 40) * 100, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Edit User',
                icon: <EditOutlined />,
                onClick: () => handleEdit(record),
              },
              {
                key: 'view',
                label: 'View Details',
                onClick: () => handleView(record.id),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: 'Delete User',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(record.id),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const filteredUsers = dummyUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleView = (userId: string) => {
    message.info(`Viewing user ${userId}`);
    // Navigate to user detail page
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
      },
    });
  };

  const handleSubmit = (values: any) => {
    if (editingUser) {
      message.success(`User ${editingUser.name} updated successfully`);
    } else {
      message.success('New user added successfully');
    }
    setIsModalOpen(false);
    form.resetFields();
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
            <Button icon={<DownloadOutlined />}>Export</Button>
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
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
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
            </Select>
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
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="pending">Pending</Option>
            </Select>
          </Col>
          <Col xs={24} md={10}>
            <Space style={{ float: 'right' }}>
              <Button>Reset Filters</Button>
              <Button type="primary">Apply Filters</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} users`,
          }}
          scroll={{ x: 1200 }}
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
        width={600}
        destroyOnClose
      >
        <UserForm 
          form={form} 
          editingUser={editingUser} 
          onSubmit={handleSubmit} 
        />
      </Modal>
    </div>
  );
};

export default UserManagementContent;