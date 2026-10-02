import React, { useState } from 'react';
import { Card, Switch, Slider, Button, message, Tag, Tooltip } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

export default function VirtualDebitCard({ accountNumber, accountHolder = 'ARUCI PREMIUM', isEmergencyFrozen = false }) {
  const [localFrozen, setLocalFrozen] = useState(false);
  const isFrozen = isEmergencyFrozen || localFrozen;
  const [showCvv, setShowCvv] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(50000);
  const [copied, setCopied] = useState(false);

  // Generate deterministic card number based on account number
  const cleanAcc = String(accountNumber || '1029384756').padStart(10, '0');
  const cardNumber = `4532 88${cleanAcc.slice(0, 2)} ${cleanAcc.slice(2, 6)} ${cleanAcc.slice(6, 10)}`;
  const expiry = '08/29';
  const cvv = '742';

  const handleCopy = () => {
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
    setCopied(true);
    message.success('Card number copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFreezeToggle = (checked) => {
    if (isEmergencyFrozen) {
      message.error('Card is locked under Emergency Freeze. Please unfreeze account first.');
      return;
    }
    setLocalFrozen(checked);
    if (checked) {
      message.warning('Virtual Card is now FROZEN. All online transactions will be blocked.');
    } else {
      message.success('Virtual Card UNFROZEN. Ready for transactions.');
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1677ff' }}>
            <SafetyCertificateOutlined style={{ marginRight: 8 }} />
            Virtual Debit Card (Instant 24x7)
          </span>
          <Tag color={isFrozen ? 'red' : 'green'} style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
            {isEmergencyFrozen ? '🚨 LOCKED BY EMERGENCY FREEZE' : (isFrozen ? 'FROZEN' : 'ACTIVE')}
          </Tag>
        </div>
      }
      style={{
        borderRadius: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        border: '1px solid #e8e8e8',
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
        {/* 3D Glassmorphism Virtual Card */}
        <div
          style={{
            width: 340,
            height: 200,
            borderRadius: 18,
            padding: '22px 24px',
            color: '#fff',
            position: 'relative',
            boxShadow: isFrozen
              ? '0 12px 28px rgba(0,0,0,0.25)'
              : '0 16px 36px rgba(22, 119, 255, 0.35)',
            background: isFrozen
              ? 'linear-gradient(135deg, #434343 0%, #000000 100%)'
              : 'linear-gradient(135deg, #092b00 0%, #1677ff 50%, #722ed1 100%)',
            transition: 'all 0.4s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          {/* Card subtle shine background element */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-20%',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Row: Bank Name & Chip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, letterSpacing: 2, fontSize: '1.1rem' }}>ARUCI BANK</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: 600, letterSpacing: 1 }}>PLATINUM</span>
          </div>

          {/* Golden EMV Chip & Contactless */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0' }}>
            <div
              style={{
                width: 42,
                height: 32,
                background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #aa771c 100%)',
                borderRadius: 6,
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.4)',
              }}
            />
            <span style={{ fontSize: '1.2rem', transform: 'rotate(90deg)', opacity: 0.8 }}>📶</span>
          </div>

          {/* Card Number */}
          <Tooltip title="Click to copy card number">
            <div
              onClick={handleCopy}
              style={{
                fontSize: '1.22rem',
                letterSpacing: 3,
                fontFamily: 'Courier New, monospace',
                fontWeight: 700,
                cursor: 'pointer',
                userSelect: 'none',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {isFrozen ? '•••• •••• •••• ••••' : cardNumber}
            </div>
          </Tooltip>

          {/* Bottom Row: Name, Expiry & CVV */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '0.65rem', opacity: 0.75, letterSpacing: 1 }}>CARD HOLDER</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                {(!accountHolder || accountHolder.toLowerCase().includes('rox') || accountHolder.toLowerCase() === 'customer') ? 'VALUED CARDHOLDER' : accountHolder.toUpperCase()}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', opacity: 0.75, letterSpacing: 1 }}>VALID THRU</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>{expiry}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', opacity: 0.75, letterSpacing: 1 }}>CVV</div>
              <div
                onClick={() => setShowCvv(!showCvv)}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {showCvv && !isFrozen ? cvv : '•••'}
                {showCvv ? <EyeInvisibleOutlined style={{ fontSize: 12 }} /> : <EyeOutlined style={{ fontSize: 12 }} />}
              </div>
            </div>
          </div>
        </div>

        {/* Security Controls & Limits */}
        <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: isFrozen ? '#fff1f0' : '#f6ffed',
              borderRadius: 12,
              border: `1px solid ${isFrozen ? '#ffa39e' : '#b7eb8f'}`,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: isFrozen ? '#cf1322' : '#389e0d' }}>
                {isFrozen ? <LockOutlined style={{ marginRight: 6 }} /> : <UnlockOutlined style={{ marginRight: 6 }} />}
                {isFrozen ? 'Card Temporarily Locked' : 'Card Unlocked & Active'}
              </div>
              <small style={{ color: '#666' }}>Toggle to prevent unauthorized online transactions</small>
            </div>
            <Tooltip title={isEmergencyFrozen ? 'Account in Emergency Freeze lockdown. Unfreeze account first.' : ''}>
              <Switch
                checked={isFrozen}
                disabled={isEmergencyFrozen}
                onChange={handleFreezeToggle}
                checkedChildren="Freeze"
                unCheckedChildren="Active"
              />
            </Tooltip>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: '#444' }}>Daily Online Transaction Limit</span>
              <b style={{ color: '#1677ff' }}>Rs. {dailyLimit.toLocaleString()}</b>
            </div>
            <Slider
              min={5000}
              max={200000}
              step={5000}
              value={dailyLimit}
              disabled={isFrozen}
              onChange={(val) => setDailyLimit(val)}
              tooltip={{ formatter: (val) => `Rs. ${val?.toLocaleString()}` }}
            />
            <small style={{ color: '#888' }}>Adjust online debit limit instantly without branch visit</small>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button size="middle" onClick={handleCopy} disabled={isFrozen} style={{ flex: 1, borderRadius: 8 }}>
              {copied ? 'Copied!' : 'Copy Card Number'}
            </Button>
            <Button
              size="middle"
              type="dashed"
              onClick={() => setShowCvv(!showCvv)}
              disabled={isFrozen}
              style={{ flex: 1, borderRadius: 8 }}
            >
              {showCvv ? 'Hide CVV' : 'View CVV'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
