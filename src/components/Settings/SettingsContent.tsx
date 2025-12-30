'use client';

import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Button, 
  TimePicker, 
  Divider,
  Tabs,
  InputNumber,
  DatePicker,
  Upload,
  message,
  Space,
  Tag
} from 'antd';
import { 
  SaveOutlined, 
  UploadOutlined, 
  BellOutlined,
  SecurityScanOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';
import styles from './SettingsContent.module.css';

const { Option } = Select;
const { TextArea } = Input;

const SettingsContent: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const items: TabsProps['items'] = [
    {
      key: 'general',
      label: (
        <span>
          <SettingOutlined />
          General Settings
        </span>
      ),
    },
    {
      key: 'work',
      label: (
        <span>
          <CalendarOutlined />
          Work Policies
        </span>
      ),
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined />
          Notifications
        </span>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <SecurityScanOutlined />
          Security
        </span>
      ),
    },
    {
      key: 'holidays',
      label: (
        <span>
          <CalendarOutlined />
          Holiday Calendar
        </span>
      ),
    },
  ];

  const handleSave = () => {
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        console.log('Form values:', values);
        setTimeout(() => {
          message.success('Settings saved successfully');
          setLoading(false);
        }, 1000);
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
        setLoading(false);
      });
  };

  const holidayData = [
    {
      key: '1',
      date: '2024-01-01',
      name: 'New Year\'s Day',
      type: 'public',
      description: 'First day of the year',
    },
    {
      key: '2',
      date: '2024-12-25',
      name: 'Christmas Day',
      type: 'public',
      description: 'Christmas holiday',
    },
  ];

  return (
    <div className={styles.settingsContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Settings</h1>
        <p className={styles.subtitle}>Configure system preferences and policies</p>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={items}
        className={styles.settingsTabs}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          companyName: 'TimeTrack Pro',
          workHoursPerDay: 8,
          workHoursPerWeek: 40,
          autoApproveTimesheets: false,
          requireTimesheetSubmission: true,
          notificationEmail: true,
          notificationPush: true,
          sessionTimeout: 30,
          passwordExpiryDays: 90,
        }}
      >
        {activeTab === 'general' && (
          <Card title="General System Settings">
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Company Name"
                  name="companyName"
                  rules={[{ required: true, message: 'Please enter company name' }]}
                >
                  <Input placeholder="Enter company name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Time Zone"
                  name="timezone"
                  initialValue="UTC"
                  rules={[{ required: true, message: 'Please select time zone' }]}
                >
                  <Select placeholder="Select time zone">
                    <Option value="UTC">UTC</Option>
                    <Option value="EST">Eastern Time</Option>
                    <Option value="PST">Pacific Time</Option>
                    <Option value="CST">Central Time</Option>
                    <Option value="GMT">GMT</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="System Logo"
                  name="logo"
                >
                  <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Upload Logo</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="System Description"
                  name="description"
                >
                  <TextArea rows={4} placeholder="Enter system description" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {activeTab === 'work' && (
          <Card title="Work Policy Settings">
            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Daily Work Hours"
                  name="workHoursPerDay"
                  rules={[{ required: true, message: 'Please enter daily work hours' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={24} 
                    style={{ width: '100%' }} 
                    addonAfter="hours"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Weekly Work Hours"
                  name="workHoursPerWeek"
                  rules={[{ required: true, message: 'Please enter weekly work hours' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={168} 
                    style={{ width: '100%' }} 
                    addonAfter="hours"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Standard Work Start Time"
                  name="workStartTime"
                  initialValue={dayjs('09:00', 'HH:mm')}
                >
                  <TimePicker style={{ width: '100%' }} format="HH:mm" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <div className={styles.sectionHeader}>Timesheet Policies</div>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="autoApproveTimesheets"
                  valuePropName="checked"
                >
                  <Switch />
                  <span className={styles.switchLabel}>Auto-approve timesheets after submission</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="requireTimesheetSubmission"
                  valuePropName="checked"
                >
                  <Switch />
                  <span className={styles.switchLabel}>Require timesheet submission every week</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="allowOvertime"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>Allow overtime work (with approval)</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Overtime Approval Required After"
                  name="overtimeThreshold"
                  initialValue={2}
                >
                  <InputNumber 
                    min={0} 
                    max={24} 
                    style={{ width: '100%' }} 
                    addonAfter="hours"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card title="Notification Settings">
            <Row gutter={[24, 16]}>
              <Col xs={24}>
                <div className={styles.sectionHeader}>Email Notifications</div>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="notificationEmail"
                  valuePropName="checked"
                >
                  <Switch />
                  <span className={styles.switchLabel}>Enable email notifications</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="notificationTimesheetSubmission"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>Timesheet submission alerts</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="notificationTimesheetApproval"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>Timesheet approval alerts</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <div className={styles.sectionHeader}>Push Notifications</div>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="notificationPush"
                  valuePropName="checked"
                >
                  <Switch />
                  <span className={styles.switchLabel}>Enable push notifications</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="notificationReminders"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>Weekly reminder notifications</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <div className={styles.sectionHeader}>Admin Notifications</div>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="notificationAdminAlerts"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>System alerts for administrators</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="notificationReportGeneration"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>Report generation notifications</span>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card title="Security Settings">
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Session Timeout (minutes)"
                  name="sessionTimeout"
                  rules={[{ required: true, message: 'Please enter session timeout' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={480} 
                    style={{ width: '100%' }} 
                    addonAfter="min"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Password Expiry (days)"
                  name="passwordExpiryDays"
                  rules={[{ required: true, message: 'Please enter password expiry days' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={365} 
                    style={{ width: '100%' }} 
                    addonAfter="days"
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <div className={styles.sectionHeader}>Password Policy</div>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="passwordRequireUppercase"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>Require uppercase letters</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="passwordRequireNumbers"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>Require numbers</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="passwordRequireSpecial"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>Require special characters</span>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Minimum Password Length"
                  name="passwordMinLength"
                  initialValue={8}
                >
                  <InputNumber 
                    min={6} 
                    max={32} 
                    style={{ width: '100%' }} 
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <div className={styles.sectionHeader}>Two-Factor Authentication</div>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="twoFactorEnabled"
                  valuePropName="checked"
                >
                  <Switch />
                  <span className={styles.switchLabel}>Enable two-factor authentication for all users</span>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="twoFactorRequiredAdmins"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className={styles.switchLabel}>Require 2FA for administrators</span>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {activeTab === 'holidays' && (
          <Card title="Holiday Calendar">
            <Row gutter={[24, 16]}>
              <Col xs={24}>
                <div className={styles.holidayActions}>
                  <Space>
                    <Button type="primary" icon={<CalendarOutlined />}>
                      Add Holiday
                    </Button>
                    <Button>
                      Import Holidays
                    </Button>
                    <Button>
                      Export Calendar
                    </Button>
                  </Space>
                </div>
              </Col>
              <Col xs={24}>
                <div className={styles.sectionHeader}>Upcoming Holidays</div>
              </Col>
              <Col xs={24}>
                <div className={styles.holidayList}>
                  {holidayData.map((holiday) => (
                    <div key={holiday.key} className={styles.holidayItem}>
                      <div className={styles.holidayDate}>
                        {dayjs(holiday.date).format('MMM DD')}
                      </div>
                      <div className={styles.holidayInfo}>
                        <div className={styles.holidayName}>{holiday.name}</div>
                        <div className={styles.holidayDescription}>{holiday.description}</div>
                      </div>
                      <div className={styles.holidayActions}>
                        <Tag color={holiday.type === 'public' ? 'blue' : 'green'}>
                          {holiday.type.toUpperCase()}
                        </Tag>
                        <Space>
                          <Button type="text" size="small">Edit</Button>
                          <Button type="text" size="small" danger>Delete</Button>
                        </Space>
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
              <Col xs={24}>
                <div className={styles.sectionHeader}>Add New Holiday</div>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Holiday Date"
                  name="holidayDate"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Holiday Name"
                  name="holidayName"
                >
                  <Input placeholder="Enter holiday name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Holiday Type"
                  name="holidayType"
                >
                  <Select placeholder="Select type">
                    <Option value="public">Public Holiday</Option>
                    <Option value="company">Company Holiday</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Description"
                  name="holidayDescription"
                >
                  <TextArea rows={3} placeholder="Enter holiday description" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        <div className={styles.formActions}>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            loading={loading}
            onClick={handleSave}
            size="large"
          >
            Save Settings
          </Button>
          <Button 
            onClick={() => form.resetFields()}
            size="large"
          >
            Reset to Default
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SettingsContent;