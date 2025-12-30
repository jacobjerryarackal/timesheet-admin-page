'use client';

import React from 'react';
import { 
  Card, 
  Descriptions, 
  Tag, 
  Avatar, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Button, 
  Space,
  Table,
  Timeline,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FileTextOutlined,
  TeamOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { Timesheet, TimeEntry } from '@/types';
import dayjs from "@/utils/dayjs";
import type { ColumnsType } from 'antd/es/table';
import styles from './TimesheetDetail.module.css';

interface TimesheetDetailProps {
  timesheet: Timesheet;
  onEdit?: (timesheet: Timesheet) => void;
  onApprove?: (timesheetId: string) => void;
  onReject?: (timesheetId: string) => void;
  onDownload?: (timesheet: Timesheet) => void;
}

const TimesheetDetail: React.FC<TimesheetDetailProps> = ({
  timesheet,
  onEdit,
  onApprove,
  onReject,
  onDownload,
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

  const entryTypeColors = {
    work: 'blue',
    leave: 'green',
    birthday: 'purple',
    meeting: 'orange',
    other: 'gray',
  };

  const entryTypeLabels = {
    work: 'Work',
    leave: 'Leave',
    birthday: 'Birthday Time',
    meeting: 'Meeting',
    other: 'Other',
  };

  const timeEntryColumns: ColumnsType<TimeEntry> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: Date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Tag color={entryTypeColors[type as keyof typeof entryTypeColors]}>
          {entryTypeLabels[type as keyof typeof entryTypeLabels]}
        </Tag>
      ),
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      width: 100,
      render: (hours: number) => (
        <div className={styles.hoursCell}>
          <span className={styles.hoursValue}>{hours}</span>
          <span className={styles.hoursUnit}>hrs</span>
        </div>
      ),
      sorter: (a, b) => a.hours - b.hours,
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      width: 150,
      render: (project: string) => project || '—',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description: string) => (
        <div className={styles.descriptionCell} title={description}>
          {description}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag 
          color={status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'default'}
          style={{ textTransform: 'capitalize' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'adminNotes',
      key: 'notes',
      width: 150,
      render: (notes: string) => notes || '—',
    },
  ];

  const calculateSummary = () => {
    const summary = {
      totalHours: timesheet.totalHours,
      workHours: 0,
      leaveHours: 0,
      meetingHours: 0,
      otherHours: 0,
      approvedEntries: 0,
      pendingEntries: 0,
    };

    timesheet.entries?.forEach(entry => {
      switch (entry.type) {
        case 'work':
          summary.workHours += entry.hours;
          break;
        case 'leave':
          summary.leaveHours += entry.hours;
          break;
        case 'meeting':
          summary.meetingHours += entry.hours;
          break;
        case 'birthday':
        case 'other':
          summary.otherHours += entry.hours;
          break;
      }

      if (entry.status === 'approved') {
        summary.approvedEntries++;
      } else if (entry.status === 'pending') {
        summary.pendingEntries++;
      }
    });

    return summary;
  };

  const summary = calculateSummary();
  const targetHours = (timesheet as any).targetHours || 40;
  const compliance = (timesheet.totalHours / targetHours) * 100;
  const user = (timesheet as any);

  return (
    <div className={styles.timesheetDetail}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Timesheet Details</h1>
            <div className={styles.timesheetId}>
              <FileTextOutlined />
              <span>{timesheet.id}</span>
            </div>
          </div>
          
          <div className={styles.statusSection}>
            <Tag 
              icon={statusIcons[timesheet.status as keyof typeof statusIcons]}
              color={statusColors[timesheet.status as keyof typeof statusColors]}
              className={styles.statusTag}
            >
              {timesheet.status.toUpperCase()}
            </Tag>
            <div className={styles.compliance}>
              <Progress 
                type="circle" 
                percent={Math.min(compliance, 100)} 
                size={60}
                strokeColor={compliance >= 100 ? '#52c41a' : compliance >= 75 ? '#1890ff' : '#ff4d4f'}
                format={() => (
                  <div className={styles.complianceCircle}>
                    <span className={styles.complianceValue}>
                      {compliance.toFixed(1)}%
                    </span>
                    <span className={styles.complianceLabel}>of target</span>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Space>
            {timesheet.status === 'submitted' && (
              <>
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => onApprove?.(timesheet.id)}
                  className={styles.approveButton}
                >
                  Approve
                </Button>
                <Button 
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => onReject?.(timesheet.id)}
                  className={styles.rejectButton}
                >
                  Reject
                </Button>
              </>
            )}
            {(timesheet.status === 'draft' || timesheet.status === 'rejected') && (
              <Button 
                icon={<EditOutlined />}
                onClick={() => onEdit?.(timesheet)}
              >
                Edit Timesheet
              </Button>
            )}
            <Button 
              icon={<DownloadOutlined />}
              onClick={() => onDownload?.(timesheet)}
            >
              Download PDF
            </Button>
            <Button 
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
            >
              Print
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* Basic Information */}
        <Col xs={24} lg={12}>
          <Card title="Basic Information" className={styles.infoCard}>
            <Descriptions column={1} className={styles.descriptions}>
              <Descriptions.Item label={<><UserOutlined /> User</>}>
                <div className={styles.userInfo}>
                  <Avatar size="small" icon={<UserOutlined />} className={styles.userAvatar} />
                  <div>
                    <div className={styles.userName}>{user.userName || `User ${timesheet.userId}`}</div>
                    <div className={styles.userEmail}>{user.userEmail || `${timesheet.userId}@company.com`}</div>
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label={<><CalendarOutlined /> Week Period</>}>
                <div className={styles.weekInfo}>
                  <span className={styles.weekDates}>
                    {dayjs(timesheet.weekStart).format('MMM DD, YYYY')} - {dayjs(timesheet.weekEnd).format('MMM DD, YYYY')}
                  </span>
                  <Tag className={styles.weekTag}>
                    Week {dayjs(timesheet.weekStart).week()}
                  </Tag>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label={<><ProjectOutlined /> Project</>}>
                {user.project || 'No Project'}
              </Descriptions.Item>
              <Descriptions.Item label={<><TeamOutlined /> Department</>}>
                {user.department || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label={<><ClockCircleOutlined /> Submitted</>}>
                {dayjs(timesheet.submittedDate).format('MMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              {timesheet.status === 'approved' && user.approvedBy && (
                <Descriptions.Item label={<><CheckCircleOutlined /> Approved By</>}>
                  <div className={styles.approvalInfo}>
                    <span className={styles.approvedBy}>{user.approvedBy}</span>
                    {user.approvedDate && (
                      <span className={styles.approvedDate}>
                        on {dayjs(user.approvedDate).format('MMM DD, YYYY HH:mm')}
                      </span>
                    )}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Hours Summary */}
        <Col xs={24} lg={12}>
          <Card title="Hours Summary" className={styles.summaryCard}>
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Statistic
                  title="Total Hours"
                  value={timesheet.totalHours}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Target Hours"
                  value={targetHours}
                  suffix="hrs"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col xs={24}>
                <div className={styles.sectionHeader}>Breakdown</div>
                <div className={styles.breakdown}>
                  <div className={styles.breakdownItem}>
                    <div className={styles.breakdownLabel}>
                      <div className={`${styles.breakdownDot} ${styles.workDot}`} />
                      <span>Work Hours</span>
                    </div>
                    <div className={styles.breakdownValue}>
                      {summary.workHours} hrs
                    </div>
                  </div>
                  <div className={styles.breakdownItem}>
                    <div className={styles.breakdownLabel}>
                      <div className={`${styles.breakdownDot} ${styles.leaveDot}`} />
                      <span>Leave Hours</span>
                    </div>
                    <div className={styles.breakdownValue}>
                      {summary.leaveHours} hrs
                    </div>
                  </div>
                  <div className={styles.breakdownItem}>
                    <div className={styles.breakdownLabel}>
                      <div className={`${styles.breakdownDot} ${styles.meetingDot}`} />
                      <span>Meeting Hours</span>
                    </div>
                    <div className={styles.breakdownValue}>
                      {summary.meetingHours} hrs
                    </div>
                  </div>
                  <div className={styles.breakdownItem}>
                    <div className={styles.breakdownLabel}>
                      <div className={`${styles.breakdownDot} ${styles.otherDot}`} />
                      <span>Other Hours</span>
                    </div>
                    <div className={styles.breakdownValue}>
                      {summary.otherHours} hrs
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Time Entries */}
        <Col span={24}>
          <Card 
            title="Time Entries" 
            className={styles.entriesCard}
            extra={
              <div className={styles.entriesSummary}>
                <Badge 
                  count={timesheet.entries?.length || 0} 
                  showZero 
                  title="Total entries"
                  className={styles.entriesBadge}
                />
                <span className={styles.approvedEntries}>
                  {summary.approvedEntries} approved
                </span>
                {summary.pendingEntries > 0 && (
                  <span className={styles.pendingEntries}>
                    {summary.pendingEntries} pending
                  </span>
                )}
              </div>
            }
          >
            <Table
              columns={timeEntryColumns}
              dataSource={timesheet.entries || []}
              rowKey="id"
              pagination={false}
              scroll={{ x: 800 }}
              className={styles.entriesTable}
            />
          </Card>
        </Col>

        {/* Timeline / Activity Log */}
        {timesheet.status === 'approved' && (
          <Col span={24}>
            <Card title="Approval Timeline" className={styles.timelineCard}>
              <Timeline
                items={[
                  {
                    color: 'blue',
                    children: (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineTitle}>Timesheet Created</div>
                        <div className={styles.timelineContent}>
                          Timesheet drafted by {user.userName || `User ${timesheet.userId}`}
                        </div>
                        <div className={styles.timelineTime}>
                          {dayjs(timesheet.weekStart).format('MMM DD, YYYY')}
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: 'orange',
                    children: (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineTitle}>Timesheet Submitted</div>
                        <div className={styles.timelineContent}>
                          Submitted for approval
                        </div>
                        <div className={styles.timelineTime}>
                          {dayjs(timesheet.submittedDate).format('MMM DD, YYYY HH:mm')}
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: 'green',
                    children: (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineTitle}>Timesheet Approved</div>
                        <div className={styles.timelineContent}>
                          Approved by {user.approvedBy || 'Administrator'}
                        </div>
                        <div className={styles.timelineTime}>
                          {user.approvedDate ? dayjs(user.approvedDate).format('MMM DD, YYYY HH:mm') : 'Recently'}
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default TimesheetDetail;