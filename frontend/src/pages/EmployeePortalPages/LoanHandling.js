import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge } from 'antd';
import { FileAddOutlined, UnorderedListOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

export default function LoanHandling(props) {
  const navigate = useNavigate();

  const actions = [
    { title: 'Register New Loan', icon: <FileAddOutlined />, path: 'loan-register', color: '#1677ff', desc: 'Apply for a new physical loan for a customer.' },
    { title: 'Loan List', icon: <UnorderedListOutlined />, path: 'loan-list', color: '#722ed1', desc: 'View all loans and their current status.' },
  ];

  if (props.role === 'manager') {
    actions.push({
      title: 'Loan Approval', 
      icon: <SafetyCertificateOutlined />, 
      path: 'loan-approval', 
      color: '#f5222d', 
      desc: 'Review and approve/reject pending loans.',
      badge: 'Manager Only'
    });
  }

  return (
    <div style={{ padding: '28px' }}>
      <h2 style={{ marginBottom: 24, fontWeight: 800, color: '#1a1a2e', fontSize: '1.6rem' }}>💳 Loan Management</h2>
      <Row gutter={[20, 20]}>
        {actions.map((action, i) => (
          <Col xs={24} sm={12} md={8} key={i}>
            <Badge.Ribbon text={action.badge} color="red" style={{ display: action.badge ? 'block' : 'none', fontWeight: 700 }}>
              <Card
                hoverable
                onClick={() => navigate(action.path)}
                style={{
                  borderRadius: 16,
                  height: '100%',
                  boxShadow: `0 8px 24px ${action.color}25`,
                  border: `1.5px solid ${action.color}40`,
                  background: `linear-gradient(135deg, #ffffff 0%, ${action.color}08 100%)`,
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: action.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    marginBottom: 16,
                    boxShadow: `0 6px 16px ${action.color}50`,
                  }}
                >
                  {action.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{action.title}</h3>
                <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.5 }}>{action.desc}</p>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
    </div>
  );
}
