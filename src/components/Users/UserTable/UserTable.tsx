'use client';

import React from 'react';
import { Table, Tag, Avatar, Button, Space, Dropdown, Tooltip, Progress } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  MoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { UserType } from '@/types';
import styles from './UserTable.module.css';

interface UserTableProps {
  data: UserType[];
  loading?: boolean;
  onEdit?: (user: UserType) => void;
  onDelete?: (userId: string) => void;
  onView?: (userId: string) => void;
  onSelectRows?: (selectedRowKeys: React.Key[], selectedRows: UserType[]) => void;
  rowSelection?: TableProps<UserType>['rowSelection'];
  pagination?: TableProps<UserType>['pagination'];
  scroll?: TableProps<UserType>['scroll'];
}

const UserTable: React.FC<UserTableProps> = ({
  data,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onSelectRows,
  rowSelection,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `Total ${total} users`,
  },
  scroll = { x: 1200 },
}) => {
  const roleColors = {
    admin: 'red',
    manager: 'blue',
    user: 'green',
    supervisor: 'purple',
    auditor: 'orange',
  };

  const statusColors = {
    active: 'success',
    inactive: 'default',
    pending: 'warning',
    suspended: 'error',
  };

  const statusIcons = {
    active: <CheckCircleOutlined />,
    inactive: <CloseCircleOutlined />,
    pending: <ClockCircleOutlined />,
    suspended: <CloseCircleOutlined />,
  };

  const columns: ColumnsType<UserType> = [
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      render: (text, record) => (
        <div className={styles.userCell}>
          <Avatar 
            size="small" 
            className={styles.avatar}
            src={record.avatar}
            icon={!record.avatar && <span>{record.name.charAt(0)}</span>}
          />
          <div className={styles.userInfo}>
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
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Manager', value: 'manager' },
        { text: 'User', value: 'user' },
        { text: 'Supervisor', value: 'supervisor' },
        { text: 'Auditor', value: 'auditor' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role: string) => (
        <Tag 
          color={roleColors[role as keyof typeof roleColors]}
          className={styles.roleTag}
        >
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      filters: [
        { text: 'Engineering', value: 'engineering' },
        { text: 'Marketing', value: 'marketing' },
        { text: 'Sales', value: 'sales' },
        { text: 'HR', value: 'hr' },
        { text: 'IT', value: 'it' },
      ],
      onFilter: (value, record) => record.department === value,
      render: (dept: string) => (
        <div className={styles.departmentCell}>
          <span className={styles.departmentName}>
            {dept.charAt(0).toUpperCase() + dept.slice(1)}
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Pending', value: 'pending' },
        { text: 'Suspended', value: 'suspended' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => (
        <Tag 
          icon={statusIcons[status as keyof typeof statusIcons]}
          color={statusColors[status as keyof typeof statusColors]}
          className={styles.statusTag}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Hours This Week',
      dataIndex: 'hoursThisWeek',
      key: 'hoursThisWeek',
      width: 180,
      sorter: (a, b) => a.hoursThisWeek - b.hoursThisWeek,
      render: (hours: number) => (
        <div className={styles.hoursCell}>
          <div className={styles.hoursInfo}>
            <span className={styles.hoursValue}>{hours}</span>
            <span className={styles.hoursTarget}>/ 40 hrs</span>
          </div>
          <Progress 
            percent={Math.min((hours / 40) * 100, 100)} 
            size="small" 
            strokeColor={hours >= 40 ? '#52c41a' : '#1890ff'}
            showInfo={false}
            className={styles.hoursProgress}
          />
          {hours > 40 && (
            <Tag color="orange" className={styles.overtimeTag}>
              +{hours - 40} overtime
            </Tag>
          )}
          {hours < 32 && (
            <Tag color="red" className={styles.shortageTag}>
              -{40 - hours} shortage
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 180,
      sorter: (a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime(),
      render: (date: string) => (
        <div className={styles.dateCell}>
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              className={styles.actionButton}
              onClick={() => onView?.(record.id)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              className={styles.actionButton}
              onClick={() => onEdit?.(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'send-email',
                  label: 'Send Email',
                },
                {
                  key: 'reset-password',
                  label: 'Reset Password',
                },
                {
                  key: 'login-as',
                  label: 'Login as User',
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  label: 'Delete User',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => onDelete?.(record.id),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              className={styles.actionButton}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const defaultRowSelection: TableProps<UserType>['rowSelection'] = {
    selectedRowKeys: [],
    onChange: onSelectRows,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div className={styles.userTableContainer}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection || defaultRowSelection}
        pagination={pagination}
        scroll={scroll}
        className={styles.userTable}
        onChange={(pagination, filters, sorter) => {
          console.log('Table changed:', { pagination, filters, sorter });
        }}
      />
    </div>
  );
};

export default UserTable;