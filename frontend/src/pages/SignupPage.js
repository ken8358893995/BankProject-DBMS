import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Card, message } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Logo from './Images/Logo2.png';
import './PageStyling/LoginPage.css';

const HOST = 'http://localhost:8000';

export default function SignupPage() {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState('');

  const signupSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    address: Yup.string().required('Address is required'),
    phone: Yup.string().required('Phone number is required'),
    occupation: Yup.string().required('Occupation is required'),
    username: Yup.string().min(4, 'Username must be at least 4 characters').required('Username is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSignupError('');
    try {
      const response = await axios.post(`${HOST}/login/signup`, {
        name: values.name,
        dateOfBirth: values.dateOfBirth,
        address: values.address,
        phone: values.phone,
        occupation: values.occupation,
        username: values.username,
        password: values.password,
      });

      if (response.data.success) {
        message.success('Account created successfully! Please login.');
        navigate('/customerLogin');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Signup failed. Please try again.';
      setSignupError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='login-box'>
      <div className='navbar'>
        <img className='aruci--logo' src={Logo} alt='logo' onClick={() => navigate('/')} />
        <h1 className='topic'>Create Account</h1>
      </div>

      <Card
        hoverable
        title='SIGN UP'
        style={{ width: 620, margin: '100px auto', height: 'auto', paddingBottom: '20px', background: 'rgba(240, 248, 255, 0.9)' }}
      >
        <Formik
          initialValues={{
            name: '',
            dateOfBirth: '',
            address: '',
            phone: '',
            occupation: '',
            username: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form className='customer--reg--form' style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <Field name='name' type='text' placeholder='Full Name' />
              <ErrorMessage name='name' component='div' style={{ color: 'red', fontSize: '12px' }} />

              <Field name='dateOfBirth' type='date' placeholder='Date of Birth' />
              <ErrorMessage name='dateOfBirth' component='div' style={{ color: 'red', fontSize: '12px' }} />

              <Field name='address' type='text' placeholder='Address' />
              <ErrorMessage name='address' component='div' style={{ color: 'red', fontSize: '12px' }} />

              <Field name='phone' type='text' placeholder='Phone Number' />
              <ErrorMessage name='phone' component='div' style={{ color: 'red', fontSize: '12px' }} />

              <Field name='occupation' type='text' placeholder='Occupation' />
              <ErrorMessage name='occupation' component='div' style={{ color: 'red', fontSize: '12px' }} />

              <Field name='username' type='text' placeholder='Choose a Username' />
              <ErrorMessage name='username' component='div' style={{ color: 'red', fontSize: '12px' }} />

              <Field name='password' type='password' placeholder='Password (min 6 characters)' />
              <ErrorMessage name='password' component='div' style={{ color: 'red', fontSize: '12px' }} />

              <Field name='confirmPassword' type='password' placeholder='Confirm Password' />
              <ErrorMessage name='confirmPassword' component='div' style={{ color: 'red', fontSize: '12px' }} />

              {signupError && (
                <div style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{signupError}</div>
              )}

              <Button
                type='primary'
                onClick={props.handleSubmit}
                loading={props.isSubmitting}
                style={{ 
                  marginTop: '16px', 
                  height: '44px',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  width: '100%'
                }}
              >
                Create Account
              </Button>

              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px' }}>
                Already have an account?{' '}
                <span
                  style={{ color: '#1677ff', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => navigate('/customerLogin')}
                >
                  Login here
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
