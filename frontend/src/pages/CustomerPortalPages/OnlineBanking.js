import { useState, useEffect } from 'react';
import { getAccounts } from '../../api/accounts';
import { getDebitTransactions, getCreditTransactions, sendOtpEmail } from '../../api/transactions';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Card, Button, Modal, message, Table, Tag, Alert, Badge, Tooltip } from 'antd';
import { SafetyCertificateOutlined, AlertOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../../api/transactions';
import Logo from '../Images/Logo2.png';
import { isUserFrozen, subscribeToFreezeUpdates } from '../../utils/security';
import * as Yup from 'yup';
export default function OnlineBanking() {
  const [accounts, setAccounts] = useState([]);

  const navigate = useNavigate();

  const customerRegSchema = Yup.object().shape({
    myAccountID: Yup.string().required('Please select an account to transfer from'),
    toAccountID: Yup.string().required('Recipient account number is required'),
    amount: Yup.number().positive('Amount must be positive').required('Transfer amount is required'),
    remarks: Yup.string().required('Please enter a remark'),
    email: Yup.string().email('Invalid email format').required('Email is required to receive OTP'),
  });

  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [pendingValues, setPendingValues] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [txHistory, setTxHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const username = localStorage.getItem('userName') || 'Customer';
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    setIsFrozen(isUserFrozen(username));
    const unsubscribe = subscribeToFreezeUpdates(() => {
      setIsFrozen(isUserFrozen(username));
    });
    return unsubscribe;
  }, [username]);

  useEffect(() => {
    getAccounts().then(async (accs) => {
      setAccounts(accs);
      
      // Fetch history for all accounts
      let allTx = [];
      for (const acc of accs) {
        try {
          const debits = await getDebitTransactions(acc.AccountID);
          allTx = [...allTx, ...debits];
        } catch (e) {
          console.log('Error fetching debits', e);
        }
      }
      
      // Sort by latest first
      allTx.sort((a, b) => new Date(b.transactionTime) - new Date(a.transactionTime));
      setTxHistory(allTx);
      setLoadingHistory(false);
    });
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (isFrozen) {
      message.error('🚨 OUTGOING TRANSFER BLOCKED: Emergency Freeze is active on your account!');
      setSubmitting(false);
      return;
    }

    // Generate a 6-digit fake OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setPendingValues(values);
    
    message.loading({ content: 'Sending OTP to your email...', key: 'otp_msg' });
    try {
      const result = await sendOtpEmail(values.email, otp, values.amount);
      if (result.previewUrl) {
        Modal.info({
          title: '📧 Simulated Email Received',
          content: (
            <div style={{ marginTop: '10px' }}>
              <p style={{ marginBottom: 10 }}>Since the real Email Server is not configured, we intercepted the email sent to <b>{values.email}</b>.</p>
              <p style={{ color: '#888', marginBottom: 5 }}>Your One-Time Password is:</p>
              <div style={{ background: '#f5f5f5', padding: '10px', textAlign: 'center', fontSize: '28px', letterSpacing: '8px', fontWeight: 'bold', color: '#1677ff', borderRadius: '8px', border: '2px dashed #1677ff' }}>
                {result.otp}
              </div>
            </div>
          ),
          onOk: () => {
            setIsOtpVisible(true);
          }
        });
      } else {
        message.success({ content: `OTP has been sent to ${values.email}!`, key: 'otp_msg', duration: 4 });
        setIsOtpVisible(true);
      }
    } catch (e) {
      message.error({ content: 'Failed to send OTP. Please check your email configuration.', key: 'otp_msg', duration: 4 });
    }
    
    setSubmitting(false);
  };

  const handleOtpVerify = () => {
    if (userOtp !== generatedOtp) {
      message.error("Invalid OTP! Please try again.");
      return;
    }
    
    setIsTransferring(true);
    const transaction = {
      fromAccountID: pendingValues.myAccountID,
      toAccountID: pendingValues.toAccountID,
      amount: pendingValues.amount,
      remarks: pendingValues.remarks,
    };

    createTransaction(transaction).then(() => {
      setIsTransferring(false);
      setIsOtpVisible(false);
      message.success("Transaction Successful!");
      navigate('/customerPortal');
    }).catch(() => {
      setIsTransferring(false);
      message.error("Transaction failed!");
    });
  };

  let options = accounts.map((account) => (
    <option key={account.AccountID} value={account.AccountID}>
      {account.AccountID}
    </option>
  ));
  options = [
    <option key="default" value="" disabled>
      Choose Account
    </option>,
    ...options,
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)', paddingBottom: '40px' }}>
      <div className='navbar' style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', background: 'white' }}>
        <img
          className='aruci--logo'
          src={Logo}
          onClick={() => navigate('/customerPortal/')}
          alt='logo'
          style={{ cursor: 'pointer' }}
        />
        <h1 className='topic' style={{ margin: 0, color: '#1677ff' }}>Online Money Transfer</h1>
      </div>
      <Card 
        title={<span style={{ fontSize: '1.4rem', color: '#1677ff' }}>Send Money Securely</span>}
        style={{ width: 600, margin: '60px auto', borderRadius: 16, boxShadow: '0 10px 30px rgba(22,119,255,0.1)' }}
        headStyle={{ borderBottom: '2px solid #f0f0f0', padding: '20px 24px' }}
      >
        {isFrozen && (
          <Alert
            message="🚨 OUTGOING TRANSFERS TEMPORARILY BLOCKED"
            description={
              <div>
                Emergency Freeze is currently <b>ACTIVE</b> on your account to prevent unauthorized debits. All outgoing fund transfers and bill payments are disabled.
                <div style={{ marginTop: 8 }}>
                  To restore transactions, return to your <a onClick={() => navigate('/customerPortal')}>Customer Dashboard</a> and complete 2FA Identity Verification.
                </div>
              </div>
            }
            type="error"
            showIcon
            style={{ marginBottom: 20, borderRadius: 10, border: '1.5px solid #ff4d4f', background: '#fff1f0' }}
          />
        )}

        <Formik
          initialValues={{
            myAccountID: '',
            toAccountID: '',
            amount: '',
            remarks: '',
            email: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={customerRegSchema}
        >
          {(props) => {
            return (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 600, marginBottom: 8, color: '#555' }}>From Account (Your Account)</label>
                  <Field as='select' name='myAccountID' style={{ padding: '12px', borderRadius: 8, border: '1px solid #d9d9d9', fontSize: '16px', outline: 'none', background: '#fafafa' }}>
                    {options}
                  </Field>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 600, marginBottom: 8, color: '#555' }}>To Account (Recipient)</label>
                  <Field
                    type='text'
                    name='toAccountID'
                    placeholder='Enter recipient account number'
                    style={{ padding: '12px', borderRadius: 8, border: '1px solid #d9d9d9', fontSize: '16px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontWeight: 600, color: '#555', margin: 0 }}>Transfer Amount (Rs.)</label>
                    {/* Live AI Risk Assessment Badge */}
                    {props.values.amount > 0 && (
                      <Tag 
                        color={props.values.amount > 50000 ? 'red' : props.values.amount > 20000 ? 'orange' : 'green'}
                        style={{ borderRadius: 10, fontWeight: 700, padding: '2px 8px' }}
                      >
                        {props.values.amount > 50000 
                          ? '🚨 HIGH VALUE (2FA + AUDIT)' 
                          : props.values.amount > 20000 
                            ? '⚠️ MODERATE VALUE' 
                            : '🛡️ LOW RISK (FAST TRACK)'}
                      </Tag>
                    )}
                  </div>
                  <Field 
                    type='number' 
                    name='amount' 
                    placeholder='0.00' 
                    style={{ padding: '12px', borderRadius: 8, border: '1px solid #d9d9d9', fontSize: '16px', outline: 'none' }}
                  />
                  {props.values.amount > 50000 && (
                    <Alert
                      type="warning"
                      showIcon
                      message="RBI Anti-Money Laundering (AML) Compliance"
                      description="Transfers exceeding Rs. 50,000 require mandatory OTP two-factor authentication and are logged in the Central Manager Security Audit ledger."
                      style={{ marginTop: 8, borderRadius: 8, fontSize: '0.85rem' }}
                    />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 600, marginBottom: 8, color: '#555' }}>Remarks (Optional)</label>
                  <Field 
                    type='text' 
                    name='remarks' 
                    placeholder='E.g., Rent, Bill Payment, Gift' 
                    style={{ padding: '12px', borderRadius: 8, border: '1px solid #d9d9d9', fontSize: '16px', outline: 'none' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 600, marginBottom: 8, color: '#555' }}>Registered Email Address</label>
                  <Field 
                    type='email' 
                    name='email' 
                    placeholder='Enter email to receive OTP' 
                    style={{ padding: '12px', borderRadius: 8, border: '1px solid #d9d9d9', fontSize: '16px', outline: 'none' }}
                  />
                </div>

                <Button
                  type='primary'
                  size="large"
                  onClick={props.handleSubmit}
                  loading={props.isSubmitting}
                  disabled={isFrozen}
                  danger={isFrozen}
                  style={{ marginTop: '10px', height: '50px', borderRadius: '8px', fontSize: '16px', fontWeight: 600 }}
                >
                  {isFrozen ? '🔒 Outgoing Transfers Blocked (Freeze Active)' : 'Confirm Transfer'}
                </Button>

                {Object.values(props.touched).includes(true) && Object.values(props.errors).length !== 0 && (
                  <div style={{ padding: '12px', background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, color: '#ff4d4f' }}>
                    <ErrorMessage name='myAccountID' component="div" />
                    <ErrorMessage name='toAccountID' component="div" />
                    <ErrorMessage name='amount' component="div" />
                    <ErrorMessage name='remarks' component="div" />
                    <ErrorMessage name='email' component="div" />
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </Card>

      {/* OTP Verification Modal */}
      <Modal
        title={
          <div style={{ textAlign: 'center', fontSize: '1.4rem' }}>
            🔒 Two-Step Verification
          </div>
        }
        visible={isOtpVisible}
        onCancel={() => {
          setIsOtpVisible(false);
          setUserOtp('');
        }}
        footer={[
          <Button key="back" onClick={() => setIsOtpVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={isTransferring} onClick={handleOtpVerify}>
            Verify & Transfer
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            We've sent a 6-digit OTP to your registered email address.<br/>
            Please enter it below to authorize this transaction.
          </p>
          <input
            type="text"
            maxLength={6}
            value={userOtp}
            onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="• • • • • •"
            style={{
              fontSize: '2rem',
              letterSpacing: '10px',
              textAlign: 'center',
              width: '80%',
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid #1677ff',
              outline: 'none'
            }}
          />
        </div>
      </Modal>

      {/* Transaction History Section */}
      <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: '40px' }}>
        <Card 
          title={<span style={{ fontSize: '1.2rem', color: '#555' }}>Recent Transfers (Outgoing)</span>}
          style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <Table 
            dataSource={txHistory} 
            loading={loadingHistory}
            rowKey={(record) => record.TransactionID || record.transactionTime}
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: 'Date & Time',
                dataIndex: 'transactionTime',
                key: 'transactionTime',
                render: (time) => new Date(time).toLocaleString()
              },
              {
                title: 'From Account',
                dataIndex: 'fromAccount',
                key: 'fromAccount',
              },
              {
                title: 'To Account',
                dataIndex: 'toAccount',
                key: 'toAccount',
                render: (to) => <Tag color="blue">{to}</Tag>
              },
              {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
                render: (amt) => <span style={{ color: '#cf1322', fontWeight: 'bold' }}>- Rs. {amt?.toLocaleString()}</span>
              },
              {
                title: 'Remarks',
                dataIndex: 'remark',
                key: 'remark',
              },
              {
                title: 'Action',
                key: 'action',
                render: (_, record) => (
                  <Button 
                    type="link" 
                    onClick={() => {
                      import('jspdf').then(jspdf => {
                        import('jspdf-autotable').then(() => {
                          const doc = new jspdf.jsPDF();
                          doc.setFontSize(20);
                          doc.setTextColor(22, 119, 255);
                          doc.text('ARUCI Bank', 14, 22);
                          
                          doc.setFontSize(14);
                          doc.setTextColor(0, 0, 0);
                          doc.text('Transaction Receipt', 14, 32);
                          
                          doc.setFontSize(10);
                          doc.setTextColor(100, 100, 100);
                          doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);

                          doc.autoTable({
                            startY: 50,
                            head: [['Detail', 'Value']],
                            body: [
                              ['Transaction Time', new Date(record.transactionTime).toLocaleString()],
                              ['From Account', record.fromAccount],
                              ['To Account', record.toAccount],
                              ['Amount (Rs.)', record.amount?.toLocaleString()],
                              ['Remarks', record.remark || 'N/A'],
                            ],
                            theme: 'grid',
                            headStyles: { fillColor: [22, 119, 255] }
                          });
                          
                          doc.setFontSize(10);
                          doc.text('Thank you for banking with ARUCI Bank.', 14, doc.lastAutoTable.finalY + 20);
                          
                          doc.save(`Receipt_${record.fromAccount}_to_${record.toAccount}.pdf`);
                        });
                      });
                    }}
                  >
                    Receipt
                  </Button>
                )
              }
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
