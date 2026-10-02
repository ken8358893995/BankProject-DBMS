import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, Table, Tag, message, Card, Alert } from 'antd';
import { CustomerServiceOutlined, PlusCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

export default function CustomerSupportModal({ username = 'Customer', accounts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRaising, setIsRaising] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [form] = Form.useForm();

  // Load complaints from localStorage
  useEffect(() => {
    loadTickets();
  }, [username]);

  const loadTickets = () => {
    const saved = localStorage.getItem('bank_customer_tickets');
    if (saved) {
      try {
        const all = JSON.parse(saved);
        setTickets(all.filter(t => t.username === username));
      } catch (e) {
        setTickets([]);
      }
    } else {
      // Seed default sample complaint
      const seed = [
        {
          id: 'TKT-1042',
          username: username,
          accountID: accounts[0]?.AccountID || '1001',
          category: 'Transaction Issue',
          subject: 'UPI transfer debited but receiver did not get credit',
          description: 'Sent Rs. 2,500 on 4th Sept. Amount was deducted from my savings account but merchant did not receive.',
          priority: 'High',
          status: 'Resolved',
          createdOn: '04 Sep 2026',
          resolvedNote: 'Checked switch gateway. Amount reversed back to your primary savings account.',
        }
      ];
      localStorage.setItem('bank_customer_tickets', JSON.stringify(seed));
      setTickets(seed.filter(t => t.username === username));
    }
  };

  const handleCreateTicket = (values) => {
    const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newId,
      username: username,
      accountID: values.accountID || (accounts[0]?.AccountID || '1001'),
      category: values.category,
      subject: values.subject,
      description: values.description,
      priority: values.priority || 'Medium',
      status: 'Pending',
      createdOn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      resolvedNote: '',
    };

    const existing = JSON.parse(localStorage.getItem('bank_customer_tickets') || '[]');
    const updated = [newTicket, ...existing];
    localStorage.setItem('bank_customer_tickets', JSON.stringify(updated));

    message.success(`Ticket ${newId} submitted successfully! Bank support will resolve within 24 hours.`);
    form.resetFields();
    setIsRaising(false);
    loadTickets();
  };

  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      key: 'id',
      render: (t) => <b style={{ color: '#1677ff', fontFamily: 'monospace' }}>{t}</b>
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (c) => <Tag color="blue">{c}</Tag>
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (s, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#333' }}>{s}</div>
          <small style={{ color: '#888' }}>{r.description.slice(0, 50)}...</small>
          {r.resolvedNote && (
            <div style={{ marginTop: 4, padding: '4px 8px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, fontSize: '0.8rem', color: '#389e0d' }}>
              <b>Resolution:</b> {r.resolvedNote}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (p) => (
        <Tag color={p === 'High' ? 'red' : p === 'Medium' ? 'orange' : 'green'}>
          {p}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => (
        <Tag 
          icon={s === 'Resolved' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} 
          color={s === 'Resolved' ? 'success' : 'processing'}
          style={{ fontWeight: 700, borderRadius: 10 }}
        >
          {s.toUpperCase()}
        </Tag>
      )
    }
  ];

  return (
    <>
      <Button
        icon={<CustomerServiceOutlined />}
        onClick={() => { setIsOpen(true); loadTickets(); }}
        style={{
          borderRadius: 8,
          borderColor: '#13c2c2',
          color: '#13c2c2',
          fontWeight: 600,
          background: '#e6fffb',
        }}
      >
        Help & Grievances
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CustomerServiceOutlined style={{ color: '#13c2c2', fontSize: '1.4rem' }} />
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1a1a2e' }}>
                Customer Grievance & Helpdesk
              </span>
            </div>
            {!isRaising && (
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => setIsRaising(true)}
                style={{ borderRadius: 8, background: '#13c2c2', borderColor: '#13c2c2', fontWeight: 600 }}
              >
                Raise New Complaint
              </Button>
            )}
          </div>
        }
        open={isOpen}
        onCancel={() => { setIsOpen(false); setIsRaising(false); }}
        footer={null}
        width={780}
      >
        <div style={{ padding: '10px 0' }}>
          {isRaising ? (
            <Card title="📝 File a Complaint / Service Request" style={{ borderRadius: 12, border: '1px solid #b5f5ec' }}>
              <Alert
                message="Banking Ombudsman / Customer Care SLA"
                description="All submitted tickets are registered under Core Banking audit and assigned to our branch resolution officer with a 24-hour turnaround time."
                type="info"
                showIcon
                style={{ marginBottom: 18, borderRadius: 8 }}
              />

              <Form form={form} layout="vertical" onFinish={handleCreateTicket}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item
                    label="Associated Account"
                    name="accountID"
                    initialValue={accounts[0]?.AccountID || ''}
                    rules={[{ required: true, message: 'Please select an account' }]}
                  >
                    <Select size="large">
                      {accounts.map(a => (
                        <Option key={a.AccountID} value={a.AccountID}>
                          Account #{a.AccountID} (Bal: Rs. {a.Balance?.toLocaleString()})
                        </Option>
                      ))}
                      {accounts.length === 0 && <Option value="1001">Account #1001 (Savings)</Option>}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Problem Category"
                    name="category"
                    initialValue="Failed Online Transfer"
                    rules={[{ required: true, message: 'Select category' }]}
                  >
                    <Select size="large">
                      <Option value="Failed Online Transfer">Failed Online Transfer (Money Deducted)</Option>
                      <Option value="Debit Card Issue">Debit Card / ATM Transaction Dispute</Option>
                      <Option value="Fixed Deposit Enquiry">Fixed Deposit Interest / Maturity</Option>
                      <Option value="Loan EMI Dispute">Loan EMI & Installment Problem</Option>
                      <Option value="Account Security">Suspicious Account Activity / Security</Option>
                      <Option value="Other Service Request">General Banking Assistance</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                  <Form.Item
                    label="Subject / Brief Summary"
                    name="subject"
                    rules={[{ required: true, message: 'Please write subject' }]}
                  >
                    <Input size="large" placeholder="E.g., Money debited Rs. 5,000 but transfer failed" />
                  </Form.Item>

                  <Form.Item label="Urgency / Priority" name="priority" initialValue="High">
                    <Select size="large">
                      <Option value="High">🚨 High (Immediate)</Option>
                      <Option value="Medium">⚠️ Medium</Option>
                      <Option value="Low">ℹ️ Low</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  label="Detailed Description"
                  name="description"
                  rules={[{ required: true, message: 'Please explain your problem' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Describe what happened, transaction date, amount, and recipient details..."
                  />
                </Form.Item>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <Button size="large" onClick={() => setIsRaising(false)} style={{ borderRadius: 8 }}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ borderRadius: 8, background: '#13c2c2', borderColor: '#13c2c2', fontWeight: 600 }}
                  >
                    Submit Ticket to Branch
                  </Button>
                </div>
              </Form>
            </Card>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, color: '#555', fontSize: '1rem' }}>
                  Your Support Tickets History ({tickets.length})
                </span>
                <small style={{ color: '#888' }}>Status updates automatically as bank staff acts on your request</small>
              </div>

              <Table
                dataSource={tickets}
                rowKey="id"
                columns={columns}
                pagination={{ pageSize: 4 }}
                locale={{ emptyText: 'No complaints raised yet. Click "Raise New Complaint" to get help.' }}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
