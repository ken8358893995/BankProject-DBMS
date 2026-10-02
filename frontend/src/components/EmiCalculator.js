import React, { useState } from 'react';
import { Modal, Button, InputNumber, Select, Statistic, Divider, Table } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function EmiCalculator() {
  const [open, setOpen] = useState(false);
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(12);
  const [schedule, setSchedule] = useState([]);
  const [emi, setEmi] = useState(null);

  const calculate = () => {
    const r = rate / 12 / 100;
    const n = tenure;
    const P = principal;
    const emiVal = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(emiVal.toFixed(2));

    let balance = P;
    const rows = [];
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principalPart = emiVal - interest;
      balance -= principalPart;
      rows.push({
        key: i,
        month: `Month ${i}`,
        emi: emiVal.toFixed(0),
        principal: principalPart.toFixed(0),
        interest: interest.toFixed(0),
        balance: Math.max(0, balance).toFixed(0),
      });
    }
    setSchedule(rows);
  };

  const columns = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'EMI (Rs.)', dataIndex: 'emi', key: 'emi' },
    { title: 'Principal', dataIndex: 'principal', key: 'principal' },
    { title: 'Interest', dataIndex: 'interest', key: 'interest' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' },
  ];

  return (
    <>
      <Button
        icon={<CalculatorOutlined />}
        onClick={() => setOpen(true)}
        style={{ borderRadius: 8, border: '1.5px solid #13c2c2', color: '#13c2c2' }}
        size='large'
      >
        EMI Calculator
      </Button>

      <Modal
        title='🧮 Loan EMI Calculator'
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontWeight: 600 }}>Loan Amount (Rs.)</label>
            <InputNumber
              min={1000} max={10000000}
              value={principal}
              onChange={setPrincipal}
              style={{ width: '100%', marginTop: 6 }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Interest Rate (% per year)</label>
            <InputNumber
              min={1} max={36} step={0.5}
              value={rate}
              onChange={setRate}
              style={{ width: '100%', marginTop: 6 }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Tenure (Months)</label>
            <Select value={tenure} onChange={setTenure} style={{ width: '100%', marginTop: 6 }}>
              {[6, 12, 18, 24, 36, 48, 60, 84, 120].map(m => (
                <Option key={m} value={m}>{m} months</Option>
              ))}
            </Select>
          </div>
        </div>

        <Button type='primary' block size='large' onClick={calculate} style={{ marginBottom: 20 }}>
          Calculate EMI
        </Button>

        {emi && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              <Statistic title='Monthly EMI' value={emi} prefix='Rs.' valueStyle={{ color: '#1677ff' }} />
              <Statistic title='Total Payment' value={(emi * tenure).toFixed(0)} prefix='Rs.' valueStyle={{ color: '#f5222d' }} />
              <Statistic title='Total Interest' value={(emi * tenure - principal).toFixed(0)} prefix='Rs.' valueStyle={{ color: '#fa8c16' }} />
            </div>
            <Divider>Amortization Schedule</Divider>
            <Table columns={columns} dataSource={schedule} pagination={{ pageSize: 6 }} size='small' />
          </>
        )}
      </Modal>
    </>
  );
}
