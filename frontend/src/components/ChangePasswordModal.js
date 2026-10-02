import { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { HOST } from '../api/config';

export default function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${HOST}/login/changePassword`, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success('Password changed successfully!');
      form.resetFields();
      setOpen(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to change password. Check your old password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button icon={<LockOutlined />} onClick={() => setOpen(true)} style={{ borderRadius: 8 }}>
        Change Password
      </Button>
      <Modal
        title='🔐 Change Password'
        open={open}
        onCancel={() => { setOpen(false); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item name='oldPassword' label='Current Password' rules={[{ required: true }]}>
            <Input.Password placeholder='Enter current password' />
          </Form.Item>
          <Form.Item name='newPassword' label='New Password' rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder='Enter new password (min 6 chars)' />
          </Form.Item>
          <Form.Item name='confirmPassword' label='Confirm New Password' rules={[{ required: true }]}>
            <Input.Password placeholder='Confirm new password' />
          </Form.Item>
          <Button type='primary' htmlType='submit' block loading={loading} size='large'>
            Update Password
          </Button>
        </Form>
      </Modal>
    </>
  );
}
