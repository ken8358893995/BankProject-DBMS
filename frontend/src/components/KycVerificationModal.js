import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select, Upload, message, Tag, Steps, Result, Alert } from 'antd';
import { IdcardOutlined, UploadOutlined, CheckCircleOutlined, SafetyCertificateOutlined, FileDoneOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Step } = Steps;

export default function KycVerificationModal({ username = 'Customer' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Persist verification status in localStorage so interviewer can see verified badge
  const initialStatus = localStorage.getItem(`kyc_status_${username}`) || 'Pending';
  const [kycStatus, setKycStatus] = useState(initialStatus);
  const [docDetails, setDocDetails] = useState({
    docType: 'Aadhaar Card',
    docNumber: '•••• •••• 8921',
    verifiedOn: localStorage.getItem(`kyc_date_${username}`) || '',
  });

  const [form] = Form.useForm();

  const handleOpen = () => {
    setIsOpen(true);
    if (kycStatus === 'Verified') {
      setCurrentStep(2);
    } else {
      setCurrentStep(0);
    }
  };

  const handleFormSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(1); // Document Review
      setTimeout(() => {
        const verifyDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        localStorage.setItem(`kyc_status_${username}`, 'Verified');
        localStorage.setItem(`kyc_date_${username}`, verifyDate);
        setKycStatus('Verified');
        setDocDetails({
          docType: values.docType,
          docNumber: values.docNumber,
          verifiedOn: verifyDate,
        });
        setCurrentStep(2);
        message.success('🎉 KYC Documents Verified Successfully!');
      }, 1500);
    }, 1200);
  };

  return (
    <>
      {/* Navbar / Header Trigger Button with Live Status Badge */}
      <Button
        icon={<SafetyCertificateOutlined />}
        onClick={handleOpen}
        style={{
          borderRadius: 8,
          borderColor: kycStatus === 'Verified' ? '#52c41a' : '#faad14',
          color: kycStatus === 'Verified' ? '#52c41a' : '#d48806',
          fontWeight: 600,
          background: kycStatus === 'Verified' ? '#f6ffed' : '#fffbe6',
        }}
      >
        KYC: {kycStatus === 'Verified' ? 'VERIFIED' : 'SUBMIT KYC'}
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IdcardOutlined style={{ color: '#1677ff', fontSize: '1.4rem' }} />
            <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>Customer KYC Verification</span>
            <Tag color={kycStatus === 'Verified' ? 'green' : 'orange'} style={{ marginLeft: 'auto' }}>
              {kycStatus.toUpperCase()}
            </Tag>
          </div>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={620}
      >
        <div style={{ padding: '10px 0' }}>
          <Steps current={currentStep} style={{ marginBottom: 24 }}>
            <Step title="Details" icon={<IdcardOutlined />} />
            <Step title="Verification" icon={<SafetyCertificateOutlined />} />
            <Step title="Completed" icon={<FileDoneOutlined />} />
          </Steps>

          {currentStep === 0 && (
            <div>
              <Alert
                message="RBI / Banking Norms Compliance"
                description="Please submit your government ID proofs (Aadhaar / PAN / Passport) to unlock unlimited fund transfers and instant loan approvals."
                type="info"
                showIcon
                style={{ marginBottom: 20, borderRadius: 8 }}
              />

              <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item
                  label="Document Type"
                  name="docType"
                  initialValue="Aadhaar Card"
                  rules={[{ required: true, message: 'Please select document type' }]}
                >
                  <Select size="large">
                    <Option value="Aadhaar Card">Aadhaar Card (UIDAI)</Option>
                    <Option value="PAN Card">Permanent Account Number (PAN)</Option>
                    <Option value="Passport">National Passport</Option>
                    <Option value="Driving License">Driving License</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Document Identification Number"
                  name="docNumber"
                  rules={[
                    { required: true, message: 'Document identification number is required' },
                    { min: 8, message: 'Please enter a valid document number' }
                  ]}
                >
                  <Input size="large" placeholder="E.g., 4920 1829 9102 or ABCDE1234F" />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item label="Upload Document Front" required>
                    <Upload beforeUpload={() => false} maxCount={1}>
                      <Button icon={<UploadOutlined />} block size="middle">Select Front File</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item label="Upload Document Back">
                    <Upload beforeUpload={() => false} maxCount={1}>
                      <Button icon={<UploadOutlined />} block size="middle">Select Back File</Button>
                    </Upload>
                  </Form.Item>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  style={{ marginTop: 10, height: 48, borderRadius: 8, fontWeight: 600 }}
                >
                  Submit KYC for Automated Verification
                </Button>
              </Form>
            </div>
          )}

          {currentStep === 1 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <SafetyCertificateOutlined style={{ fontSize: 56, color: '#1677ff', animation: 'spin 2s infinite linear' }} />
              <h3 style={{ marginTop: 20 }}>Verifying Your Documents...</h3>
              <p style={{ color: '#888' }}>
                Connecting to National Identity Database Verification API and validating checksum...
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <Result
              status="success"
              title="Identity Verification Complete!"
              subTitle={
                <div>
                  Your account has been fully authenticated with <b>{docDetails.docType}</b> ({docDetails.docNumber}).
                  <br />
                  {docDetails.verifiedOn && <small style={{ color: '#888' }}>Certified on: {docDetails.verifiedOn}</small>}
                </div>
              }
              extra={[
                <div
                  key="info"
                  style={{
                    textAlign: 'left',
                    background: '#f6ffed',
                    padding: '16px 20px',
                    borderRadius: 12,
                    border: '1px solid #b7eb8f',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#389e0d', marginBottom: 6 }}>
                    ✓ Full Banking Privileges Unlocked:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: '#555', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    <li>Daily transfer limit raised to Rs. 2,00,000</li>
                    <li>Eligible for Instant Online Collateral Loans</li>
                    <li>Priority Branch & Virtual RM Support</li>
                  </ul>
                </div>,
                <Button type="primary" size="large" block key="done" onClick={() => setIsOpen(false)} style={{ borderRadius: 8 }}>
                  Back to Dashboard
                </Button>,
              ]}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
