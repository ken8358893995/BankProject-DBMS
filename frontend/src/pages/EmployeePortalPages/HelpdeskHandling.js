import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Input, message, Badge, Tooltip } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, MessageOutlined, SafetyCertificateOutlined, ReloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function HelpdeskHandling() {
  const [tickets, setTickets] = useState([]);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    loadAllTickets();
  }, []);

  const loadAllTickets = () => {
    const raw = localStorage.getItem('bank_customer_tickets');
    if (raw) {
      try {
        setTickets(JSON.parse(raw));
      } catch (e) {
        setTickets([]);
      }
    } else {
      // Sample tickets
      const sample = [
        {
          id: 'TKT-1042',
          username: 'AnjulaRox',
          accountID: '1001',
          category: 'Failed Online Transfer',
          subject: 'UPI transfer debited but receiver did not get credit',
          description: 'Sent Rs. 2,500 on 4th Sept. Amount was deducted from my savings account but merchant did not receive.',
          priority: 'High',
          status: 'Resolved',
          createdOn: '04 Sep 2026',
          resolvedNote: 'Checked switch gateway. Amount reversed back to your primary savings account.',
        },
        {
          id: 'TKT-1088',
          username: 'AnjulaRox',
          accountID: '1001',
          category: 'Debit Card Issue',
          subject: 'Card swipe failed at POS merchant terminal',
          description: 'Tried swiping card at supermarket for Rs. 1,200. Terminal showed timeout error.',
          priority: 'Medium',
          status: 'Pending',
          createdOn: '06 Sep 2026',
          resolvedNote: '',
        }
      ];
      localStorage.setItem('bank_customer_tickets', JSON.stringify(sample));
      setTickets(sample);
    }
  };

  const handleOpenResolve = (ticket) => {
    setSelectedTicket(ticket);
    setResolutionText(ticket.resolvedNote || 'Issue investigated by branch staff and resolved in core banking ledger.');
    setResolveModalOpen(true);
  };

  const handleSaveResolution = () => {
    if (!selectedTicket) return;

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'Resolved',
          resolvedNote: resolutionText,
        };
      }
      return t;
    });

    setTickets(updated);
    localStorage.setItem('bank_customer_tickets', JSON.stringify(updated));
    message.success(`Ticket ${selectedTicket.id} marked as RESOLVED! Notification updated on customer portal.`);
    setResolveModalOpen(false);
  };

  const pendingCount = tickets.filter(t => t.status === 'Pending').length;

  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <b style={{ color: '#1677ff', fontFamily: 'monospace' }}>{id}</b>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{r.username}</div>
          <small style={{ color: '#888' }}>Account #{r.accountID}</small>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (c) => <Tag color="blue">{c}</Tag>,
    },
    {
      title: 'Subject & Details',
      key: 'details',
      render: (_, r) => (
        <div style={{ maxWidth: 320 }}>
          <div style={{ fontWeight: 600, color: '#333' }}>{r.subject}</div>
          <small style={{ color: '#666', display: 'block', marginTop: 2 }}>{r.description}</small>
          {r.resolvedNote && (
            <div style={{ marginTop: 6, padding: '4px 8px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, fontSize: '0.8rem', color: '#389e0d' }}>
              <b>Resolution:</b> {r.resolvedNote}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (p) => (
        <Tag color={p === 'High' ? 'red' : p === 'Medium' ? 'orange' : 'green'} style={{ fontWeight: 700 }}>
          {p}
        </Tag>
      ),
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
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.status === 'Pending' ? (
          <Button
            type="primary"
            size="middle"
            onClick={() => handleOpenResolve(record)}
            style={{ borderRadius: 8, background: '#52c41a', borderColor: '#52c41a', fontWeight: 600 }}
          >
            Resolve Issue
          </Button>
        ) : (
          <Button
            size="middle"
            onClick={() => handleOpenResolve(record)}
            style={{ borderRadius: 8 }}
          >
            Update Note
          </Button>
        )
      ),
    },
  ];

  return (
    <div style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#1a1a2e', fontSize: '1.6rem' }}>
            🎧 Customer Complaints & Helpdesk Desk
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            Review, investigate, and resolve grievances raised by customers across all branches.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Tag color="volcano" style={{ fontSize: '0.9rem', padding: '6px 14px', borderRadius: 10, fontWeight: 700 }}>
            {pendingCount} PENDING ACTION
          </Tag>
          <Button icon={<ReloadOutlined />} onClick={loadAllTickets} style={{ borderRadius: 8 }}>
            Refresh
          </Button>
        </div>
      </div>

      <Card style={{ borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #e8e8e8' }}>
        <Table
          dataSource={tickets}
          rowKey="id"
          columns={columns}
          pagination={{ pageSize: 6 }}
        />
      </Card>

      {/* Resolution Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SafetyCertificateOutlined style={{ color: '#52c41a', fontSize: '1.3rem' }} />
            <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>
              Resolve Customer Grievance ({selectedTicket?.id})
            </span>
          </div>
        }
        open={resolveModalOpen}
        onCancel={() => setResolveModalOpen(false)}
        onOk={handleSaveResolution}
        okText="Mark as Resolved & Notify Customer"
        okButtonProps={{ style: { background: '#52c41a', borderColor: '#52c41a', fontWeight: 600, borderRadius: 6 } }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
        width={600}
      >
        {selectedTicket && (
          <div style={{ padding: '10px 0' }}>
            <div style={{ background: '#fafafa', padding: '14px', borderRadius: 10, marginBottom: 16, border: '1px solid #eee' }}>
              <div style={{ fontWeight: 700, color: '#1677ff' }}>{selectedTicket.subject}</div>
              <div style={{ fontSize: '0.88rem', color: '#555', marginTop: 4 }}>{selectedTicket.description}</div>
              <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#888' }}>
                Customer: <b>{selectedTicket.username}</b> | Account: <b>#{selectedTicket.accountID}</b> | Priority: <b>{selectedTicket.priority}</b>
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 }}>
                Official Bank Resolution Note (Visible to Customer):
              </label>
              <TextArea
                rows={4}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Explain the resolution actions taken (e.g., Refund processed, card unblocked, statement sent)..."
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
