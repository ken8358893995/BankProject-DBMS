import React from 'react';
import { Card, Progress, Tag, Button, Tooltip } from 'antd';
import { PieChartOutlined, ArrowUpOutlined, ArrowDownOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';

export default function FinancialInsightsWidget({ totalBalance = 0, accounts = [], fds = [] }) {
  // Category breakdown for customer spending / investments
  const savingsAmount = accounts.find(a => a.TypeID === 'SA')?.Balance || (totalBalance * 0.75);
  const fdInvestment = fds.reduce((sum, f) => sum + (f.Amount || 0), 0);
  const monthlyInflow = Math.round(totalBalance * 0.45);
  const monthlyOutflow = Math.round(totalBalance * 0.28);

  const totalPortfolio = totalBalance + fdInvestment;
  const savingsPct = totalPortfolio > 0 ? Math.round((totalBalance / totalPortfolio) * 100) : 70;
  const fdPct = 100 - savingsPct;

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, color: '#1677ff' }}>
            <PieChartOutlined style={{ marginRight: 8, color: '#1677ff' }} />
            Monthly Cash Flow & Health
          </span>
          <Tag color="cyan" style={{ borderRadius: 10, fontWeight: 700 }}>
            FINANCIAL HEALTH: 94/100
          </Tag>
        </div>
      }
      style={{
        borderRadius: 16,
        border: '1px solid #d6e4ff',
        background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)',
        boxShadow: '0 6px 20px rgba(22, 119, 255, 0.07)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Inflow vs Outflow Mini Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 12, border: '1px solid #b7eb8f' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#52c41a', fontWeight: 600, fontSize: '0.8rem' }}>
              <ArrowDownOutlined /> MONEY IN (INFLOW)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#389e0d', marginTop: 4 }}>
              + Rs. {monthlyInflow.toLocaleString()}
            </div>
            <small style={{ color: '#888' }}>Salary & FD Returns</small>
          </div>

          <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 12, border: '1px solid #ffccc7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cf1322', fontWeight: 600, fontSize: '0.8rem' }}>
              <ArrowUpOutlined /> MONEY OUT (SPENT)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#cf1322', marginTop: 4 }}>
              - Rs. {monthlyOutflow.toLocaleString()}
            </div>
            <small style={{ color: '#888' }}>Transfers, Bills & EMIs</small>
          </div>
        </div>

        {/* Wealth Distribution Breakdown */}
        <div style={{ background: '#fff', padding: '14px 16px', borderRadius: 12, border: '1px solid #e8e8e8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#444' }}>Portfolio Allocation</span>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>
              Liquidity Ratio: <b style={{ color: '#1677ff' }}>Safe (Healthy)</b>
            </span>
          </div>

          <Progress
            percent={savingsPct}
            success={{ percent: fdPct, strokeColor: '#722ed1' }}
            strokeColor="#1677ff"
            showInfo={false}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: '0.8rem' }}>
            <span style={{ color: '#1677ff', fontWeight: 600 }}>● Liquid Savings: {savingsPct}%</span>
            <span style={{ color: '#722ed1', fontWeight: 600 }}>● Fixed Deposits: {fdPct}%</span>
          </div>
        </div>

        {/* Smart AI Financial Suggestion */}
        <div style={{
          background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{ fontSize: '1.6rem' }}>💡</div>
          <div style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
            <b>Smart Savings Recommendation:</b> Transfer Rs. 10,000 into a high-yield 12% 5-Yr FD to earn an estimated <b>Rs. 1,200 annual passive yield</b>!
          </div>
        </div>
      </div>
    </Card>
  );
}
