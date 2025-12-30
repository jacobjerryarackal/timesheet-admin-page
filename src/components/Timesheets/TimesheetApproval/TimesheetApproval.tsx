'use client';

import React, { useState } from 'react';
import { 
  Card, 
  List, 
  Button, 
  Tag, 
  Avatar, 
  Space, 
  Input, 
  Modal, 
  message,
  Badge,
  Tooltip,
  Divider
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  SendOutlined
} from '@ant-design/icons';
import { Timesheet } from '@/types';
import dayjs from "@/utils/dayjs";
import styles from './TimesheetApproval.module.css';

const { TextArea } = Input;

interface TimesheetApprovalProps {
  pendingTimesheets: Timesheet[];
  onApprove: (timesheetId: string, notes?: string) => void;
  onReject: (timesheetId: string, notes?: string) => void;
  onView: (timesheet: Timesheet) => void;
  loading?: boolean;
}

const TimesheetApproval: React.FC<TimesheetApprovalProps> = ({
  pendingTimesheets,
  onApprove,
  onReject,
  onView,
  loading = false,
}) => {
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [approveNotes, setApproveNotes] = useState('');

  const handleApprove = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setApproveModalVisible(true);
  };

  const handleReject = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setRejectModalVisible(true);
  };

  const confirmApprove = () => {
    if (selectedTimesheet) {
      onApprove(selectedTimesheet.id, approveNotes);
      setApproveModalVisible(false);
      setApproveNotes('');
      message.success('Timesheet approved successfully');
    }
  };

  const confirmReject = () => {
    if (selectedTimesheet && rejectNotes.trim()) {
      onReject(selectedTimesheet.id, rejectNotes);
      setRejectModalVisible(false);
      setRejectNotes('');
      message.success('Timesheet rejected');
    } else {
      message.warning('Please provide a reason for rejection');
    }
  };

  const calculateCompliance = (timesheet: Timesheet) => {
    const targetHours = (timesheet as any).targetHours || 40;
    const compliance = (timesheet.totalHours / targetHours) * 100;
    return Math.min(compliance, 100);
  };

  const getStatusColor = (compliance: number) => {
    if (compliance >= 100) return 'green';
    if (compliance >= 90) return 'blue';
    if (compliance >= 75) return 'orange';
    return 'red';
  };

  if (pendingTimesheets.length === 0) {
    return (
      <Card title="Pending Approvals" className={styles.approvalCard}>
        <div className={styles.emptyState}>
          <CheckCircleOutlined className={styles.emptyIcon} />
          <h3>No Pending Approvals</h3>
          <p>All timesheets have been reviewed and processed</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card 
        title={
          <div className={styles.cardTitle}>
            <span>Pending Approvals</span>
            <Badge 
              count={pendingTimesheets.length} 
              style={{ backgroundColor: '#faad14' }}
              className={styles.pendingCount}
            />
          </div>
        }
        className={styles.approvalCard}
        extra={
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => console.log('View all pending')}
          >
            View All
          </Button>
        }
      >
        <List
          dataSource={pendingTimesheets.slice(0, 5)}
          loading={loading}
          renderItem={(timesheet) => {
            const compliance = calculateCompliance(timesheet);
            const complianceColor = getStatusColor(compliance);
            
            return (
              <List.Item className={styles.approvalItem}>
                <div className={styles.timesheetInfo}>
                  <div className={styles.timesheetHeader}>
                    <div className={styles.userInfo}>
                      <Avatar 
                        size="small" 
                        icon={<UserOutlined />}
                        className={styles.userAvatar}
                      />
                      <div>
                        <div className={styles.userName}>
                          {(timesheet as any).userName || `User ${timesheet.userId}`}
                        </div>
                        <div className={styles.timesheetId}>
                          <FileTextOutlined /> {timesheet.id}
                        </div>
                      </div>
                    </div>
                    <div className={styles.weekInfo}>
                      <CalendarOutlined />
                      <span>
                        {dayjs(timesheet.weekStart).format('MMM DD')} - {dayjs(timesheet.weekEnd).format('MMM DD')}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.timesheetDetails}>
                    <div className={styles.hoursInfo}>
                      <div className={styles.hoursValue}>
                        {timesheet.totalHours} <span className={styles.hoursLabel}>hours</span>
                      </div>
                      <Tag color={complianceColor} className={styles.complianceTag}>
                        {compliance.toFixed(1)}% compliance
                      </Tag>
                    </div>
                    
                    <div className={styles.projectInfo}>
                      <span className={styles.projectLabel}>Project:</span>
                      <span className={styles.projectName}>
                        {(timesheet as any).project || 'No Project'}
                      </span>
                    </div>
                    
                    <div className={styles.submittedInfo}>
                      <ClockCircleOutlined />
                      <span>Submitted {dayjs(timesheet.submittedDate).fromNow()}</span>
                    </div>
                  </div>
                  
                  <div className={styles.actions}>
                    <Space>
                      <Tooltip title="View Details">
                        <Button 
                          type="text" 
                          icon={<EyeOutlined />}
                          onClick={() => onView(timesheet)}
                          className={styles.viewButton}
                        />
                      </Tooltip>
                      <Button 
                        type="primary" 
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApprove(timesheet)}
                        className={styles.approveButton}
                      >
                        Approve
                      </Button>
                      <Button 
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleReject(timesheet)}
                        className={styles.rejectButton}
                      >
                        Reject
                      </Button>
                    </Space>
                  </div>
                </div>
              </List.Item>
            );
          }}
          className={styles.approvalList}
        />
        
        <Divider />
        
        <div className={styles.bulkActions}>
          <Space>
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={() => {
                if (pendingTimesheets.length > 0) {
                  Modal.confirm({
                    title: 'Approve All Pending Timesheets',
                    content: `Are you sure you want to approve all ${pendingTimesheets.length} pending timesheets?`,
                    onOk: () => {
                      pendingTimesheets.forEach(ts => onApprove(ts.id));
                      message.success(`Approved ${pendingTimesheets.length} timesheets`);
                    },
                  });
                }
              }}
            >
              Approve All
            </Button>
            <Button 
              onClick={() => console.log('Export pending list')}
            >
              Export List
            </Button>
          </Space>
        </div>
      </Card>

      {/* Reject Modal */}
      <Modal
        title="Reject Timesheet"
        open={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectNotes('');
        }}
        footer={[
          <Button key="cancel" onClick={() => setRejectModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="reject" 
            type="primary" 
            danger
            onClick={confirmReject}
            disabled={!rejectNotes.trim()}
          >
            Reject Timesheet
          </Button>,
        ]}
        className={styles.rejectModal}
      >
        {selectedTimesheet && (
          <div className={styles.modalContent}>
            <div className={styles.modalInfo}>
              <p>
                You are about to reject timesheet <strong>{selectedTimesheet.id}</strong> 
                submitted by <strong>{(selectedTimesheet as any).userName || `User ${selectedTimesheet.userId}`}</strong>.
              </p>
              <div className={styles.timesheetSummary}>
                <div>
                  <span className={styles.summaryLabel}>Week:</span>
                  <span>
                    {dayjs(selectedTimesheet.weekStart).format('MMM DD')} - {dayjs(selectedTimesheet.weekEnd).format('MMM DD, YYYY')}
                  </span>
                </div>
                <div>
                  <span className={styles.summaryLabel}>Hours:</span>
                  <span>{selectedTimesheet.totalHours} hours</span>
                </div>
              </div>
            </div>
            
            <div className={styles.notesSection}>
              <label htmlFor="rejectNotes">Reason for rejection:</label>
              <TextArea
                id="rejectNotes"
                placeholder="Please provide a reason for rejecting this timesheet..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows={4}
                className={styles.notesInput}
              />
              <p className={styles.notesHint}>
                This message will be visible to the user and will help them understand what needs to be corrected.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title="Approve Timesheet"
        open={approveModalVisible}
        onCancel={() => {
          setApproveModalVisible(false);
          setApproveNotes('');
        }}
        footer={[
          <Button key="cancel" onClick={() => setApproveModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="approve" 
            type="primary" 
            onClick={confirmApprove}
          >
            Approve Timesheet
          </Button>,
        ]}
        className={styles.approveModal}
      >
        {selectedTimesheet && (
          <div className={styles.modalContent}>
            <div className={styles.modalInfo}>
              <p>
                You are about to approve timesheet <strong>{selectedTimesheet.id}</strong> 
                submitted by <strong>{(selectedTimesheet as any).userName || `User ${selectedTimesheet.userId}`}</strong>.
              </p>
              <div className={styles.timesheetSummary}>
                <div>
                  <span className={styles.summaryLabel}>Week:</span>
                  <span>
                    {dayjs(selectedTimesheet.weekStart).format('MMM DD')} - {dayjs(selectedTimesheet.weekEnd).format('MMM DD, YYYY')}
                  </span>
                </div>
                <div>
                  <span className={styles.summaryLabel}>Hours:</span>
                  <span>{selectedTimesheet.totalHours} hours</span>
                </div>
                <div>
                  <span className={styles.summaryLabel}>Compliance:</span>
                  <span>{calculateCompliance(selectedTimesheet).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className={styles.notesSection}>
              <label htmlFor="approveNotes">Optional notes:</label>
              <TextArea
                id="approveNotes"
                placeholder="Add any notes or comments for the user (optional)..."
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                rows={3}
                className={styles.notesInput}
              />
              <p className={styles.notesHint}>
                These notes will be visible to the user.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TimesheetApproval;