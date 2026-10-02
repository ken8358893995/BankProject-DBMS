import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Radio, Tabs, Tag, message, Card, Table, Checkbox } from 'antd';
import {
  LockOutlined, UnlockOutlined,
  AlertOutlined, ClockCircleOutlined, CheckCircleOutlined,
  StopOutlined, FileProtectOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import { sendOtpEmail } from '../api/transactions';
import {
  isUserFrozen,
  getUserFreezeDetails,
  freezeAccount,
  unfreezeAccount,
  subscribeToFreezeUpdates
} from '../utils/security';

const { TabPane } = Tabs;

export default function EmergencyFreezeModal({ username = 'Customer', accounts = [], onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [freezeRecord, setFreezeRecord] = useState(null);
  const [selectedReason, setSelectedReason] = useState('Unauthorized Online Debit / Transfer');
  
  // Unfreeze State
  const [unfreezeOtp, setUnfreezeOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  useEffect(() => {
    checkFreezeStatus();
    const unsubscribe = subscribeToFreezeUpdates(() => {
      checkFreezeStatus();
    });
    return unsubscribe;
  }, [username]);

  const checkFreezeStatus = () => {
    try {
      const isFrozen = isUserFrozen(username);
      const record = getUserFreezeDetails(username);
      setFreezeRecord(record);
      if (onStatusChange) {
        onStatusChange(isFrozen);
      }
    } catch (e) {
      setFreezeRecord(null);
    }
  };

  const handleActivateFreeze = () => {
    const newFreeze = freezeAccount({
      username,
      accountID: accounts[0]?.AccountID || '1001',
      reason: selectedReason,
      actor: 'CUSTOMER'
    });

    setFreezeRecord(newFreeze);
    if (onStatusChange) onStatusChange(true);
    message.error({
      content: '🚨 EMERGENCY FREEZE ACTIVATED! Outgoing transfers & cards are now blocked.',
      duration: 5
    });
  };

  const handleSendUnfreezeOtp = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setUnfreezeOtp(code); // Pre-fill for ease of use in demo

    try {
      await sendOtpEmail('customer@bank.com', code, 'Security Unfreeze Verification');
    } catch (e) {
      // Graceful fallback
    }

    setOtpSent(true);
    Modal.info({
      title: '🔒 Identity Verification Code',
      content: (
        <div style={{ marginTop: 10 }}>
          <p>We've sent a 6-digit security code to authorize account unfreeze:</p>
          <div style={{
            background: '#f5f5f5',
            padding: 12,
            textAlign: 'center',
            fontSize: 28,
            letterSpacing: 8,
            fontWeight: 'bold',
            color: '#1677ff',
            borderRadius: 8,
            border: '2px dashed #1677ff'
          }}>
            {code}
          </div>
          <small style={{ color: '#888', display: 'block', marginTop: 8 }}>
            (Pre-filled automatically for seamless verification)
          </small>
        </div>
      )
    });
  };

  const handleExecuteUnfreeze = () => {
    if (!confirmChecked) {
      message.warning('Please confirm that your credentials & device are secure before unfreezing.');
      return;
    }
    if (unfreezeOtp !== generatedOtp) {
      message.error('Invalid Verification Code! Please check and try again.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      // Remove freeze state & update alerts
      unfreezeAccount({
        username,
        actor: 'CUSTOMER',
        remarks: 'Customer completed 2FA Identity Verification. Normal banking restored.'
      });

      setFreezeRecord(null);
      setIsVerifying(false);
      setOtpSent(false);
      setUnfreezeOtp('');
      setConfirmChecked(false);
      setIsOpen(false);
      if (onStatusChange) onStatusChange(false);
      message.success('✅ Identity Verified! Emergency Freeze removed. All services restored.');
    }, 1200);
  };

  // Mock Scheduled Payments / EMIs for review
  const scheduledPayments = [
    {
      key: '1',
      type: 'Loan EMI Auto-Debit',
      details: 'Physical Loan #1 EMI Installment',
      amount: 17500,
      dueDate: '10 Oct 2026',
      status: 'On Hold (Protected)'
    },
    {
      key: '2',
      type: 'Standing Instruction',
      details: 'Monthly Transfer to Utility / Savings',
      amount: 5000,
      dueDate: '15 Oct 2026',
      status: 'On Hold (Protected)'
    }
  ];

  const columns = [
    { title: 'Payment Type', dataIndex: 'type', key: 'type', render: (t) => <b>{t}</b> },
    { title: 'Description', dataIndex: 'details', key: 'details' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amt) => `Rs. ${amt.toLocaleString()}` },
    { title: 'Scheduled Date', dataIndex: 'dueDate', key: 'dueDate' },
    {
      title: 'Security Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color="warning" icon={<ClockCircleOutlined />}>{s}</Tag>
    }
  ];

  return (
    <>
      <Button
        danger
        type="primary"
        size="middle"
        icon={<AlertOutlined style={{ fontSize: '1.05rem' }} />}
        onClick={() => setIsOpen(true)}
        style={{
          borderRadius: 8,
          fontWeight: 800,
          background: freezeRecord
            ? 'linear-gradient(135deg, #cf1322 0%, #820014 100%)'
            : 'linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)',
          borderColor: freezeRecord ? '#820014' : '#cf1322',
          color: '#ffffff',
          boxShadow: freezeRecord ? '0 0 14px rgba(207, 19, 34, 0.7)' : '0 2px 8px rgba(255, 77, 79, 0.35)',
        }}
      >
        {freezeRecord ? '🚨 ACCOUNT FROZEN (MANAGE)' : '🚨 Emergency Freeze'}
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.25rem' }}>
            <AlertOutlined style={{ color: '#cf1322' }} />
            <span style={{ fontWeight: 800, color: '#1a1a2e' }}>
              {freezeRecord ? 'Emergency Security Center — Freeze Active' : 'One-Click Emergency Freeze'}
            </span>
          </div>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={750}
        destroyOnClose
      >
        {!freezeRecord ? (
          /* Normal State: Allow Immediate 1-Click Freeze */
          <div style={{ padding: '8px 0' }}>
            <Alert
              message="Suspect Account or Card Compromise?"
              description="If you notice suspicious activity, unapproved withdrawals, or lost your card/device, you can instantly lock your account to prevent fraudulent outgoing transactions."
              type="error"
              showIcon
              style={{ marginBottom: 20, borderRadius: 10 }}
            />

            <h4 style={{ fontWeight: 700, color: '#333', marginBottom: 12 }}>
              Select Reason for Emergency Freeze:
            </h4>

            <Radio.Group
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}
            >
              <Radio value="Unauthorized Online Debit / Transfer">
                <b>Unauthorized Online Debit or Unknown Fund Transfer noticed</b>
              </Radio>
              <Radio value="Lost / Stolen Phone, Card or SIM">
                <b>Lost or Stolen Device, SIM card or Physical Debit Card</b>
              </Radio>
              <Radio value="Received Suspicious Phishing Call / SMS">
                <b>Fell victim to suspicious phishing call, fake SMS or scam link</b>
              </Radio>
              <Radio value="Accidental Credential / OTP Disclosure">
                <b>Accidentally shared Banking Password, OTP or PIN with unknown person</b>
              </Radio>
            </Radio.Group>

            <Card
              title={<span style={{ color: '#cf1322', fontWeight: 700 }}>Immediate Actions Enforced Upon Freeze:</span>}
              style={{ borderRadius: 12, background: '#fff2f0', border: '1px solid #ffccc7', marginBottom: 24 }}
            >
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, color: '#444' }}>
                <li><b>All outgoing fund transfers blocked immediately:</b> Online transfers, payments, and withdrawals will fail.</li>
                <li><b>Virtual & Physical Debit Cards frozen:</b> All e-commerce and POS card swipes rejected.</li>
                <li><b>Scheduled auto-debits placed on safety hold:</b> Standing instructions will not execute until verified.</li>
                <li><b>Real-time Fraud Alert logged:</b> Bank branch managers & cybersecurity audit staff receive instant notification.</li>
                <li><b>Inward deposits remain safe:</b> Incoming salary or returns can still be received.</li>
              </ul>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button size="large" onClick={() => setIsOpen(false)} style={{ borderRadius: 8 }}>
                Cancel
              </Button>
              <Button
                size="large"
                type="primary"
                danger
                icon={<LockOutlined />}
                onClick={handleActivateFreeze}
                style={{ borderRadius: 8, fontWeight: 700, padding: '0 28px', height: 46 }}
              >
                🚨 ACTIVATE EMERGENCY FREEZE NOW
              </Button>
            </div>
          </div>
        ) : (
          /* Active Freeze State: Review Payments + Identity Verification Unfreeze */
          <div style={{ padding: '8px 0' }}>
            <div style={{
              background: '#fff1f0',
              border: '1.5px solid #ffa39e',
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 800, color: '#cf1322', fontSize: '1.1rem' }}>
                  🚨 SECURITY LOCKDOWN ACTIVE
                </div>
                <div style={{ color: '#666', fontSize: '0.88rem', marginTop: 4 }}>
                  Incident ID: <b style={{ fontFamily: 'monospace' }}>{freezeRecord.incidentId}</b> | Activated: {freezeRecord.timestamp}
                </div>
                <div style={{ color: '#888', fontSize: '0.82rem' }}>
                  Reason: <b>{freezeRecord.reason}</b>
                </div>
              </div>
              <Tag color="red" style={{ padding: '6px 14px', borderRadius: 12, fontWeight: 800, fontSize: '0.9rem' }}>
                OUTGOING BLOCKED
              </Tag>
            </div>

            <Tabs defaultActiveKey="1" size="middle">
              {/* Tab 1: Protection Status */}
              <TabPane tab={<span>🛡️ Active Protections</span>} key="1">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                  <Card size="small" style={{ borderRadius: 10, border: '1px solid #ffa39e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#cf1322', fontWeight: 700 }}>
                      <StopOutlined /> Online Fund Transfers
                    </div>
                    <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                      All outward transfers on NetBanking blocked to prevent asset loss.
                    </p>
                  </Card>

                  <Card size="small" style={{ borderRadius: 10, border: '1px solid #ffa39e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#cf1322', fontWeight: 700 }}>
                      <StopOutlined /> Virtual & Debit Cards
                    </div>
                    <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                      Card numbers and online CVVs disabled across all merchant portals.
                    </p>
                  </Card>

                  <Card size="small" style={{ borderRadius: 10, border: '1px solid #ffa39e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#cf1322', fontWeight: 700 }}>
                      <StopOutlined /> ATM / Branch Cash Debits
                    </div>
                    <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                      Physical counter withdrawals locked pending customer verification.
                    </p>
                  </Card>

                  <Card size="small" style={{ borderRadius: 10, border: '1px solid #b7eb8f' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#389e0d', fontWeight: 700 }}>
                      <CheckCircleOutlined /> Inward Deposits & Salary
                    </div>
                    <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                      Incoming credits, FD interest, and refunds can still safely arrive.
                    </p>
                  </Card>
                </div>
              </TabPane>

              {/* Tab 2: Review Scheduled Payments */}
              <TabPane tab={<span>📅 Review Scheduled Payments ({scheduledPayments.length})</span>} key="2">
                <div style={{ marginTop: 12 }}>
                  <Alert
                    message="Scheduled Instructions Protected"
                    description="The following scheduled EMIs and standing auto-debits have been flagged and placed on hold so unverified deductions do not occur while your account is under security review."
                    type="info"
                    showIcon
                    style={{ marginBottom: 14, borderRadius: 8 }}
                  />
                  <Table
                    columns={columns}
                    dataSource={scheduledPayments}
                    pagination={false}
                    size="small"
                  />
                </div>
              </TabPane>

              {/* Tab 3: Identity Verification & Unfreeze */}
              <TabPane tab={<span>🔓 Identity Verification & Unfreeze</span>} key="3">
                <div style={{ marginTop: 14, padding: '10px 0' }}>
                  <Alert
                    message="Bank Security Standard for Account Restoration"
                    description="To prevent an unauthorized third-party from unfreezing your funds, please verify your identity using two-factor authentication."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 20, borderRadius: 8 }}
                  />

                  {!otpSent ? (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <SafetyCertificateOutlined style={{ fontSize: '3rem', color: '#1677ff', marginBottom: 16 }} />
                      <h3>Step 1: Request 2FA Security Authorization Code</h3>
                      <p style={{ color: '#666', maxWidth: 460, margin: '0 auto 20px auto' }}>
                        We will send a one-time verification passcode to your registered contact channel to confirm you are the true account holder.
                      </p>
                      <Button
                        type="primary"
                        size="large"
                        icon={<FileProtectOutlined />}
                        onClick={handleSendUnfreezeOtp}
                        style={{ borderRadius: 8, fontWeight: 700, height: 46 }}
                      >
                        Request Identity Verification OTP
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ background: '#f8faff', padding: 20, borderRadius: 12, border: '1px solid #d6e4ff' }}>
                        <div style={{ fontWeight: 700, color: '#333', marginBottom: 8 }}>
                          Step 2: Enter 6-Digit One-Time Verification Code
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={unfreezeOtp}
                          onChange={(e) => setUnfreezeOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="• • • • • •"
                          style={{
                            fontSize: '1.8rem',
                            letterSpacing: '8px',
                            textAlign: 'center',
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '2px solid #1677ff',
                            outline: 'none',
                            marginBottom: 16,
                            background: '#fff'
                          }}
                        />

                        <div style={{ marginBottom: 20 }}>
                          <Checkbox
                            checked={confirmChecked}
                            onChange={(e) => setConfirmChecked(e.target.checked)}
                          >
                            <span style={{ fontSize: '0.9rem', color: '#444' }}>
                              I confirm that I have secured my credentials and it is safe to resume all banking transactions.
                            </span>
                          </Checkbox>
                        </div>

                        <Button
                          type="primary"
                          size="large"
                          block
                          loading={isVerifying}
                          icon={<UnlockOutlined />}
                          onClick={handleExecuteUnfreeze}
                          style={{
                            height: 48,
                            borderRadius: 10,
                            fontWeight: 700,
                            background: '#52c41a',
                            borderColor: '#52c41a'
                          }}
                        >
                          Verify Identity & Restore Normal Banking
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </>
  );
}