import React, { useState } from 'react';
import { Card, Tag, Button, Tooltip, message, Progress } from 'antd';
import { GiftOutlined, CopyOutlined, CheckOutlined, TrophyOutlined, ThunderboltOutlined, QrcodeOutlined } from '@ant-design/icons';

export default function LoyaltyRewardWidget({ username = 'Customer', totalBalance = 0 }) {
  const referralCode = `ARUCI-${username.toUpperCase().replace(/\s+/g, '').slice(0, 5)}2024`;
  const [copied, setCopied] = useState(false);
  
  // Calculate reward coins based on activity
  const basePoints = parseInt(localStorage.getItem(`reward_points_${username}`) || '750', 10);
  const [points, setPoints] = useState(basePoints);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    message.success('Referral code copied! Share with friends to earn 500 Coins.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaim = (rewardName, cost) => {
    if (points >= cost) {
      const newPoints = points - cost;
      setPoints(newPoints);
      localStorage.setItem(`reward_points_${username}`, newPoints.toString());
      message.success(`🎉 Redeemed ${rewardName}! Voucher added to your account.`);
    } else {
      message.warning(`Insufficient Coins! You need ${cost - points} more coins to claim this.`);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, color: '#fa8c16' }}>
            <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
            ARUCI Rewards & Perks
          </span>
          <Tag color="gold" style={{ borderRadius: 12, fontWeight: 700 }}>
            {points} COINS
          </Tag>
        </div>
      }
      style={{
        borderRadius: 16,
        border: '1px solid #ffd591',
        background: 'linear-gradient(180deg, #fffbe6 0%, #ffffff 100%)',
        boxShadow: '0 6px 20px rgba(250, 140, 22, 0.08)',
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Tier status */}
        <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 12, border: '1px solid #ffe58f' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Tier Progress: <b>Gold Elite</b></span>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>{points}/1500 to Platinum</span>
          </div>
          <Progress percent={Math.min(100, Math.round((points / 1500) * 100))} strokeColor={{ '0%': '#fa8c16', '100%': '#faad14' }} showInfo={false} />
        </div>

        {/* Unique Referral Code Box */}
        <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 12, border: '1.5px dashed #faad14' }}>
          <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: 4 }}>YOUR EXCLUSIVE INVITE CODE</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: 1.5, color: '#d46b08', fontFamily: 'monospace' }}>
              {referralCode}
            </span>
            <Button
              size="small"
              type="primary"
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              style={{ background: copied ? '#52c41a' : '#fa8c16', borderColor: 'transparent', borderRadius: 6 }}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <small style={{ color: '#888', display: 'block', marginTop: 4 }}>
            Get <b>500 Coins (₹500 value)</b> whenever a friend registers using your code.
          </small>
        </div>

        {/* Instant Redeemable Perks */}
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#666', marginBottom: 8, textTransform: 'uppercase' }}>
            Instant Redeemable Rewards:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>0.5% Extra FD Interest</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>Boost any active or new FD</div>
              </div>
              <Button size="small" onClick={() => handleClaim('0.5% Extra FD Interest Coupon', 400)} style={{ borderRadius: 6, fontWeight: 600, color: '#fa8c16' }}>
                400 🪙
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Zero Transfer Fee Pass</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>Valid for 30 days</div>
              </div>
              <Button size="small" onClick={() => handleClaim('Zero Transfer Fee Pass', 250)} style={{ borderRadius: 6, fontWeight: 600, color: '#fa8c16' }}>
                250 🪙
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
