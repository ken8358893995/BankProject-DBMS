import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout, Menu, Button, Card, Statistic, Badge, Tag, Avatar, Divider, Modal, Table, InputNumber, Select
} from 'antd';
import {
  UserOutlined,
  BankOutlined,
  CreditCardOutlined,
  DollarOutlined,
  SwapOutlined,
  TeamOutlined,
  BarChartOutlined,
  LogoutOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  SafetyOutlined,
  FileDoneOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CustomerServiceOutlined,
  AlertOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

import CustomerHandling from './EmployeePortalPages/CustomerHandling';
import AccountHandling from './EmployeePortalPages/AccountHandling';
import LoanHandling from './EmployeePortalPages/LoanHandling';
import WithdrawalHandling from './EmployeePortalPages/WithdrawalHandling';
import DepositHandling from './EmployeePortalPages/DepositHandling';
import TransactionHandling from './EmployeePortalPages/TransactionHandling';
import EmployeeHandling from './EmployeePortalPages/EmployeeHandling';
import ManagerReports from './EmployeePortalPages/ManagerReportsHandling';
import BranchHandling from './EmployeePortalPages/BranchHandling';
import HelpdeskHandling from './EmployeePortalPages/HelpdeskHandling';
import SecurityAlertsHandling from './EmployeePortalPages/SecurityAlertsHandling';
import { getSecurityAlerts, subscribeToFreezeUpdates } from '../utils/security';
import { customerLogout } from '../api/auth';
import Logo from './Images/Logo2.png';

const { Sider, Content, Footer, Header } = Layout;

function DashboardHome({ role, onNavigateTab, activeFreezesCount = 0 }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('userName') || 'Employee';

  // State for Forex & Roster Modals
  const [forexModalOpen, setForexModalOpen] = useState(false);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [convertAmount, setConvertAmount] = useState(100);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const forexRates = [
    { currency: 'USD', name: 'US Dollar', flag: '🇺🇸', buy: 83.45, sell: 83.95, change: '+0.12%' },
    { currency: 'EUR', name: 'Euro', flag: '🇪🇺', buy: 90.15, sell: 90.80, change: '-0.05%' },
    { currency: 'GBP', name: 'British Pound', flag: '🇬🇧', buy: 106.30, sell: 107.10, change: '+0.25%' },
    { currency: 'AED', name: 'UAE Dirham', flag: '🇦🇪', buy: 22.72, sell: 22.95, change: '0.00%' },
    { currency: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', buy: 62.40, sell: 62.90, change: '+0.18%' },
    { currency: 'JPY', name: 'Japanese Yen (100)', flag: '🇯🇵', buy: 53.20, sell: 53.85, change: '-0.30%' },
  ];

  const currentRate = forexRates.find(r => r.currency === selectedCurrency)?.buy || 83.45;
  const convertedInr = (convertAmount * currentRate).toFixed(2);

  const staffRoster = [
    { key: '1', name: 'Anjula Rajapakse', role: 'Chief Teller', shift: 'Morning (08:30 - 15:30)', counter: 'Counter 01', status: 'On Duty' },
    { key: '2', name: 'Cabral De Silva', role: 'Customer Relations', shift: 'Morning (08:30 - 15:30)', counter: 'Desk 03', status: 'On Duty' },
    { key: '3', name: 'Ranil Wickrema', role: 'Branch Manager', shift: 'Full Day (09:00 - 18:00)', counter: 'Manager Cabin', status: 'Active' },
    { key: '4', name: 'Kasun Bandara', role: 'Loan Officer', shift: 'Evening (12:00 - 19:30)', counter: 'Desk 05', status: 'Upcoming' },
    { key: '5', name: 'Dilani Perera', role: 'Vault Officer', shift: 'Morning (08:00 - 16:00)', counter: 'Cash Vault', status: 'On Duty' },
  ];

  const stats = [
    { title: 'Customers', value: 'Manage', icon: <UserOutlined />, color: '#1677ff', desc: 'Register & view customers', action: null },
    { title: 'Accounts', value: 'Manage', icon: <BankOutlined />, color: '#722ed1', desc: 'Savings, Current, FD accounts', action: null },
    { title: 'Loans', value: 'Manage', icon: <CreditCardOutlined />, color: '#f5222d', desc: 'Physical & online loans', action: null },
    { title: 'Transactions', value: 'Manage', icon: <SwapOutlined />, color: '#52c41a', desc: 'Deposits, Withdrawals & transfers', action: null },
  ];

  const quickActions = [
    { label: '🚨 Security & Fraud Desk', icon: <AlertOutlined />, isTab: true, tabKey: 'security', color: '#cf1322' },
    { label: 'Register Customer', icon: <PlusOutlined />, path: 'customer-register', color: '#1677ff' },
    { label: 'Register Account', icon: <BankOutlined />, path: 'account-register', color: '#722ed1' },
    { label: 'New Deposit', icon: <DollarOutlined />, path: 'deposit-newDeposit', color: '#52c41a' },
    { label: 'New Withdrawal', icon: <DollarOutlined />, path: 'withdrawal-newWithdrawal', color: '#fa8c16' },
    { label: 'Register Loan', icon: <CreditCardOutlined />, path: 'loan-register', color: '#f5222d' },
    { label: 'New Transaction', icon: <SwapOutlined />, path: 'transaction-newTransaction', color: '#13c2c2' },
    { label: 'Customer List', icon: <UnorderedListOutlined />, path: 'customer-list', color: '#1677ff' },
    { label: 'Account List', icon: <UnorderedListOutlined />, path: 'account-list', color: '#722ed1' },
  ];

  const managerActions = [
    { label: 'Loan Approval', icon: <SafetyOutlined />, path: 'loan-approval', color: '#f5222d' },
    { label: 'Transaction Report', icon: <BarChartOutlined />, path: 'transaction-report', color: '#1677ff' },
    { label: 'Loan Report', icon: <FileDoneOutlined />, path: 'loan-report', color: '#52c41a' },
    { label: 'Branch Management', icon: <TeamOutlined />, path: 'branch', color: '#fa8c16' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Banner - Royal Customer-Portal Matching Gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #1d39c4 0%, #722ed1 50%, #eb2f96 100%)',
        borderRadius: 20,
        padding: '30px 36px',
        color: 'white',
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 14px 30px rgba(114,46,209,0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '15%',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }} />
        <div style={{ zIndex: 1 }}>
          <Tag color="gold" style={{ borderRadius: 10, fontWeight: 700, padding: '2px 10px', marginBottom: 8 }}>
            ● SECURE BANK INTRANET
          </Tag>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.9rem', fontWeight: 800 }}>
            Hello, <b>{username}</b>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: 6, fontSize: '1.05rem' }}>
            {role === 'manager' ? '🏅 Branch Executive Manager — Full Administrative Rights' : '👔 Senior Bank Teller — Customer & Account Operations'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', zIndex: 1 }}>
          <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: 14, backdropFilter: 'blur(5px)' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', letterSpacing: 1 }}>BRANCH SYSTEM DATE</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </div>
          <Avatar size={68} icon={<UserOutlined />} style={{ backgroundColor: '#ffffff', color: '#722ed1', fontSize: '2rem', boxShadow: '0 6px 16px rgba(0,0,0,0.2)' }} />
        </div>
      </div>

      {/* Prominent Real-time Security & Fraud Monitor Bar */}
      <div style={{
        background: activeFreezesCount > 0 ? '#fff1f0' : '#f0f5ff',
        border: `2px solid ${activeFreezesCount > 0 ? '#ff4d4f' : '#adc6ff'}`,
        borderRadius: 16,
        padding: '16px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: activeFreezesCount > 0 ? '0 4px 14px rgba(255,77,79,0.18)' : '0 2px 8px rgba(22,119,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: activeFreezesCount > 0 ? '#ff4d4f' : '#1677ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.5rem',
            boxShadow: activeFreezesCount > 0 ? '0 0 12px rgba(255,77,79,0.5)' : 'none'
          }}>
            <AlertOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: activeFreezesCount > 0 ? '#cf1322' : '#1d39c4' }}>
              {activeFreezesCount > 0
                ? `🚨 ACTIVE SECURITY ALERT: ${activeFreezesCount} Account(s) Under Emergency Freeze!`
                : '🛡️ Core Banking Security & Fraud Prevention Center'}
            </div>
            <div style={{ color: '#555', fontSize: '0.88rem', marginTop: 2 }}>
              {activeFreezesCount > 0
                ? 'Customers or branch staff have initiated lockdown. Outgoing transfers auto-blocked. Immediate review required.'
                : 'Zero active unauthorized breaches. Emergency lockdown & customer identity verification online.'}
            </div>
          </div>
        </div>
        <Button
          type="primary"
          danger={activeFreezesCount > 0}
          size="large"
          icon={<SafetyCertificateOutlined />}
          onClick={() => onNavigateTab && onNavigateTab('security')}
          style={{
            borderRadius: 10,
            fontWeight: 800,
            height: 44,
            padding: '0 24px',
            background: activeFreezesCount > 0 ? '#cf1322' : '#1677ff',
            boxShadow: activeFreezesCount > 0 ? '0 4px 12px rgba(207,19,34,0.3)' : '0 4px 12px rgba(22,119,255,0.2)'
          }}
        >
          {activeFreezesCount > 0 ? '🚨 Open Fraud Desk Now →' : '🛡️ Open Security & Fraud Monitor →'}
        </Button>
      </div>

      {/* 4 Key Summary Stats Cards - Matching Customer Portal grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 28 }}>
        <Card style={{ borderRadius: 16, border: '1px solid #d6e4ff', background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)', boxShadow: '0 4px 14px rgba(22,119,255,0.08)' }} hoverable>
          <Statistic
            title={<span style={{ fontWeight: 600, color: '#555' }}>Total Customers</span>}
            value={1240}
            prefix={<UserOutlined style={{ color: '#1677ff', marginRight: 6 }} />}
            valueStyle={{ color: '#1677ff', fontWeight: 800, fontSize: '1.7rem' }}
          />
          <div style={{ fontSize: '0.8rem', color: '#52c41a', marginTop: 4, fontWeight: 600 }}>▲ +18 new this week</div>
        </Card>

        <Card style={{ borderRadius: 16, border: '1px solid #efdbff', background: 'linear-gradient(180deg, #f9f0ff 0%, #ffffff 100%)', boxShadow: '0 4px 14px rgba(114,46,209,0.08)' }} hoverable>
          <Statistic
            title={<span style={{ fontWeight: 600, color: '#555' }}>Active Accounts</span>}
            value={1895}
            prefix={<BankOutlined style={{ color: '#722ed1', marginRight: 6 }} />}
            valueStyle={{ color: '#722ed1', fontWeight: 800, fontSize: '1.7rem' }}
          />
          <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 4 }}>Savings & FD Portfolios</div>
        </Card>

        <Card style={{ borderRadius: 16, border: '1px solid #ffd8bf', background: 'linear-gradient(180deg, #fff2e8 0%, #ffffff 100%)', boxShadow: '0 4px 14px rgba(250,140,22,0.08)' }} hoverable>
          <Statistic
            title={<span style={{ fontWeight: 600, color: '#555' }}>Branch Vault Reserve</span>}
            value="42.8M"
            prefix={<DollarOutlined style={{ color: '#fa8c16', marginRight: 6 }} />}
            suffix="Rs."
            valueStyle={{ color: '#fa8c16', fontWeight: 800, fontSize: '1.7rem' }}
          />
          <div style={{ fontSize: '0.8rem', color: '#52c41a', marginTop: 4, fontWeight: 600 }}>● Reconciled Healthy</div>
        </Card>

        <Card style={{ borderRadius: 16, border: '1px solid #b7eb8f', background: 'linear-gradient(180deg, #f6ffed 0%, #ffffff 100%)', boxShadow: '0 4px 14px rgba(82,196,26,0.08)' }} hoverable>
          <Statistic
            title={<span style={{ fontWeight: 600, color: '#555' }}>CBS Core Server</span>}
            value="ONLINE"
            prefix={<SafetyOutlined style={{ color: '#52c41a', marginRight: 6 }} />}
            valueStyle={{ color: '#52c41a', fontWeight: 800, fontSize: '1.7rem' }}
          />
          <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 4 }}>2FA Audit Guard Active</div>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: 24, flexWrap: 'wrap' }}>
        {/* Left Column - Main Content */}
        <div style={{ flex: 2, minWidth: 320 }}>

          {/* Quick Actions */}
          <Card 
            title={<span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a2e' }}>⚡ Staff Quick Operations</span>} 
            style={{ borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #e8e8e8' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  size='large'
                  type='primary'
                  icon={action.icon}
                  onClick={() => action.isTab ? (onNavigateTab && onNavigateTab(action.tabKey)) : navigate(action.path)}
                  style={{
                    height: 56,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    boxShadow: `0 4px 14px ${action.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>
          
          {/* Manager Only Actions */}
          {role === 'manager' && (
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#722ed1' }}>🏅 Branch Manager Controls</span>
                  <Tag color='gold' style={{ fontSize: '0.85rem', padding: '3px 12px', borderRadius: 10, fontWeight: 700 }}>
                    AUTHORIZED ONLY
                  </Tag>
                </div>
              }
              style={{ borderRadius: 16, marginTop: 24, boxShadow: '0 8px 24px rgba(114,46,209,0.12)', border: '1px solid #d3adf7' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                {managerActions.map((action, i) => (
                  <Button
                    key={i}
                    size='large'
                    type='primary'
                    icon={action.icon}
                    onClick={() => navigate(action.path)}
                    style={{
                      height: 56,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      boxShadow: `0 4px 14px ${action.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Widgets */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Notice Board */}
          <Card 
            title={<span style={{ fontWeight: 700, color: '#cf1322' }}>📌 Urgent Branch Broadcasts</span>} 
            style={{ borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }} 
            bodyStyle={{ padding: '12px 24px' }}
          >
            <div style={{ padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
              <Tag color="red" style={{ fontWeight: 700, borderRadius: 8 }}>CRITICAL MAINTENANCE</Tag>
              <div style={{ marginTop: 8, fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>Core Banking Ledger Sync</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: 2 }}>Daily audit snapshot tonight at 02:00 AM IST.</div>
            </div>
            <div style={{ padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
              <Tag color="purple" style={{ fontWeight: 700, borderRadius: 8 }}>POLICY UPDATE</Tag>
              <div style={{ marginTop: 8, fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>FD Collateral Loan Cap</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: 2 }}>Online Loan limit updated to max 60% of FD balance.</div>
            </div>
            <div style={{ padding: '14px 0' }}>
              <Tag color="green" style={{ fontWeight: 700, borderRadius: 8 }}>SYSTEM ACTIVE</Tag>
              <div style={{ marginTop: 8, fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>2FA Mail Server Enabled</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: 2 }}>All employee and customer logins protected by OTP.</div>
            </div>
          </Card>

          {/* Quick Tools */}
          <Card 
            title={<span style={{ fontWeight: 700, color: '#1677ff' }}>🧮 Fast Teller Utilities</span>} 
            style={{ borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
          >
             <Button 
               block 
               size="large" 
               onClick={() => setForexModalOpen(true)}
               style={{ 
                 marginBottom: 12, 
                 height: 50, 
                 borderRadius: 10, 
                 background: '#f0f5ff', 
                 borderColor: '#adc6ff', 
                 color: '#1677ff', 
                 fontWeight: 700 
               }}
             >
               💱 Live Forex & Exchange Rates
             </Button>
             <Button 
               block 
               size="large" 
               onClick={() => setRosterModalOpen(true)}
               style={{ 
                 marginBottom: 12, 
                 height: 50, 
                 borderRadius: 10, 
                 background: '#f9f0ff', 
                 borderColor: '#d3adf7', 
                 color: '#722ed1', 
                 fontWeight: 700 
               }}
             >
               📅 Staff Duty & Shift Roster
             </Button>
             <Button 
               block 
               size="large" 
               onClick={() => {
                 import('jspdf').then(jspdf => {
                   import('jspdf-autotable').then(() => {
                     const doc = new jspdf.jsPDF();
                     doc.setFontSize(22);
                     doc.setTextColor(22, 119, 255);
                     doc.text('ARUCI BANK', 14, 20);

                     doc.setFontSize(14);
                     doc.setTextColor(0, 0, 0);
                     doc.text('BRANCH DAILY AUDIT & BALANCE SETTLEMENT REPORT', 14, 30);

                     doc.setFontSize(9);
                     doc.setTextColor(100, 100, 100);
                     doc.text(`Report Date: ${new Date().toLocaleDateString()} | Generated By: ${username} (${role === 'manager' ? 'Branch Manager' : 'Staff Teller'})`, 14, 38);
                     doc.text('Branch Code: BR-001 | CBS Version: v4.2.0 | Security Hash: #SEC-984210', 14, 44);

                     doc.autoTable({
                       startY: 52,
                       head: [['Category / Transaction Type', 'Count', 'Volume In (Rs.)', 'Volume Out (Rs.)', 'Net Settlement']],
                       body: [
                         ['Cash Deposits (Over-The-Counter)', '48', '1,450,000', '-', '+1,450,000'],
                         ['Cash Withdrawals (Branch Counter)', '32', '-', '680,000', '-680,000'],
                         ['Online Inter-Bank Transfers', '116', '3,890,000', '3,420,000', '+470,000'],
                         ['Fixed Deposit Inflows (5-Yr)', '8', '850,000', '-', '+850,000'],
                         ['Collateral Loan Disbursements', '3', '-', '450,000', '-450,000'],
                         ['Total Branch Vault Movement', '207', '6,190,000', '4,550,000', '+1,640,000 (SURPLUS)'],
                       ],
                       theme: 'striped',
                       headStyles: { fillColor: [22, 119, 255], fontStyle: 'bold' }
                     });

                     const finalY = doc.lastAutoTable.finalY + 20;
                     doc.setFontSize(10);
                     doc.setTextColor(50, 50, 50);
                     doc.text('AUDIT & COMPLIANCE CERTIFICATION:', 14, finalY);
                     doc.setFontSize(9);
                     doc.setTextColor(100, 100, 100);
                     doc.text('All transaction ledgers and physical vault balances reconcile with Central Core Banking System.', 14, finalY + 8);

                     doc.setTextColor(0, 0, 0);
                     doc.text('Verified By (Teller/Officer): ___________________', 14, finalY + 28);
                     doc.text('Authorized By (Branch Manager): ___________________', 110, finalY + 28);

                     doc.save(`Branch_Audit_Settlement_${new Date().toISOString().slice(0,10)}.pdf`);
                   });
                 });
               }}
               style={{ 
                 height: 50, 
                 borderRadius: 10, 
                 background: '#f6ffed', 
                 borderColor: '#b7eb8f', 
                 color: '#52c41a', 
                 fontWeight: 700 
               }}
             >
               📑 Generate Branch Day-End PDF
             </Button>
          </Card>
        </div>
      </div>

      {/* Live Forex Exchange Rates & Converter Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>💱</span>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1677ff' }}>Live Central Bank Forex & Treasury Desk</span>
            <Tag color="green" style={{ marginLeft: 'auto', borderRadius: 10, fontWeight: 700 }}>● LIVE MARKET</Tag>
          </div>
        }
        open={forexModalOpen}
        onCancel={() => setForexModalOpen(false)}
        footer={null}
        width={720}
      >
        <div style={{ padding: '10px 0' }}>
          {/* Quick Converter Widget */}
          <Card style={{ marginBottom: 20, borderRadius: 12, background: 'linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 100%)', border: '1px solid #adc6ff' }}>
            <div style={{ fontWeight: 700, color: '#1677ff', marginBottom: 10, fontSize: '0.95rem' }}>
              ⚡ Teller Currency Conversion Calculator
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <small style={{ color: '#666' }}>Foreign Currency:</small>
                <Select
                  value={selectedCurrency}
                  onChange={setSelectedCurrency}
                  style={{ width: '100%', marginTop: 4 }}
                  size="large"
                >
                  {forexRates.map(r => (
                    <Select.Option key={r.currency} value={r.currency}>
                      {r.flag} {r.currency} - {r.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div style={{ flex: 1, minWidth: 140 }}>
                <small style={{ color: '#666' }}>Amount to Exchange:</small>
                <InputNumber
                  min={1}
                  max={1000000}
                  value={convertAmount}
                  onChange={setConvertAmount}
                  style={{ width: '100%', marginTop: 4 }}
                  size="large"
                />
              </div>

              <div style={{ flex: 1.2, minWidth: 180, background: '#fff', padding: '8px 14px', borderRadius: 8, border: '1px solid #d9d9d9' }}>
                <small style={{ color: '#888' }}>Payout in Rupees (LKR/INR):</small>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#52c41a' }}>
                  Rs. {Number(convertedInr).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>

          {/* Rates Table */}
          <Table
            dataSource={forexRates}
            rowKey="currency"
            pagination={false}
            columns={[
              {
                title: 'Currency',
                key: 'currency',
                render: (_, r) => (
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    <span style={{ fontSize: '1.2rem', marginRight: 8 }}>{r.flag}</span>
                    {r.currency} <span style={{ color: '#888', fontWeight: 400, fontSize: '0.85rem' }}>({r.name})</span>
                  </span>
                ),
              },
              {
                title: 'Bank Buy (Rs.)',
                dataIndex: 'buy',
                key: 'buy',
                render: (v) => <b style={{ color: '#1677ff' }}>Rs. {v.toFixed(2)}</b>,
              },
              {
                title: 'Bank Sell (Rs.)',
                dataIndex: 'sell',
                key: 'sell',
                render: (v) => <b style={{ color: '#722ed1' }}>Rs. {v.toFixed(2)}</b>,
              },
              {
                title: '24h Trend',
                dataIndex: 'change',
                key: 'change',
                render: (ch) => (
                  <Tag color={ch.startsWith('+') ? 'green' : ch.startsWith('-') ? 'red' : 'default'} style={{ fontWeight: 700 }}>
                    {ch}
                  </Tag>
                ),
              },
            ]}
          />
        </div>
      </Modal>

      {/* Staff Duty & Shift Roster Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>📅</span>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#722ed1' }}>Branch Staff Duty Roster & Counter Allocation</span>
          </div>
        }
        open={rosterModalOpen}
        onCancel={() => setRosterModalOpen(false)}
        footer={null}
        width={700}
      >
        <div style={{ padding: '10px 0' }}>
          <Table
            dataSource={staffRoster}
            pagination={false}
            columns={[
              {
                title: 'Employee Name',
                dataIndex: 'name',
                key: 'name',
                render: (t) => <b style={{ color: '#1a1a2e' }}>{t}</b>,
              },
              {
                title: 'Designation',
                dataIndex: 'role',
                key: 'role',
                render: (r) => <Tag color="blue">{r}</Tag>,
              },
              {
                title: 'Assigned Counter',
                dataIndex: 'counter',
                key: 'counter',
                render: (c) => <span style={{ fontWeight: 600 }}>{c}</span>,
              },
              {
                title: 'Shift Timings',
                dataIndex: 'shift',
                key: 'shift',
              },
              {
                title: 'Duty Status',
                dataIndex: 'status',
                key: 'status',
                render: (s) => (
                  <Tag color={s === 'On Duty' ? 'green' : s === 'Active' ? 'purple' : 'orange'} style={{ fontWeight: 700, borderRadius: 10 }}>
                    {s}
                  </Tag>
                ),
              },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}

export default function EmployeeHome() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeContent, setActiveContent] = useState('dashboard');
  const [role] = useState(localStorage.getItem('role'));
  const [activeFreezesCount, setActiveFreezesCount] = useState(0);
  const navigate = useNavigate();
  const username = localStorage.getItem('userName') || 'Employee';

  const updateBadgeCount = () => {
    try {
      const alerts = getSecurityAlerts();
      const count = alerts.filter(a => a.status === 'FROZEN').length;
      setActiveFreezesCount(count);
    } catch (e) {}
  };

  useEffect(() => {
    updateBadgeCount();
    const unsubscribe = subscribeToFreezeUpdates(updateBadgeCount);
    return unsubscribe;
  }, [activeContent]);

  const menuItems = [
    { key: 'dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
    {
      key: 'security',
      icon: <AlertOutlined style={{ color: activeFreezesCount > 0 ? '#ff4d4f' : '#faad14', fontSize: '1.15rem' }} />,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ fontWeight: 800, color: activeFreezesCount > 0 ? '#ff7875' : '#ffffff' }}>
            🚨 Security & Fraud
          </span>
          {activeFreezesCount > 0 ? (
            <Badge count={activeFreezesCount} size="small" style={{ backgroundColor: '#ff4d4f', boxShadow: '0 0 8px #ff4d4f' }} />
          ) : (
            <Tag color="cyan" style={{ fontSize: '0.65rem', margin: 0, padding: '0 4px', borderRadius: 4, fontWeight: 700 }}>GUARD</Tag>
          )}
        </span>
      )
    },
    { key: 'customer', icon: <UserOutlined />, label: 'Customers' },
    { key: 'account', icon: <BankOutlined />, label: 'Accounts' },
    { key: 'loan', icon: <CreditCardOutlined />, label: 'Loans' },
    { key: 'withdrawal', icon: <DollarOutlined />, label: 'Withdrawals' },
    { key: 'deposit', icon: <DollarOutlined />, label: 'Deposits' },
    { key: 'transaction', icon: <SwapOutlined />, label: 'Transactions' },
    { key: 'helpdesk', icon: <CustomerServiceOutlined />, label: 'Helpdesk & Complaints' },
    ...(role === 'manager' ? [
      { type: 'divider' },
      { key: 'branch', icon: <BankOutlined />, label: 'Branches' },
      { key: 'employee', icon: <TeamOutlined />, label: 'Employees' },
      { key: 'reports', icon: <BarChartOutlined />, label: 'Reports' },
    ] : []),
  ];

  const renderContent = () => {
    switch (activeContent) {
      case 'dashboard': return <DashboardHome role={role} onNavigateTab={setActiveContent} activeFreezesCount={activeFreezesCount} />;
      case 'security': return <SecurityAlertsHandling />;
      case 'customer': return <CustomerHandling />;
      case 'account': return <AccountHandling />;
      case 'loan': return <LoanHandling role={role} />;
      case 'withdrawal': return <WithdrawalHandling />;
      case 'deposit': return <DepositHandling />;
      case 'transaction': return <TransactionHandling />;
      case 'helpdesk': return <HelpdeskHandling />;
      case 'branch': return <BranchHandling role={role} />;
      case 'employee': return <EmployeeHandling />;
      case 'reports': return <ManagerReports />;
      default: return <DashboardHome role={role} onNavigateTab={setActiveContent} activeFreezesCount={activeFreezesCount} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar - Elegant Deep Indigo Gradient */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={245}
        style={{
          background: 'linear-gradient(180deg, #101935 0%, #1d2a44 100%)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
          zIndex: 100
        }}
        trigger={null}
      >
        {/* Logo in sidebar */}
        <div style={{ padding: '20px 16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img src={Logo} alt='logo' style={{ height: 38, cursor: 'pointer', filter: 'brightness(0) invert(1)' }} onClick={() => navigate('/')} />
          {!collapsed && (
            <div style={{ color: '#1677ff', fontSize: '0.8rem', marginTop: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Staff Intranet
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          <Menu
            theme='dark'
            mode='inline'
            selectedKeys={[activeContent]}
            style={{ background: 'transparent', borderRight: 0, padding: '0 8px' }}
            items={menuItems}
            onClick={({ key }) => setActiveContent(key)}
          />
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>ACCESS LEVEL</div>
              <Tag color={role === 'manager' ? 'gold' : 'blue'} style={{ margin: 0, fontWeight: 700, padding: '2px 10px', borderRadius: 8 }}>
                {role === 'manager' ? '🏅 Branch Manager' : '👔 Staff Officer'}
              </Tag>
            </div>
          </div>
        )}
      </Sider>

      <Layout>
        {/* Top Header */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 60,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '1.1rem' }}
            />
            <span style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '1rem' }}>
              {activeContent.charAt(0).toUpperCase() + activeContent.slice(1)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
            <span style={{ fontWeight: 500, color: '#444' }}>{username}</span>
            <Divider type='vertical' />
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={() => customerLogout().then(() => navigate('/employeeLogin', { replace: true }))}
            >
              Logout
            </Button>
          </div>
        </Header>

        {/* Main Content */}
        <Content style={{ background: '#f5f7fa', minHeight: 'calc(100vh - 100px)' }}>
          {renderContent()}
        </Content>

        <Footer style={{ textAlign: 'center', background: '#1a1a2e', color: 'rgba(255,255,255,0.5)', padding: '12px' }}>
          ARUCI Bank ©2024 | Employee Management System
        </Footer>
      </Layout>
    </Layout>
  );
}
