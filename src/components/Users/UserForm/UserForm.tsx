'use client';

import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Switch, Upload, Row, Col, Space } from 'antd';
import { 
  UploadOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  LockOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { FormInstance } from 'antd';
import styles from './UserForm.module.css';

const { Option } = Select;
const { TextArea } = Input;

interface UserFormProps {
  form: FormInstance;
  editingUser: any;
  onSubmit: (values: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ form, editingUser, onSubmit }) => {
  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        department: editingUser.department,
        status: editingUser.status,
      });
    } else {
      form.resetFields();
    }
  }, [editingUser, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Operations',
    'Finance',
    'IT',
    'Product',
    'Design',
    'Support'
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className={styles.userForm}
    >
      <Row gutter={[16, 16]}>
        {/* Basic Information */}
        <Col span={24}>
          <div className={styles.sectionTitle}>
            <UserOutlined />
            <span>Basic Information</span>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter user name' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
          >
            <Input 
              placeholder="Enter full name" 
              prefix={<UserOutlined />}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              placeholder="Enter email address" 
              prefix={<MailOutlined />}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number' }
            ]}
          >
            <Input 
              placeholder="Enter phone number" 
              prefix={<PhoneOutlined />}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Employee ID"
            name="employeeId"
          >
            <Input 
              placeholder="Enter employee ID" 
              size="large"
            />
          </Form.Item>
        </Col>

        {/* Role and Department */}
        <Col span={24}>
          <div className={styles.sectionTitle}>
            <TeamOutlined />
            <span>Role & Department</span>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="User Role"
            name="role"
            rules={[{ required: true, message: 'Please select user role' }]}
          >
            <Select placeholder="Select role" size="large">
              <Option value="admin">Administrator</Option>
              <Option value="manager">Manager</Option>
              <Option value="user">Regular User</Option>
              <Option value="supervisor">Supervisor</Option>
              <Option value="auditor">Auditor</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: 'Please select department' }]}
          >
            <Select placeholder="Select department" size="large">
              {departments.map(dept => (
                <Option key={dept} value={dept.toLowerCase()}>{dept}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Job Title"
            name="jobTitle"
          >
            <Input 
              placeholder="Enter job title" 
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Reporting Manager"
            name="manager"
          >
            <Select placeholder="Select manager" size="large" allowClear>
              <Option value="john-doe">John Doe</Option>
              <Option value="jane-smith">Jane Smith</Option>
              <Option value="michael-brown">Michael Brown</Option>
            </Select>
          </Form.Item>
        </Col>

        {/* Account Settings */}
        <Col span={24}>
          <div className={styles.sectionTitle}>
            <LockOutlined />
            <span>Account Settings</span>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: !editingUser, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
            extra={editingUser ? "Leave empty to keep current password" : ""}
          >
            <Input.Password 
              placeholder="Enter password" 
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Confirm password" 
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Account Status"
            name="status"
            initialValue="active"
          >
            <Select placeholder="Select status" size="large">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="pending">Pending</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Start Date"
            name="startDate"
          >
            <Input 
              type="date" 
              size="large"
            />
          </Form.Item>
        </Col>

        {/* Additional Information */}
        <Col span={24}>
          <div className={styles.sectionTitle}>
            <UserOutlined />
            <span>Additional Information</span>
          </div>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Profile Picture"
            name="avatar"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              className={styles.upload}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Bio/Description"
            name="description"
          >
            <TextArea 
              rows={3} 
              placeholder="Enter user description or bio" 
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea 
              rows={2} 
              placeholder="Internal notes about the user" 
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Col>

        {/* Permissions */}
        <Col span={24}>
          <div className={styles.sectionTitle}>
            <LockOutlined />
            <span>Permissions</span>
          </div>
        </Col>

        <Col xs={24}>
          <div className={styles.permissionsGrid}>
            <Form.Item
              name="canCreateTimesheets"
              valuePropName="checked"
              initialValue={true}
            >
              <div className={styles.permissionItem}>
                <Switch />
                <span className={styles.permissionLabel}>Can create timesheets</span>
              </div>
            </Form.Item>

            <Form.Item
              name="canApproveTimesheets"
              valuePropName="checked"
              initialValue={false}
            >
              <div className={styles.permissionItem}>
                <Switch />
                <span className={styles.permissionLabel}>Can approve timesheets</span>
              </div>
            </Form.Item>

            <Form.Item
              name="canManageUsers"
              valuePropName="checked"
              initialValue={false}
            >
              <div className={styles.permissionItem}>
                <Switch />
                <span className={styles.permissionLabel}>Can manage users</span>
              </div>
            </Form.Item>

            <Form.Item
              name="canViewReports"
              valuePropName="checked"
              initialValue={true}
            >
              <div className={styles.permissionItem}>
                <Switch />
                <span className={styles.permissionLabel}>Can view reports</span>
              </div>
            </Form.Item>

            <Form.Item
              name="canExportData"
              valuePropName="checked"
              initialValue={true}
            >
              <div className={styles.permissionItem}>
                <Switch />
                <span className={styles.permissionLabel}>Can export data</span>
              </div>
            </Form.Item>

            <Form.Item
              name="receiveNotifications"
              valuePropName="checked"
              initialValue={true}
            >
              <div className={styles.permissionItem}>
                <Switch />
                <span className={styles.permissionLabel}>Receive notifications</span>
              </div>
            </Form.Item>
          </div>
        </Col>

        {/* Form Actions */}
        <Col span={24}>
          <div className={styles.formActions}>
            <Space>
              <Button 
                size="large" 
                onClick={() => form.resetFields()}
              >
                Reset
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;