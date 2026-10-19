import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Card, Modal, message } from 'antd';
import { login } from '../../api/auth';
import { sendOtpEmail } from '../../api/transactions';
import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import '../PageStyling/LoginPage.css';
import Logo from '../Images/Logo2.png';

export default function CustomerLogin() {
  const customerRegSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    email: Yup.string().email('Invalid email format').required('Email is required for 2FA OTP'),
  });

  const [loginError, setLoginError] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    const loginDetails = {
      userName: values.username,
      password: values.password,
      role: 'customer',
    };

    login({ loginDetails })
      .then(async (response) => {
        if (response.auth === 'success') {
          // Authentication successful. Now send OTP.
          message.loading({ content: 'Verifying credentials and sending OTP...', key: 'login_msg' });
          
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedOtp(otp);
          
          try {
            await sendOtpEmail(values.email, otp, "Account Login");
            message.success({ content: `Security code sent to ${values.email}. Please check your inbox!`, key: 'login_msg', duration: 4 });
            setUserOtp('');
            setIsOtpVisible(true);
          } catch (e) {
            message.error({ content: "Failed to send email. Please check network/email address.", key: 'login_msg', duration: 4 });
          }
        }
        setSubmitting(false);
      })
      .catch((error) => {
        message.error("Invalid Username or Password!");
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
    message.success("Login Successful!");
    setTimeout(() => {
      navigate('/customerPortal');
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e6f7ff 0%, #bae0ff 100%)', display: 'flex', flexDirection: 'column' }}>
      <div className='navbar' style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <img className='aruci--logo' src={Logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }} alt='logo' />
        <h1 className='topic' style={{ color: '#1677ff', margin: 0 }}>Customer Portal</h1>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <Card
          hoverable
          style={{ width: 480, borderRadius: 16, boxShadow: '0 10px 30px rgba(22,119,255,0.1)', overflow: 'hidden' }}
          bodyStyle={{ padding: '32px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ color: '#1677ff', fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>Customer NetBanking Login</h2>
            <p style={{ color: '#666', margin: '6px 0 0 0' }}>Log in securely to access your account</p>
          </div>

          <Formik
            initialValues={{ username: '', password: '', email: '' }}
            validationSchema={customerRegSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 600, color: '#555', marginBottom: 6 }}>Username</label>
                  <Field
                    type='text'
                    name='username'
                    placeholder='Enter your username'
                    style={{ padding: '12px', borderRadius: 8, border: '1px solid #d9d9d9', outline: 'none' }}
                  />
                  <ErrorMessage name='username' component='div' style={{ color: 'red', fontSize: '0.8rem', marginTop: 4 }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 600, color: '#555', marginBottom: 6 }}>Password</label>
                  <Field
                    type='password'
                    name='password'
                    placeholder='Enter your password'
                    style={{ padding: '12px', borderRadius: 8, border: '1px solid #d9d9d9', outline: 'none' }}
                  />
                  <ErrorMessage name='password' component='div' style={{ color: 'red', fontSize: '0.8rem', marginTop: 4 }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 600, color: '#555', marginBottom: 6 }}>Registered Email (for OTP)</label>
                  <Field
                    type='email'
                    name='email'
                    placeholder='Enter your email address'
                    style={{ padding: '12px', borderRadius: 8, border: '1px solid #d9d9d9', outline: 'none' }}
                  />
                  <ErrorMessage name='email' component='div' style={{ color: 'red', fontSize: '0.8rem', marginTop: 4 }} />
                </div>

                <Button
                  type='primary'
                  size="large"
                  onClick={props.handleSubmit}
                  loading={props.isSubmitting}
                  style={{ height: '45px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}
                >
                  Secure Login
                </Button>
                
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px' }}>
                  New customer?{' '}
                  <span
                    style={{ color: '#1677ff', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => navigate('/signup')}
                  >
                    Create an account
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>

      {/* OTP Verification Modal */}
      <Modal
        title={<div style={{ textAlign: 'center', fontSize: '1.4rem' }}>🔒 2FA Verification</div>}
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
            We've sent a 6-digit OTP to your email address.<br/>
            Please enter it below to securely log in.
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
