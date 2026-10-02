import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import { SwapOutlined, UnorderedListOutlined } from '@ant-design/icons';

export default function TransactionHandling() {
  const navigate = useNavigate();

  const actions = [
    { title: 'New Transaction', icon: <SwapOutlined />, path: 'transaction-newTransaction', color: '#1677ff', desc: 'Process a new transfer between accounts.' },
    { title: 'Transaction List', icon: <UnorderedListOutlined />, path: 'transaction-list', color: '#722ed1', desc: 'View complete transaction history.' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: 24 }}>💸 Transaction Management</h2>
      <Row gutter={[16, 16]}>
        {actions.map((action, i) => (
          <Col xs={24} sm={12} md={8} key={i}>
            <Card
              hoverable
              onClick={() => navigate(action.path)}
              style={{ borderRadius: 12, height: '100%', borderTop: `4px solid ${action.color}` }}
            >
              <div style={{ fontSize: '2rem', color: action.color, marginBottom: 12 }}>
                {action.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{action.title}</h3>
              <p style={{ color: '#888' }}>{action.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
