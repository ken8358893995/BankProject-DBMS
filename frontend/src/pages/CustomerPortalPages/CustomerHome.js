import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Statistic, Tag, Table, Tabs, Badge, Empty, Tooltip, message, Dropdown, Avatar, Alert } from 'antd';
import {
  BankOutlined, DollarOutlined, CreditCardOutlined, LineChartOutlined,
  SwapOutlined, LogoutOutlined, UserOutlined, PlusCircleOutlined,
  BulbOutlined, ClockCircleOutlined, CopyOutlined, GiftOutlined,
} from '@ant-design/icons';
import { getCustomerAccounts } from '../../api/accounts';
import { getCustomerFDs } from '../../api/fd';
import { getCustomerPhysicalLoans } from '../../api/physloans';
import { getCustomerOnlineLoans } from '../../api/onlineloans';
import { customerLogout } from '../../api/auth';
import EmiCalculator from '../../components/EmiCalculator';
import NotificationBell from '../../components/NotificationBell';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import ScrollToTop from '../../components/ScrollToTop';
import VirtualDebitCard from '../../components/VirtualDebitCard';
import BankingChatbot from '../../components/BankingChatbot';
import KycVerificationModal from '../../components/KycVerificationModal';
import LoyaltyRewardWidget from '../../components/LoyaltyRewardWidget';
import CustomerSupportModal from '../../components/CustomerSupportModal';
import FinancialInsightsWidget from '../../components/FinancialInsightsWidget';
import EmergencyFreezeModal from '../../components/EmergencyFreezeModal';
import { isUserFrozen, subscribeToFreezeUpdates } from '../../utils/security';
import { useTimeGreeting, useSessionTimer } from '../../utils/hooks';
import Logo from '../Images/Logo2.png';
import './CustomerHome.css';

const { TabPane } = Tabs;

export default function CustomerHome() {
  const [accounts, setAccounts] = React.useState([]);
  const [fds, setFDs] = React.useState([]);
  const [oloans, setOLoans] = React.useState([]);
  const [ploans, setPloans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [isEmergencyFrozen, setIsEmergencyFrozen] = React.useState(false);

  const navigate = useNavigate();
  const username = localStorage.getItem('userName') || 'Customer';
  const greeting = useTimeGreeting();
  const sessionTimer = useSessionTimer();

  React.useEffect(() => {
    setIsEmergencyFrozen(isUserFrozen(username));
    const unsubscribe = subscribeToFreezeUpdates(() => {
      setIsEmergencyFrozen(isUserFrozen(username));
    });
    return unsubscribe;
  }, [username]);

  React.useEffect(() => {
    Promise.all([
      getCustomerAccounts().catch(() => []),
      getCustomerFDs().catch(() => []),
      getCustomerPhysicalLoans().catch(() => []),
      getCustomerOnlineLoans().catch(() => []),
    ]).then(([accs, fdsData, ploansData, oloansData]) => {
      setAccounts(accs || []);
      setFDs(fdsData || []);
      setPloans(ploansData || []);
      setOLoans(oloansData || []);
      setLoading(false);
    });
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.Balance || 0), 0);
  const totalFDAmount = fds.reduce((sum, fd) => sum + (fd.Amount || 0), 0);
  const totalLoans = (ploans.length || 0) + (oloans.length || 0);

  // Account table columns
  const accountColumns = [
    {
      title: 'Account ID',
      dataIndex: 'AccountID',
      key: 'AccountID',
      render: (id) => (
        <span>
          {id}{' '}
          <Tooltip title='Copy Account Number'>
            <CopyOutlined
              style={{ cursor: 'pointer', color: '#1677ff' }}
              onClick={() => {
                navigator.clipboard.writeText(String(id));
                message.success('Account number copied!');
              }}
            />
          </Tooltip>
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'TypeID',
      key: 'TypeID',
      render: (type) => (
        <Tag color={type === 'SA' ? 'blue' : 'green'}>
          {type === 'SA' ? 'Savings' : 'Current'}
        </Tag>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'Balance',
      key: 'Balance',
      render: (bal) => <b style={{ color: '#1677ff' }}>Rs. {bal?.toLocaleString()}</b>,
    },
    { title: 'Branch ID', dataIndex: 'BranchID', key: 'BranchID' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type='link' onClick={() => navigate(`account/${record.AccountID}`)}>
          View Details →
        </Button>
      ),
    },
  ];

  // FD table columns
  const fdColumns = [
    { title: 'FD ID', dataIndex: 'AccountID', key: 'AccountID' },
    { title: 'Type', dataIndex: 'TypeID', key: 'TypeID', render: (t) => <Tag color='purple'>{t}</Tag> },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
      render: (amt) => <b style={{ color: '#722ed1' }}>Rs. {amt?.toLocaleString()}</b>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type='link' onClick={() => navigate(`fixedDeposits/${record.AccountID}`)}>
          View →
        </Button>
      ),
    },
  ];

  // Online Loan columns
  const oLoanColumns = [
    { title: 'Loan ID', dataIndex: 'LoanID', key: 'LoanID' },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
      render: (amt) => <span style={{ color: '#f5222d' }}>Rs. {amt?.toLocaleString()}</span>,
    },
    { title: 'Duration', dataIndex: 'Duration', key: 'Duration', render: (d) => `${d} months` },
    { title: 'Interest', dataIndex: 'InterestRate', key: 'InterestRate', render: (r) => `${r}%` },
    {
      title: 'Status',
      dataIndex: 'Approved',
      key: 'Approved',
      render: (approved) => (
        <Badge
          status={approved ? 'success' : 'processing'}
          text={approved ? 'Approved' : 'Pending'}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type='link' onClick={() => navigate(`onlineLoans/${record.LoanID}`)}>
          View →
        </Button>
      ),
    },
  ];

  // Physical Loan columns
  const pLoanColumns = [
    { title: 'Loan ID', dataIndex: 'LoanID', key: 'LoanID' },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
      render: (amt) => <span style={{ color: '#f5222d' }}>Rs. {amt?.toLocaleString()}</span>,
    },
    { title: 'Duration', dataIndex: 'Duration', key: 'Duration', render: (d) => `${d} months` },
    { title: 'Interest', dataIndex: 'InterestRate', key: 'InterestRate', render: (r) => `${r}%` },
    {
      title: 'Status',
      dataIndex: 'Approved',
      key: 'Approved',
      render: (approved) => (
        <Badge
          status={approved ? 'success' : 'processing'}
          text={approved ? 'Approved' : 'Pending'}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type='link' onClick={() => navigate(`physicalLoans/${record.LoanID}`)}>
          View →
        </Button>
      ),
    },
  ];

  return (
    <div className='customer-portal' style={ darkMode ? { filter: 'invert(0.9) hue-rotate(180deg)' } : {} }>
      <ScrollToTop />
      {/* Clean Top Navbar */}
      <div className='cp-navbar' style={{ padding: '12px 36px', background: '#ffffff', borderBottom: '1px solid #edf2f9' }}>
        <img className='aruci--logo' src={Logo} alt='logo' onClick={() => navigate('/')} style={{ height: 40, cursor: 'pointer' }} />

        {/* Profile Pill & Primary Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {sessionTimer && (
            <Tooltip title='Session expires in'>
              <Tag icon={<ClockCircleOutlined />} color='blue' style={{ fontSize: '0.85rem', padding: '3px 10px', borderRadius: 12 }}>
                {sessionTimer}
              </Tag>
            </Tooltip>
          )}

          <NotificationBell />

          {/* Profile Dropdown with Logout */}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'user-info',
                  label: (
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 800, color: '#1a1a2e', fontSize: '1rem' }}>NetBanking Customer</div>
                      <small style={{ color: '#52c41a' }}>● Verified Online Banking User</small>
                    </div>
                  ),
                  disabled: true,
                },
                { type: 'divider' },
                {
                  key: 'transfer',
                  icon: <SwapOutlined />,
                  label: 'Online Fund Transfer',
                  onClick: () => navigate('onlineBanking'),
                },
                {
                  key: 'loan',
                  icon: <PlusCircleOutlined />,
                  label: 'Apply for Loan',
                  onClick: () => navigate('onlineLoan'),
                },
                { type: 'divider' },
                {
                  key: 'logout',
                  danger: true,
                  icon: <LogoutOutlined />,
                  label: 'Sign Out / Logout',
                  onClick: () => customerLogout().then(() => navigate('/customerLogin', { replace: true })),
                },
              ]
            }}
            placement="bottomRight"
            arrow
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '5px 14px', borderRadius: 24, background: '#f0f5ff', border: '1.5px solid #d6e4ff' }}>
              <Avatar size={30} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#1677ff', fontSize: '0.88rem', lineHeight: 1.2 }}>My Account ▾</div>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Sub-Header: Professional Banking Portal Header & Options */}
      <div style={{
        padding: '20px 36px 16px 36px',
        background: '#ffffff',
        borderBottom: '1px solid #edf2f9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.3px' }}>
              Customer NetBanking Portal
            </h2>
            <p style={{ margin: '3px 0 10px 0', color: '#666', fontSize: '0.88rem' }}>
              ARUCI Bank Core Digital Banking — Overview & Financial Portfolio
            </p>
          </div>
          <div>
            {isEmergencyFrozen ? (
              <Tag color="error" style={{ fontSize: '0.85rem', padding: '6px 14px', borderRadius: 20, fontWeight: 800, border: '2px solid #ff4d4f' }}>
                🚨 ACCOUNT UNDER EMERGENCY FREEZE
              </Tag>
            ) : (
              <Tag color="success" style={{ fontSize: '0.82rem', padding: '4px 12px', borderRadius: 20, fontWeight: 700 }}>
                🛡️ 24x7 Fraud Shield Protected
              </Tag>
            )}
          </div>
        </div>

        {/* All options organized neatly directly underneath the greeting name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 10, borderTop: '1px solid #f0f3f8' }}>
          <EmergencyFreezeModal username={username} accounts={accounts} onStatusChange={(f) => setIsEmergencyFrozen(f)} />
          <KycVerificationModal username={username} />
          <CustomerSupportModal username={username} accounts={accounts} />
          <EmiCalculator />
          <ChangePasswordModal />
          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <Button
              icon={<BulbOutlined />}
              onClick={() => setDarkMode(!darkMode)}
              style={{ borderRadius: 8 }}
            >
              {darkMode ? 'Light' : 'Dark'}
            </Button>
          </Tooltip>
          <Button type="primary" icon={<SwapOutlined />} onClick={() => navigate('onlineBanking')} style={{ borderRadius: 8, fontWeight: 600 }}>
            Transfer
          </Button>
          <Button icon={<PlusCircleOutlined />} onClick={() => navigate('onlineLoan')} style={{ borderRadius: 8, fontWeight: 600, borderColor: '#eb2f96', color: '#eb2f96' }}>
            Apply Loan
          </Button>
        </div>
      </div>

      <div className='cp-content'>
        {/* Active Emergency Freeze Alert Banner */}
        {isEmergencyFrozen && (
          <Alert
            message={<b style={{ fontSize: '1.05rem', color: '#cf1322' }}>🚨 EMERGENCY SECURITY FREEZE ACTIVE</b>}
            description="Your account is in security lockdown due to suspected compromise. All outgoing transfers and card payments are blocked. Scheduled payments are on hold. Click 'ACCOUNT FROZEN (MANAGE)' above to review standing payments or complete 2FA Identity Verification to restore access."
            type="error"
            showIcon
            style={{
              marginBottom: 24,
              borderRadius: 14,
              border: '2px solid #ff4d4f',
              background: '#fff1f0',
              padding: '16px 20px'
            }}
          />
        )}
        {/* Summary Stats */}
        <div className='cp-stats-row'>
          <Card className='cp-stat-card'>
            <Statistic
              title='Total Balance'
              value={totalBalance}
              prefix={<DollarOutlined style={{ color: '#1677ff' }} />}
              suffix='Rs.'
              valueStyle={{ color: '#1677ff', fontSize: '1.6rem' }}
            />
            <p style={{ color: '#888', marginTop: 4 }}>{accounts.length} account(s)</p>
          </Card>
          <Card className='cp-stat-card'>
            <Statistic
              title='Fixed Deposits'
              value={totalFDAmount}
              prefix={<BankOutlined style={{ color: '#722ed1' }} />}
              suffix='Rs.'
              valueStyle={{ color: '#722ed1', fontSize: '1.6rem' }}
            />
            <p style={{ color: '#888', marginTop: 4 }}>{fds.length} active FD(s)</p>
          </Card>
          <Card className='cp-stat-card'>
            <Statistic
              title='Active Loans'
              value={totalLoans}
              prefix={<CreditCardOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d', fontSize: '1.6rem' }}
            />
            <p style={{ color: '#888', marginTop: 4 }}>{oloans.length} online + {ploans.length} physical</p>
          </Card>
          <Card className='cp-stat-card'>
            <Statistic
              title='Online Banking'
              value='Active'
              prefix={<LineChartOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '1.6rem' }}
            />
            <p style={{ color: '#888', marginTop: 4 }}>24/7 secure access</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title='⚡ Quick Actions' className='cp-quick-actions' style={{ marginBottom: 24 }}>
          <div className='cp-actions-grid'>
            <Button size='large' icon={<SwapOutlined />} type='primary' onClick={() => navigate('onlineBanking')}>
              Online Transfer
            </Button>
            <Button size='large' icon={<PlusCircleOutlined />} onClick={() => navigate('onlineLoan')}>
              Apply for Loan
            </Button>
            <Button size='large' icon={<BankOutlined />} onClick={() => navigate('fixedDeposits/1')}>
              View Fixed Deposits
            </Button>
            <Button size='large' icon={<UserOutlined />} onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button 
              size='large' 
              danger 
              icon={<LogoutOutlined />} 
              onClick={() => customerLogout().then(() => navigate('/customerLogin', { replace: true }))}
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>

      {/* Virtual Debit Card Showcase */}
      <div style={{ padding: '0 32px' }}>
        <VirtualDebitCard 
          accountNumber={accounts[0]?.AccountID} 
          accountHolder={username}
          isEmergencyFrozen={isEmergencyFrozen}
        />
      </div>

      {/* Main Tabs and Offers Section */}
      <div style={{ display: 'flex', gap: '24px', padding: '0 32px' }}>
        <div style={{ flex: 3, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card>
            <Tabs defaultActiveKey='1' size='large'>
              <TabPane tab={<span>🏦 My Accounts <Badge count={accounts.length} showZero style={{ backgroundColor: '#1677ff', marginLeft: 6 }} /></span>} key='1'>
                {accounts.length === 0 && !loading ? (
                  <Empty description='No accounts found' />
                ) : (
                  <Table columns={accountColumns} dataSource={accounts} rowKey='AccountID' loading={loading} pagination={false} />
                )}
              </TabPane>
              <TabPane tab={<span>📈 Fixed Deposits <Badge count={fds.length} showZero style={{ backgroundColor: '#722ed1', marginLeft: 6 }} /></span>} key='2'>
                {fds.length === 0 && !loading ? (
                  <Empty description='No fixed deposits found' />
                ) : (
                  <Table columns={fdColumns} dataSource={fds} rowKey='AccountID' loading={loading} pagination={false} />
                )}
              </TabPane>
              <TabPane tab={<span>💳 Online Loans <Badge count={oloans.length} showZero style={{ backgroundColor: '#f5222d', marginLeft: 6 }} /></span>} key='3'>
                {oloans.length === 0 && !loading ? (
                  <Empty description='No online loans found'>
                    <Button type='primary' onClick={() => navigate('onlineLoan')}>Apply for Loan</Button>
                  </Empty>
                ) : (
                  <Table columns={oLoanColumns} dataSource={oloans} rowKey='LoanID' loading={loading} pagination={false} />
                )}
              </TabPane>
              <TabPane tab={<span>🏛️ Physical Loans <Badge count={ploans.length} showZero style={{ backgroundColor: '#fa8c16', marginLeft: 6 }} /></span>} key='4'>
                {ploans.length === 0 && !loading ? (
                  <Empty description='No physical loans found' />
                ) : (
                  <Table columns={pLoanColumns} dataSource={ploans} rowKey='LoanID' loading={loading} pagination={false} />
                )}
              </TabPane>
            </Tabs>
          </Card>

          {/* Shifted to fill the empty space: Monthly Cash Flow & Bank Special Schemes side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Monthly Financial Health & Cash Flow */}
            <FinancialInsightsWidget totalBalance={totalBalance} accounts={accounts} fds={fds} />

            {/* Bank Special Schemes & Offers */}
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#fa8c16' }}>
                    <GiftOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                    Bank Special Schemes & Offers
                  </span>
                  <Tag color="gold" style={{ borderRadius: 10, fontWeight: 700 }}>
                    EXCLUSIVE
                  </Tag>
                </div>
              }
              style={{
                borderRadius: 16,
                border: '1px solid #ffd591',
                background: 'linear-gradient(180deg, #fffbe6 0%, #ffffff 100%)',
                boxShadow: '0 6px 20px rgba(250, 140, 22, 0.07)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 12, border: '1px solid #ffe58f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fa8c16' }}>High-Yield 12% p.a. FD</div>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#666' }}>5-Year tenure guaranteed high return.</p>
                  </div>
                  <Button size="small" type="primary" style={{ background: '#fa8c16', borderColor: '#fa8c16', borderRadius: 6, fontWeight: 600 }} onClick={() => navigate('fixedDeposits/1')}>
                    Claim 12%
                  </Button>
                </div>

                <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 12, border: '1px solid #d6e4ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1677ff' }}>Pre-Approved Instant Loan</div>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#666' }}>Up to Rs. 5,00,000 against active FDs.</p>
                  </div>
                  <Button size="small" type="primary" style={{ borderRadius: 6, fontWeight: 600 }} onClick={() => navigate('onlineLoan')}>
                    Apply Loan
                  </Button>
                </div>

                <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 12, border: '1px solid #b7eb8f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#389e0d' }}>Zero Fee Platinum Card</div>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#666' }}>Active on your 24x7 Virtual Debit Card.</p>
                  </div>
                  <Tag color="green" style={{ borderRadius: 6, fontWeight: 700 }}>ACTIVE</Tag>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Rewards & Perks */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <LoyaltyRewardWidget username={username} totalBalance={totalBalance} />
        </div>
      </div>

      {/* Interactive AI Banking Assistant Chatbot */}
      <BankingChatbot username={username} accounts={accounts} fds={fds} />

      {/* Footer */}
      <div className='cp-footer' style={{ marginTop: 40 }}>
        <p>ARUCI Bank ©2024 | Secure Banking Portal</p>
      </div>
    </div>
  );
}
