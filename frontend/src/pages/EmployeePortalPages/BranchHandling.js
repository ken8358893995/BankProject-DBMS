import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge } from 'antd';
import { EnvironmentOutlined, UnorderedListOutlined } from '@ant-design/icons';

export default function BranchHandling(props) {
  const navigate = useNavigate();

  const actions = [
    { title: 'Branch List', icon: <UnorderedListOutlined />, path: 'branch-list', color: '#722ed1', desc: 'View all bank branches and locations.' },
  ];

  if (props.role === 'manager') {
    actions.unshift({
      title: 'Register New Branch', 
      icon: <EnvironmentOutlined />, 
      path: 'branch-register', 
      color: '#1677ff', 
      desc: 'Add a new bank branch to the system.',
      badge: 'Manager Only'
    });
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: 24 }}>🏢 Branch Management</h2>
      <Row gutter={[16, 16]}>
        {actions.map((action, i) => (
          <Col xs={24} sm={12} md={8} key={i}>
            <Badge.Ribbon text={action.badge} color="red" style={{ display: action.badge ? 'block' : 'none' }}>
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
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
    </div>
  );
}
