import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, message, Statistic, Alert, Space, Input, Radio } from 'antd';
import {
  AlertOutlined, SafetyCertificateOutlined, CheckCircleOutlined,
  StopOutlined, PhoneOutlined, UnlockOutlined, EyeOutlined,
  ExclamationCircleOutlined, SyncOutlined, LockOutlined
} from '@ant-design/icons';
import {
  getSecurityAlerts,
  freezeAccount,
  unfreezeAccount,
  subscribeToFreezeUpdates
} from '../../utils/security';

export default function SecurityAlertsHandling() {
  const [alerts, setAlerts] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  
  // Officer manual lock form
  const [lockUsername, setLockUsername] = useState('AnjulaRox');
  const [lockAccountId, setLockAccountId] = useState('1001');
  const [lockReason, setLockReason] = useState('Customer Reported Lost Phone / SIM Card');

  useEffect(() => {
    loadAlerts();
    const unsubscribe = subscribeToFreezeUpdates(() => {
      loadAlerts();
    });
    return unsubscribe;
  }, []);

  const loadAlerts = () => {
    try {
      const stored = getSecurityAlerts();
      if (stored.length === 0) {
        // Seed past resolved incident for realistic audit trail without fake active freeze
        const seed = [
          {
            id: 'FRZ-108422',
            customerName: 'AnjulaRox',
            accountID: '1001',
            reason: 'Suspicious ATM Withdrawal Attempt (Blocked)',
            timestamp: '30 Sep 2026, 11:20 AM',
            severity: 'MEDIUM',
            status: 'UNFROZEN',
            actionTaken: 'Customer contacted branch, verified identity, and restored normal status.'
          }
        ];
        localStorage.setItem('bank_security_alerts', JSON.stringify(seed));
        setAlerts(seed);
      } else {
        setAlerts(stored);
      }
    } catch (e) {
      setAlerts([]);
    }
  };

  const handleAdminUnfreeze = (incident) => {
    Modal.confirm({
      title: `Authorize Admin Unfreeze for Account #${incident.accountID}?`,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `You are about to lift the security freeze on customer "${incident.customerName}". Ensure you have verified customer identity through official branch protocol.`,
      okText: 'Confirm & Unfreeze',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: () => {
        unfreezeAccount({
          username: incident.customerName,
          incidentId: incident.id,
          actor: 'ADMIN',
          remarks: 'Branch Officer authorized emergency unfreeze after identity verification.'
        });
        loadAlerts();
        message.success(`Account #${incident.accountID} (${incident.customerName}) unfrozen successfully. Normal banking restored.`);
      }
    });
  };

  const handleOfficerFreeze = () => {
    if (!lockUsername.trim()) {
      message.error('Please enter a valid customer username');
      return;
    }

    freezeAccount({
      username: lockUsername.trim(),
      accountID: lockAccountId.trim() || '1001',
      reason: lockReason,
      actor: 'ADMIN'
    });

    setIsLockModalOpen(false);
    loadAlerts();
    message.error({
      content: `?? Emergency Freeze enforced on customer "${lockUsername}" by Branch Officer!`,
      duration: 5
    });
  };

  const handleContactCustomer = (incident) => {
    Modal.info({
      title: `?? Security Protocol: Contact Customer ${incident.customerName}`,
      content: (
        <div style={{ marginTop: 12 }}>
          <p>Customer Account: <b>#{incident.accountID}</b></p>
          <p>Registered Mobile: <b>+91 98765 43210 (Verified)</b></p>
          <p>Reported Compromise Reason: <b style={{ color: '#cf1322' }}>{incident.reason}</b></p>
          <Alert
            type="info"
            message="Branch SOP Guidance"
            description="Call customer from registered bank phone line. Never ask for full ATM PIN or password. Verify last 3 genuine transactions before lifting security restrictions."
            style={{ borderRadius: 8, marginTop: 10 }}
          />
        </div>
      )
    });
  };

  const activeFreezes = alerts.filter(a => a.status === 'FROZEN').length;
  const totalIncidents = alerts.length;
  const resolvedCount = alerts.filter(a => a.status === 'UNFROZEN').length;

  const columns = [
    {
      title: 'Incident ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <b style={{ fontFamily: 'monospace', color: '#1677ff' }}>{id}</b>
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name, r) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{name}</div>
          <small style={{ color: '#888' }}>Account #{r.accountID}</small>
        </div>
      )
    },
    {
      title: 'Reported Compromise',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => (
        <span style={{ fontWeight: 600, color: '#cf1322' }}>
          ?? {reason}
        </span>
      )
    },
    {
      title: 'Reported Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => <span style={{ color: '#666', fontSize: '0.85rem' }}>{time}</span>
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (sev) => <Tag color="red" style={{ fontWeight: 700, borderRadius: 6 }}>{sev || 'CRITICAL'}</Tag>
    },
    {
      title: 'Current Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={status === 'FROZEN' ? 'error' : 'success'}
          style={{ fontWeight: 800, padding: '2px 10px', borderRadius: 10 }}
        >
          {status === 'FROZEN' ? '?? ACTIVE FREEZE' : '? RESTORED'}
        </Tag>
      )
    },
    {
      title: 'Audit Actions',
      key: 'actions',
      render: (_, r) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => { setSelectedIncident(r); setIsDetailModalOpen(true); }}
          >
            Details
          </Button>
          <Button
            size="small"
            icon={<PhoneOutlined />}
            onClick={() => handleContactCustomer(r)}
          >
            Contact
          </Button>
          {r.status === 'FROZEN' && (
            <Button
              size="small"
              type="primary"
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
              icon={<UnlockOutlined />}
              onClick={() => handleAdminUnfreeze(r)}
            >
              Unfreeze
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1a1a2e' }}>
            ?? Fraud & Security Emergency Alerts
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.9rem' }}>
            Real-time Core Banking Security Lockdown Monitor & Customer Fraud Prevention Audit
          </p>
        </div>
        <Space>
          <Button
            type="primary"
            danger
            icon={<LockOutlined />}
            onClick={() => setIsLockModalOpen(true)}
            style={{ borderRadius: 8, fontWeight: 700 }}
          >
            ?? Lock Customer Account (Branch Action)
          </Button>
          <Button icon={<SyncOutlined />} onClick={loadAlerts} style={{ borderRadius: 8 }}>
            Refresh Feeds
          </Button>
        </Space>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 24 }}>
        <Card style={{ borderRadius: 12, border: '1px solid #ffd591', background: '#fffbe6' }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Active Frozen Accounts</span>}
            value={activeFreezes}
            prefix={<StopOutlined style={{ color: '#f5222d' }} />}
            valueStyle={{ color: '#f5222d', fontWeight: 800 }}
          />
        </Card>
        <Card style={{ borderRadius: 12, border: '1px solid #d6e4ff', background: '#f0f5ff' }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Total Incidents Logged</span>}
            value={totalIncidents}
            prefix={<AlertOutlined style={{ color: '#1677ff' }} />}
            valueStyle={{ color: '#1677ff', fontWeight: 800 }}
          />
        </Card>
        <Card style={{ borderRadius: 12, border: '1px solid #b7eb8f', background: '#f6ffed' }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Identity Verified / Restored</span>}
            value={resolvedCount}
            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a', fontWeight: 800 }}
          />
        </Card>
        <Card style={{ borderRadius: 12, border: '1px solid #ffccc7', background: '#fff1f0' }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Zero-Loss SLA Rating</span>}
            value="100%"
            prefix={<SafetyCertificateOutlined style={{ color: '#389e0d' }} />}
            valueStyle={{ color: '#389e0d', fontWeight: 800 }}
          />
        </Card>
      </div>

      {activeFreezes > 0 && (
        <Alert
          message={`${activeFreezes} Customer Account(s) Currently in Emergency Lockdown`}
          description="Customers have activated Emergency Freeze due to suspected card or credential compromise. All outgoing debits are currently blocked by system rules. Review customer accounts below."
          type="error"
          showIcon
          style={{ marginBottom: 20, borderRadius: 10 }}
        />
      )}

      {/* Incidents Table */}
      <Card style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
        <Table
          columns={columns}
          dataSource={alerts}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </Card>

      {/* Incident Detail Modal */}
      <Modal
        title={`??? Incident Audit: ${selectedIncident?.id}`}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedIncident && (
          <div style={{ padding: '10px 0' }}>
            <div style={{ background: '#fafafa', padding: 16, borderRadius: 10, border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div><b>Incident ID:</b> {selectedIncident.id}</div>
              <div><b>Customer:</b> {selectedIncident.customerName}</div>
              <div><b>Account Number:</b> #{selectedIncident.accountID}</div>
              <div><b>Reported Reason:</b> <Tag color="red">{selectedIncident.reason}</Tag></div>
              <div><b>Triggered At:</b> {selectedIncident.timestamp}</div>
              <div><b>System Enforced Action:</b> {selectedIncident.actionTaken}</div>
              <div><b>Current Status:</b> <Tag color={selectedIncident.status === 'FROZEN' ? 'error' : 'success'}>{selectedIncident.status}</Tag></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Officer Manual Freeze Modal */}
      <Modal
        title="?? Branch Officer: Enforce Emergency Account Freeze"
        open={isLockModalOpen}
        onCancel={() => setIsLockModalOpen(false)}
        onOk={handleOfficerFreeze}
        okText="Lock Account Immediately"
        okButtonProps={{ danger: true, icon: <LockOutlined /> }}
        width={550}
      >
        <div style={{ marginTop: 12 }}>
          <Alert
            type="warning"
            showIcon
            message="Branch Administrative Lockdown Action"
            description="This will instantly block all outgoing transactions, ATM withdrawals, NetBanking transfers, and virtual debit cards for the customer."
            style={{ marginBottom: 16, borderRadius: 8 }}
          />

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Customer Username:</label>
            <Input
              value={lockUsername}
              onChange={(e) => setLockUsername(e.target.value)}
              placeholder="e.g. AnjulaRox"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Account Number:</label>
            <Input
              value={lockAccountId}
              onChange={(e) => setLockAccountId(e.target.value)}
              placeholder="e.g. 1001"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Select Compromise Reason:</label>
            <Radio.Group
              value={lockReason}
              onChange={(e) => setLockReason(e.target.value)}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <Radio value="Customer Reported Lost Phone / SIM Card">?? Customer Reported Lost Phone / SIM Card</Radio>
              <Radio value="Unauthorized Debit / Card Skimming">?? Unauthorized Debit / Card Skimming</Radio>
              <Radio value="Phishing / Malware Compromise">?? Phishing / Malware Compromise</Radio>
              <Radio value="Suspected CBS Credential Leak">?? Suspected CBS Credential Leak</Radio>
              <Radio value="Branch Manager Security Order">??? Branch Manager Security Order</Radio>
            </Radio.Group>
          </div>
        </div>
      </Modal>
    </div>
  );
}
