import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Card, Modal, message } from 'antd';
import { login } from '../../api/auth';
import { sendOtpEmail } from '../../api/transactions';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../Images/Logo2.png';

export default function EmployeeLogin() {
  const customerRegSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    email: Yup.string().email('Invalid email format').required('Email is required for 2FA OTP'),
  });

  const navigate = useNavigate();

  const [loginError, setLoginError] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    const loginDetails = {
      userName: values.username,
      password: values.password,
      role: 'employee',
    };
    
    login({ loginDetails })
      .then(async (response) => {
        if (response.auth === 'success') {
          message.loading({ content: 'Verifying credentials and sending OTP...', key: 'login_msg' });
          
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedOtp(otp);
          
          try {
            const result = await sendOtpEmail(values.email, otp, "Staff Portal Login");
            Modal.info({
              title: '🔒 Staff 2FA Verification Code',
              content: (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ marginBottom: 10 }}>One-Time Password for <b>{values.email}</b>:</p>
                  <div style={{ background: '#f5f5f5', padding: '10px', textAlign: 'center', fontSize: '28px', letterSpacing: '8px', fontWeight: 'bold', color: '#1677ff', borderRadius: '8px', border: '2px dashed #1677ff' }}>
                    {result?.otp || otp}
                  </div>
                  <p style={{ color: '#888', marginTop: 10, fontSize: '0.85rem' }}>Click OK to continue to verification.</p>
                </div>
              ),
              onOk: () => {
                setUserOtp(otp);
                setIsOtpVisible(true);
              }
            });
          } catch (e) {
            Modal.info({
              title: '🔒 Staff 2FA Verification Code',
              content: (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ marginBottom: 10 }}>Your 6-digit One-Time Password is:</p>
                  <div style={{ background: '#f5f5f5', padding: '10px', textAlign: 'center', fontSize: '28px', letterSpacing: '8px', fontWeight: 'bold', color: '#1677ff', borderRadius: '8px', border: '2px dashed #1677ff' }}>
                    {otp}
                  </div>
                </div>
              ),
              onOk: () => {
                setUserOtp(otp);
                setIsOtpVisible(true);
              }
            });
          }
        }
        setSubmitting(false);
      })
      .catch((error) => {
        message.error("Invalid Employee Credentials!");
        setLoginError(true);
        setSubmitting(false);
      });
  };

  const handleOtpVerify = () => {
    if (userOtp !== generatedOtp) {
      message.error("Invalid OTP! Please try again.");
      return;
    }
    setIsLoggingIn(true);
    message.success("Employee Login Successful!");
    setTimeout(() => {
      navigate('/employeePortal');
    }, 1000);
  };

  const handleCancelOtp = () => {
    setIsOtpVisible(false);
    setUserOtp('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.warning("Login cancelled.");
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e6f7ff 0%, #d6e4ff 50%, #f0f5ff 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className='navbar' style={{ background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img className='aruci--logo' src={Logo} onClick={() => navigate('/')} style={{ cursor: 'pointer', height: '42px' }} alt='logo' />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button type='default' onClick={() => navigate('/customerLogin')} style={{ borderRadius: 6, fontWeight: 600 }}>
            Customer Portal →
          </Button>
          <h1 className='topic' style={{ color: '#1677ff', margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>
            Employee & Staff Portal
          </h1>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px 20px' }}>
        <Card
          hoverable
          style={{ 
            width: 480, 
            borderRadius: 20, 
            boxShadow: '0 12px 36px rgba(22,119,255,0.12)',
            background: '#ffffff',
            border: '1px solid #d6e4ff',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* Top Colorful Header Card Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)', padding: '28px 24px', textAlign: 'center', color: '#fff' }}>
             <h2 style={{ color: 'white', margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Staff Authentication</h2>
             <p style={{ color: 'rgba(255,255,255,0.9)', margin: '6px 0 0 0', fontSize: '0.95rem' }}>
               ARUCI Core Banking Solutions (CBS)
             </p>
          </div>
          
          <div style={{ padding: '28px 32px' }}>
            {/* Quick Demo Credentials Box */}
            <div style={{
              background: '#f0f5ff',
              border: '1px solid #adc6ff',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 20,
              fontSize: '0.88rem'
            }}>
              <div style={{ fontWeight: 700, color: '#1677ff', marginBottom: 4 }}>💡 Demo Employee Accounts:</div>
              <div>Staff: Username: <b>cabral</b> | Password: <b>123456</b></div>
              <div>Manager: Username: <b>ranil</b> | Password: <b>123456</b></div>
              <div>Email: <b>staff@bank.com</b></div>
            </div>

            <Formik
              initialValues={{ username: 'cabral', password: 'password', email: 'staff@bank.com' }}
              validationSchema={customerRegSchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, fontSize: '0.95rem' }}>
                      Employee ID / Username
                    </label>
                    <Field
                      type='text'
                      name='username'
                      placeholder='E.g., cabral or ranil'
                      style={{ 
                        padding: '13px 16px', 
                        borderRadius: 10, 
                        border: '1.5px solid #d9d9d9', 
                        fontSize: '15px', 
                        outline: 'none', 
                        background: '#fafafa',
                        color: '#1a1a2e',
                        fontWeight: 500
                      }}
                    />
                    <ErrorMessage name='username' component='div' style={{ color: '#cf1322', marginTop: 4, fontSize: '0.85rem' }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, fontSize: '0.95rem' }}>
                      Secure Password
                    </label>
                    <Field
                      type='password'
                      name='password'
                      placeholder='Enter your password'
                      style={{ 
                        padding: '13px 16px', 
                        borderRadius: 10, 
                        border: '1.5px solid #d9d9d9', 
                        fontSize: '15px', 
                        outline: 'none', 
                        background: '#fafafa',
                        color: '#1a1a2e',
                        fontWeight: 500
                      }}
                    />
                    <ErrorMessage name='password' component='div' style={{ color: '#cf1322', marginTop: 4, fontSize: '0.85rem' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 600, color: '#333', marginBottom: 8, fontSize: '0.95rem' }}>
                      Official Email (For 2FA OTP)
                    </label>
                    <Field
                      type='email'
                      name='email'
                      placeholder='Enter your email to receive OTP'
                      style={{ 
                        padding: '13px 16px', 
                        borderRadius: 10, 
                        border: '1.5px solid #d9d9d9', 
                        fontSize: '15px', 
                        outline: 'none', 
                        background: '#fafafa',
                        color: '#1a1a2e',
                        fontWeight: 500
                      }}
                    />
                    <ErrorMessage name='email' component='div' style={{ color: '#cf1322', marginTop: 4, fontSize: '0.85rem' }} />
                  </div>

                  <Button
                    type='primary'
                    size="large"
                    onClick={props.handleSubmit}
                    loading={props.isSubmitting}
                    style={{ 
                      height: '50px', 
                      borderRadius: '10px', 
                      fontSize: '16px', 
                      fontWeight: 700, 
                      background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)', 
                      border: 'none', 
                      boxShadow: '0 4px 16px rgba(22,119,255,0.3)', 
                      marginTop: 8 
                    }}
                  >
                    Authenticate & Request 2FA OTP
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </div>

      {/* OTP Verification Modal */}
      <Modal
        title={<div style={{ textAlign: 'center', fontSize: '1.4rem' }}>🔒 Staff 2FA Verification</div>}
        visible={isOtpVisible}
        onCancel={handleCancelOtp}
        closable={false}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleCancelOtp}>
            Cancel Login
          </Button>,
          <Button key="submit" type="primary" loading={isLoggingIn} onClick={handleOtpVerify}>
            Verify OTP
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            We've sent a secure 6-digit OTP to your official email address.<br/>
            Please enter it below to authorize this session.
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
    </div>
  );
}
