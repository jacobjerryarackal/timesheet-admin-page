'use client';

import React from 'react';
import { Table, Tag, Avatar, Button, Space, Dropdown, Tooltip, Progress, Badge } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Timesheet } from '@/types';
import dayjs from "@/utils/dayjs";
import styles from './TimesheetTable.module.css';

interface TimesheetTableProps {
  data: Timesheet[];
  loading?: boolean;
  onApprove?: (timesheetId: string) => void;
  onReject?: (timesheetId: string) => void;
  onView?: (timesheet: Timesheet) => void;
  onEdit?: (timesheet: Timesheet) => void;
  onDelete?: (timesheetId: string) => void;
  onSelectRows?: (selectedRowKeys: React.Key[], selectedRows: Timesheet[]) => void;
  rowSelection?: TableProps<Timesheet>['rowSelection'];
  pagination?: TableProps<Timesheet>['pagination'];
  scroll?: TableProps<Timesheet>['scroll'];
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({
  data,
  loading = false,
  onApprove,
  onReject,
  onView,
  onEdit,
  onDelete,
  onSelectRows,
  rowSelection,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `Total ${total} timesheets`,
  },
  scroll = { x: 1400 },
}) => {
  const statusColors = {
    draft: 'blue',
    submitted: 'gold',
    approved: 'green',
    rejected: 'red',
  };

  const statusIcons = {
    draft: <EditOutlined />,
    submitted: <ClockCircleOutlined />,
    approved: <CheckCircleOutlined />,
    rejected: <CloseCircleOutlined />,
  };

  const columns: ColumnsType<Timesheet> = [
    {
      title: 'Timesheet ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'user',
      width: 180,
      fixed: 'left',
      render: (userId: string, record: any) => (
        <div className={styles.userCell}>
          <Avatar 
            size="small" 
            className={styles.avatar}
            icon={<UserOutlined />}
          />
          <div className={styles.userInfo}>
            <div className={styles.userName}>{record.userName || `User ${userId}`}</div>
            <div className={styles.userEmail}>{record.userEmail || `${userId}@company.com`}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Week',
      dataIndex: 'weekStart',
      key: 'week',
      width: 200,
      render: (weekStart: Date, record) => (
        <div className={styles.weekCell}>
          <CalendarOutlined className={styles.weekIcon} />
          <div>
            <div className={styles.weekDates}>
              {dayjs(weekStart).format('MMM DD')} - {dayjs(record.weekEnd).format('MMM DD, YYYY')}
            </div>
            <div className={styles.weekNumber}>
              Week {dayjs(weekStart).week()}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime(),
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      width: 150,
      render: (project: string) => (
        <div className={styles.projectCell}>
          <FileTextOutlined className={styles.projectIcon} />
          <span className={styles.projectName}>{project || 'No Project'}</span>
        </div>
      ),
      filters: [
        { text: 'Project Alpha', value: 'Project Alpha' },
        { text: 'Project Beta', value: 'Project Beta' },
        { text: 'Project Gamma', value: 'Project Gamma' },
        { text: 'No Project', value: 'No Project' },
      ],
      onFilter: (value, record) => (record.project || 'No Project') === value,
    },
    {
      title: 'Hours',
      dataIndex: 'totalHours',
      key: 'totalHours',
      width: 200,
      render: (totalHours: number, record) => (
        <div className={styles.hoursCell}>
          <div className={styles.hoursInfo}>
            <span className={styles.hoursValue}>{totalHours}</span>
            <span className={styles.hoursTarget}>/ {record.targetHours || 40} hrs</span>
          </div>
          <Progress 
            percent={Math.min((totalHours / (record.targetHours || 40)) * 100, 100)} 
            size="small" 
            strokeColor={
              totalHours >= (record.targetHours || 40) ? '#52c41a' : 
              totalHours < (record.targetHours || 40) * 0.75 ? '#ff4d4f' : '#1890ff'
            }
            showInfo={false}
            className={styles.hoursProgress}
          />
          <div className={styles.hoursStatus}>
            {totalHours > (record.targetHours || 40) && (
              <Badge 
                count={`+${totalHours - (record.targetHours || 40)}`} 
                className={styles.overtimeBadge}
                title="Overtime hours"
              />
            )}
            {totalHours < (record.targetHours || 40) && (
              <Badge 
                count={`-${(record.targetHours || 40) - totalHours}`} 
                className={styles.shortageBadge}
                title="Hours shortage"
              />
            )}
          </div>
        </div>
      ),
      sorter: (a, b) => a.totalHours - b.totalHours,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string) => (
        <Tag 
          icon={statusIcons[status as keyof typeof statusIcons]}
          color={statusColors[status as keyof typeof statusColors]}
          className={styles.statusTag}
        >
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Submitted', value: 'submitted' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      width: 180,
      render: (date: string) => (
        <div className={styles.dateCell}>
          {dayjs(date).format('MMM DD, YYYY')}
          <div className={styles.timeCell}>
            {dayjs(date).format('HH:mm')}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.submittedDate || '').getTime() - new Date(b.submittedDate || '').getTime(),
    },
    {
      title: 'Entries',
      dataIndex: 'entries',
      key: 'entries',
      width: 100,
      render: (entries: any[]) => (
        <div className={styles.entriesCell}>
          <Badge 
            count={entries?.length || 0} 
            showZero 
            className={styles.entriesBadge}
            title={`${entries?.length || 0} time entries`}
          />
        </div>
      ),
      sorter: (a, b) => (a.entries?.length || 0) - (b.entries?.length || 0),
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
          
          {record.status === 'submitted' && (
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
          )}
          
          {(record.status === 'draft' || record.status === 'rejected') && (
            <Tooltip title="Edit">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                className={styles.actionButton}
                onClick={() => onEdit?.(record)}
              />
            </Tooltip>
          )}
          
          <Dropdown
            menu={{
              items: [
                {
                  key: 'download',
                  label: 'Download PDF',
                },
                {
                  key: 'print',
                  label: 'Print Timesheet',
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  label: 'Delete',
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

  const defaultRowSelection: TableProps<Timesheet>['rowSelection'] = {
    selectedRowKeys: [],
    onChange: onSelectRows,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div className={styles.timesheetTableContainer}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection || defaultRowSelection}
        pagination={pagination}
        scroll={scroll}
        className={styles.timesheetTable}
        onChange={(pagination, filters, sorter) => {
          console.log('Timesheet table changed:', { pagination, filters, sorter });
        }}
      />
    </div>
  );
};

export default TimesheetTable;