'use client';

import React from 'react';
import { Table, Tag, Avatar, Button, Space, Dropdown, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { 
  EyeOutlined, 
  MoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from "@/utils/dayjs";
import styles from './LeaveTable.module.css';

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

interface LeaveTableProps {
  data: LeaveType[];
  loading?: boolean;
  onView?: (leave: LeaveType) => void;
  onEdit?: (leave: LeaveType) => void;
  onApprove?: (leaveId: string) => void;
  onReject?: (leaveId: string) => void;
  onDelete?: (leaveId: string) => void;
  onSelectRows?: (selectedRowKeys: React.Key[], selectedRows: LeaveType[]) => void;
  rowSelection?: TableProps<LeaveType>['rowSelection'];
  pagination?: TableProps<LeaveType>['pagination'];
  scroll?: TableProps<LeaveType>['scroll'];
}

const LeaveTable: React.FC<LeaveTableProps> = ({
  data,
  loading = false,
  onView,
  onEdit,
  onApprove,
  onReject,
  onDelete,
  onSelectRows,
  rowSelection,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `Total ${total} leaves`,
  },
  scroll = { x: 1300 },
}) => {
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

  const columns: ColumnsType<LeaveType> = [
    {
      title: 'Leave ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: 180,
      fixed: 'left',
      render: (text, record) => (
        <div className={styles.userCell}>
          <Avatar 
            size="small" 
            className={styles.avatar}
            icon={<UserOutlined />}
          />
          <div className={styles.userInfo}>
            <div className={styles.userName}>{text}</div>
            <div className={styles.userEmail}>{record.userEmail}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      width: 120,
      filters: [
        { text: 'Vacation', value: 'vacation' },
        { text: 'Sick Leave', value: 'sick' },
        { text: 'Personal', value: 'personal' },
        { text: 'Birthday', value: 'birthday' },
        { text: 'Other', value: 'other' },
      ],
      onFilter: (value, record) => record.leaveType === value,
      render: (type: string) => (
        <Tag 
          color={leaveTypeColors[type as keyof typeof leaveTypeColors]}
          className={styles.leaveTypeTag}
        >
          {leaveTypeLabels[type as keyof typeof leaveTypeLabels]}
        </Tag>
      ),
    },
    {
      title: 'Date Range',
      key: 'dateRange',
      width: 200,
      sorter: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      render: (_, record) => (
        <div className={styles.dateCell}>
          <CalendarOutlined className={styles.dateIcon} />
          <div>
            <div className={styles.dateRange}>
              {dayjs(record.startDate).format('MMM DD')} - {dayjs(record.endDate).format('MMM DD')}
            </div>
            <div className={styles.dateYear}>
              {dayjs(record.endDate).format('YYYY')}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'totalDays',
      key: 'totalDays',
      width: 100,
      sorter: (a, b) => a.totalDays - b.totalDays,
      render: (days: number) => (
        <div className={styles.durationCell}>
          <div className={styles.durationInfo}>
            <span className={styles.durationValue}>{days}</span>
            <span className={styles.durationLabel}>day{days > 1 ? 's' : ''}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Cancelled', value: 'cancelled' },
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
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
      ellipsis: true,
      render: (reason: string) => (
        <div className={styles.reasonCell}>
          {reason}
        </div>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      width: 180,
      sorter: (a, b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime(),
      render: (date: string) => (
        <div className={styles.dateCell}>
          {dayjs(date).format('MMM DD, YYYY')}
          <div className={styles.timeText}>
            {dayjs(date).format('HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              className={styles.actionButton}
              onClick={() => onView?.(record)}
            />
          </Tooltip>
          
          {record.status === 'pending' ? (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckCircleOutlined />} 
                  className={`${styles.actionButton} ${styles.approveButton}`}
                  onClick={() => onApprove?.(record.id)}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />} 
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                  onClick={() => onReject?.(record.id)}
                />
              </Tooltip>
            </>
          ) : (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'edit',
                    label: 'Edit Leave',
                    icon: <EditOutlined />,
                    onClick: () => onEdit?.(record),
                  },
                  {
                    key: 'reopen',
                    label: 'Reopen Request',
                  },
                  {
                    key: 'export',
                    label: 'Export Details',
                    icon: <DownloadOutlined />,
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'delete',
                    label: 'Delete Leave',
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
          )}
        </Space>
      ),
    },
  ];

  const defaultRowSelection: TableProps<LeaveType>['rowSelection'] = {
    selectedRowKeys: [],
    onChange: onSelectRows,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div className={styles.leaveTableContainer}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection || defaultRowSelection}
        pagination={pagination}
        scroll={scroll}
        className={styles.leaveTable}
        onChange={(pagination, filters, sorter) => {
          console.log('Table changed:', { pagination, filters, sorter });
        }}
      />
    </div>
  );
};

export default LeaveTable;