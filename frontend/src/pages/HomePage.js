import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyling/HomePage.css';
import Logo from './Images/Logo2.png';
import BankPhoto from './Images/BankPhoto.jpg';
import { Button, Card, Modal, Tag, Steps } from 'antd';
import { UserAddOutlined, CheckCircleOutlined, SafetyCertificateOutlined, ThunderboltOutlined, IdcardOutlined } from '@ant-design/icons';

const { Step } = Steps;

export default function EmployeeHome() {
  const navigate = useNavigate();
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  return (
    <div className='HomePage'>
      {/* Navbar */}
      <div className='navbar'>
        <img className='aruci--logo' src={Logo} alt='ARUCI Bank Logo' />
        <div className='buttons'>
          <Button 
            type='dashed'
            icon={<UserAddOutlined />}
            onClick={() => setAccountModalOpen(true)}
            style={{ borderColor: '#52c41a', color: '#389e0d', fontWeight: 600, borderRadius: 6 }}
          >
            Open New Account
          </Button>
          <Button className='button employee-btn' onClick={() => navigate('employeeLogin')}>
            Employee Portal
          </Button>
          <Button className='button customer-btn' type='primary' onClick={() => navigate('customerLogin')}>
            Customer Portal
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className='hero-section'>
        <img className='BankPhoto' src={BankPhoto} alt='ARUCI Bank' />
        <div className='hero-text'>
          <h1>Welcome to <span className='brand-name'>ARUCI Bank</span></h1>
          <p>Your trusted partner for a seamless, digital-first and secure banking experience.</p>
          <div style={{ display: 'flex', gap: '14px', marginTop: '20px', flexWrap: 'wrap' }}>
            <Button 
              type='primary' 
              size='large' 
              className='hero-btn' 
              icon={<UserAddOutlined />}
              onClick={() => navigate('/signup')}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              Open New Account (Instant) →
            </Button>
            <Button type='primary' size='large' className='hero-btn' onClick={() => navigate('customerLogin')}>
              Customer Portal →
            </Button>
            <Button size='large' className='hero-btn-secondary' onClick={() => navigate('employeeLogin')} style={{ borderColor: 'white', color: 'white', background: 'transparent' }}>
              Employee Portal →
            </Button>
          </div>
        </div>
      </div>

      {/* NEW: Open Account in 3 Easy Steps Section */}
      <div style={{ padding: '50px 5%', background: '#fafcff', borderBottom: '1px solid #edf2f9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <Tag color="green" style={{ fontSize: '0.9rem', padding: '4px 12px', borderRadius: 12, marginBottom: 12 }}>
            ⚡ 100% Paperless Digital Onboarding
          </Tag>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 10 }}>
            Open Your Savings Account in 3 Minutes
          </h2>
          <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: 36 }}>
            Enjoy zero balance facilities, instant virtual debit cards, and 24/7 online transfers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, textAlign: 'left' }}>
            <Card style={{ borderRadius: 16, border: '1px solid #e8e8e8', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>📝</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1677ff' }}>Step 1: Fill Basic Details</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Provide your Name, Date of Birth, Phone Number, and Address on our secure signup portal.
              </p>
            </Card>

            <Card style={{ borderRadius: 16, border: '1px solid #e8e8e8', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🪪</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#722ed1' }}>Step 2: Instant KYC Auth</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Seamless verification via Aadhaar, PAN, or Passport with end-to-end encryption.
              </p>
            </Card>

            <Card style={{ borderRadius: 16, border: '1px solid #e8e8e8', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>💳</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#52c41a' }}>Step 3: Instant Activation</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Get your Account Number, Virtual Platinum Card, and Net Banking login ready instantly.
              </p>
            </Card>
          </div>

          <div style={{ marginTop: 32 }}>
            <Button
              type="primary"
              size="large"
              icon={<ThunderboltOutlined />}
              onClick={() => navigate('/signup')}
              style={{
                height: 50,
                padding: '0 36px',
                borderRadius: 25,
                fontSize: '1.05rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1677ff 0%, #52c41a 100%)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(22, 119, 255, 0.3)'
              }}
            >
              Get Started – Apply Online Now
            </Button>
          </div>
        </div>
      </div>

      {/* Eligibility & Documents Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IdcardOutlined style={{ color: '#1677ff', fontSize: '1.3rem' }} />
            <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>Open New Account – Guidelines & Eligibility</span>
          </div>
        }
        open={accountModalOpen}
        onCancel={() => setAccountModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setAccountModalOpen(false)}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={() => { setAccountModalOpen(false); navigate('/signup'); }}>
            Proceed to Application →
          </Button>,
        ]}
        width={650}
      >
        <div style={{ padding: '10px 0' }}>
          <div style={{ marginBottom: 18 }}>
            <h4 style={{ color: '#1677ff', fontWeight: 700, marginBottom: 8 }}>📋 Required Documents (Only 1 Valid ID):</h4>
            <ul style={{ paddingLeft: 20, color: '#555', lineHeight: 1.8 }}>
              <li><b>Aadhaar Card</b> (UIDAI verified)</li>
              <li><b>PAN Card</b> (Permanent Account Number)</li>
              <li><b>Valid Passport</b> or Driving License</li>
              <li>Proof of Address (Utility bill or Aadhaar QR)</li>
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <h4 style={{ color: '#52c41a', fontWeight: 700, marginBottom: 8 }}>✨ Account Features & Benefits:</h4>
            <ul style={{ paddingLeft: 20, color: '#555', lineHeight: 1.8 }}>
              <li>Zero Minimum Balance Maintenance</li>
              <li>Free Platinum Virtual Debit Card with 24x7 Freeze/Unfreeze</li>
              <li>Up to 12% Interest on linked Fixed Deposits</li>
              <li>2FA OTP Protected Online Transfers</li>
            </ul>
          </div>

          <div style={{ background: '#f6ffed', padding: '12px 16px', borderRadius: 8, border: '1px solid #b7eb8f' }}>
            <span style={{ color: '#389e0d', fontWeight: 600 }}>Ready to get started? </span>
            <span style={{ color: '#555' }}>Click below to open your account online in under 3 minutes.</span>
          </div>
        </div>
      </Modal>

      {/* Features Section */}
      <div className='features-section'>
        <h2 className='section-title'>Our Premium Services</h2>
        <div className='features-grid'>
          <div className='feature-card'>
            <div className='feature-icon'>🏆</div>
            <h3>ARUCI Pinnacle</h3>
            <p>
              An all-new exclusive Premier banking experience with personalized
              service and a wide range of products to help you reach new heights of success.
            </p>
          </div>
          <div className='feature-card'>
            <div className='feature-icon'>💼</div>
            <h3>Salary Partner</h3>
            <p>
              Get so much more with your monthly salary. Our Salary Partner
              program brings your dreams and aspirations within easy reach.
            </p>
          </div>
          <div className='feature-card'>
            <div className='feature-icon'>👩</div>
            <h3>Adult Account</h3>
            <p>
              A financial solution designed to empower individuals to achieve
              their career goals, business ambitions and personal dreams.
            </p>
          </div>
          <div className='feature-card'>
            <div className='feature-icon'>🌟</div>
            <h3>Teen Account</h3>
            <p>
              Talents emerge in your teens! Save your pocket money and cash gifts
              in an ARUCI Teen Account and build a bright future.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='stats-section'>
        <div className='stat-item'>
          <h2>10,000+</h2>
          <p>Happy Customers</p>
        </div>
        <div className='stat-item'>
          <h2>50+</h2>
          <p>Branch Locations</p>
        </div>
        <div className='stat-item'>
          <h2>24/7</h2>
          <p>Online Banking</p>
        </div>
        <div className='stat-item'>
          <h2>100%</h2>
          <p>Secure Transactions</p>
        </div>
      </div>

      {/* Footer */}
      <div className='footer'>
        <div className='footer-content'>
          <div className='footer-brand'>
            <img src={Logo} alt='logo' className='footer-logo' />
            <p>Your trusted banking partner since 2022.</p>
          </div>
          <div className='footer-info'>
            <h3>Get in Touch</h3>
            <p>📍 No. 40, Galle Road, Moratuwa, Sri Lanka</p>
            <p>📧 nikilken170@gmail.com</p>
          </div>
        </div>
        <div className='footer-bottom'>
          <p>ARUCI Bank ©2024. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
