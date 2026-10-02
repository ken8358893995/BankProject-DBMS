import { useState, useEffect } from 'react';
import { getAccounts } from '../../api/accounts';
import { getCustomerFDs } from '../../api/fd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createOnlineLoan } from '../../api/onlineloans';
import Logo from '../Images/Logo2.png';
import * as Yup from 'yup';
export default function OnlineLoanReg() {
  const [accounts, setAccounts] = useState([]);
  const [fds, setFds] = useState([]);
  const [selectedFD, setSelectedFD] = useState();

  const navigate = useNavigate();

  const maxAmount = selectedFD
    ? selectedFD.Amount * 0.6 > 500000
      ? 500000
      : selectedFD.Amount * 0.6
    : 500000;

  const validateAmount = (value) => {
    let error;
    // console.log(value);
    if (!value) {
      error = 'Amount is required';
    } else if (value > maxAmount) {
      error = `Cannot be greater than ${maxAmount}`;
    }
    return error;
  };

  const customerRegSchema = Yup.object().shape({
    myAccountID: Yup.number().required('Please select a savings account'),
    fdAccountID: Yup.number().required('Please select a linked FD'),
    duration: Yup.number().positive('Duration must be positive').required('Please enter loan duration in months'),
  });

  useEffect(() => {
    getAccounts().then((accounts) => {
      setAccounts(accounts);
    });
    getCustomerFDs().then((fd) => {
      setFds(fd);
    });
  }, []);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('in handle submit', values);
    setSubmitting(true);
    const loan = {
      fdAccountID: parseInt(values.fdAccountID, 10),
      amount: values.amount,
      duration: values.duration,
      savingsAccountID: parseInt(values.myAccountID, 10),
    };
    createOnlineLoan({ loan }).then(() => {
      setSubmitting(false);
      navigate('/customerPortal');
    });
  };

  let options = accounts.map((account) => (
    <option key={account.AccountID} value={account.AccountID}>
      {account.AccountID}
    </option>
  ));
  options = [
    <option key="default-savings" value="" disabled>
      Choose Savings Account
    </option>,
    ...options,
  ];

  let optionsfd = fds.map((fd) => (
    <option key={fd.AccountID} value={fd.AccountID}>
      {fd.AccountID}
    </option>
  ));
  optionsfd = [
    <option key="default-fd" value="" disabled>
      Choose FD
    </option>,
    ...optionsfd,
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fff0f6 0%, #ffe9f0 100%)', paddingBottom: '40px' }}>
      <div className='navbar' style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', background: 'white' }}>
        <img
          className='aruci--logo'
          src={Logo}
          onClick={() => navigate('/customerPortal/')}
          alt='logo'
          style={{ cursor: 'pointer' }}
        />
        <h1 className='topic' style={{ margin: 0, color: '#eb2f96' }}>Apply for Online Loan</h1>
      </div>
      <div style={{ maxWidth: 1050, margin: '40px auto', display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Card 
          title={<span style={{ fontSize: '1.4rem', color: '#eb2f96' }}>Instant Loan Application</span>}
          style={{ flex: 1, minWidth: 380, maxWidth: 520, borderRadius: 16, boxShadow: '0 10px 30px rgba(235,47,150,0.1)' }}
          headStyle={{ borderBottom: '2px solid #f0f0f0', padding: '20px 24px' }}
        >
          <Formik
            initialValues={{
              myAccountID: '',
              fdAccountID: '',
              amount: '',
              duration: 12,
            }}
            onSubmit={handleSubmit}
            validationSchema={customerRegSchema}
          >
            {(props) => {
              const loanAmount = Number(props.values.amount) || 0;
              const months = Number(props.values.duration) || 12;
              const rate = 14; // standard 14% p.a.
              const monthlyRate = rate / 12 / 100;
              const emi = loanAmount > 0 
                ? ((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)).toFixed(0)
                : 0;
              const totalPayable = emi > 0 ? emi * months : 0;
              const totalInterest = totalPayable > loanAmount ? totalPayable - loanAmount : 0;

              return (
                <Form style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, color: '#555' }}>Select Savings Account</label>
                    <Field as='select' name='myAccountID' style={{ padding: '11px', borderRadius: 8, border: '1px solid #d9d9d9', fontSize: '15px', outline: 'none', background: '#fafafa' }}>
                      {options}
                    </Field>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, color: '#555' }}>Select Linked Fixed Deposit (FD)</label>
                    <Field
                      as='select'
                      name='fdAccountID'
                      style={{ padding: '11px', borderRadius: 8, border: '1px solid #d9d9d9', fontSize: '15px', outline: 'none', background: '#fafafa' }}
                      onChange={(e) => {
                        const fd = fds.find(
                          (fd) => fd.AccountID === parseInt(e.target.value, 10)
                        );
                        setSelectedFD(fd);
                        props.setFieldValue('fdAccountID', e.target.value);
                      }}
                    >
                      {optionsfd}
                    </Field>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, color: '#555' }}>Loan Amount (Rs.)</label>
                    <Field 
                      type='number' 
                      name='amount' 
                      placeholder={`Max limit: Rs. ${maxAmount.toLocaleString()}`} 
                      validate={validateAmount}
                      style={{ padding: '11px', borderRadius: 8, border: '1px solid #d9d9d9', fontSize: '15px', outline: 'none' }}
                    />
                    <small style={{ color: '#eb2f96', marginTop: 4 }}>*Max 60% of FD amount or Rs. 500,000</small>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 600, marginBottom: 6, color: '#555' }}>Duration (Months)</label>
                    <Field 
                      type='number' 
                      name='duration' 
                      placeholder='E.g., 12, 24, 36 months' 
                      style={{ padding: '11px', borderRadius: 8, border: '1px solid #d9d9d9', fontSize: '15px', outline: 'none' }}
                    />
                  </div>

                  <Button
                    type='primary'
                    size="large"
                    onClick={props.handleSubmit}
                    loading={props.isSubmitting}
                    style={{ marginTop: '6px', height: '48px', borderRadius: '8px', fontSize: '16px', fontWeight: 600, background: '#eb2f96', borderColor: '#eb2f96' }}
                  >
                    Submit Application
                  </Button>

                  {Object.values(props.touched).includes(true) && Object.values(props.errors).length !== 0 && (
                    <div style={{ padding: '10px', background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, color: '#ff4d4f', fontSize: '13px' }}>
                      <ErrorMessage name='myAccountID' component="div" />
                      <ErrorMessage name='fdAccountID' component="div" />
                      <ErrorMessage name='amount' component="div" />
                      <ErrorMessage name='duration' component="div" />
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        </Card>

        {/* Live Loan Summary & Visual Breakdown */}
        <Card
          title={<span style={{ fontSize: '1.2rem', color: '#722ed1' }}>📊 Real-time EMI Estimator</span>}
          style={{ flex: 1, minWidth: 320, maxWidth: 440, borderRadius: 16, boxShadow: '0 10px 30px rgba(114,46,209,0.08)', background: '#fafafa' }}
          headStyle={{ borderBottom: '2px solid #f0f0f0', padding: '20px 24px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '16px', background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Interest Rate (FD Linked)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#722ed1', margin: '4px 0' }}>14.0% <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>p.a.</span></div>
              <small style={{ color: '#52c41a' }}>✓ Preferential rate on FD collateral</small>
            </div>

            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #eb2f96 0%, #722ed1 100%)', borderRadius: 12, color: '#fff' }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Key Loan Features:</div>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 18, fontSize: '0.85rem', lineHeight: 1.6 }}>
                <li>Zero Processing Fees</li>
                <li>Instant Disbursement to Savings</li>
                <li>No CIBIL Score required (FD backed)</li>
                <li>Flexible Repayment Tenure</li>
              </ul>
            </div>

            <div style={{ padding: '14px 16px', background: '#fff', borderRadius: 12, border: '1px dashed #eb2f96' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#eb2f96', marginBottom: 4 }}>💡 Quick Tip for Interview:</div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', lineHeight: 1.5 }}>
                Online Loans in ARUCI Bank are backed by Fixed Deposits (FD) as security. The system dynamically caps maximum loan at 60% of FD balance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
