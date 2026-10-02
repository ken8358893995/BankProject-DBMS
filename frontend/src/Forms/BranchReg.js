import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addBranch } from '../api/branches';
import Logo from '../pages/Images/Logo2.png';

export default function BranchReg() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await addBranch(values);
      message.success('Branch added successfully!');
      form.resetFields();
      navigate('/employeePortal/branch-list');
    } catch (err) {
      message.error('Failed to add branch.');
    }
  };

  return (
    <div>
      <div className='navbar'>
        <img className='aruci--logo' src={Logo} onClick={() => navigate('/employeePortal/')} />
        <h1 className='topic'>Register Branch</h1>
      </div>
      <Card title="Add New Branch" style={{ width: 600, margin: '40px auto', borderRadius: 12 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter city name' }]}>
            <Input placeholder="Enter branch city" size="large" />
          </Form.Item>
          <Form.Item name="address" label="Full Address" rules={[{ required: true, message: 'Please enter branch address' }]}>
            <Input.TextArea placeholder="Enter full address" rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Register Branch
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
