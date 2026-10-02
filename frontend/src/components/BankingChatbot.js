import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Tag, Avatar, Tooltip } from 'antd';
import { SendOutlined, CloseOutlined, RobotOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';

export default function BankingChatbot({ username = 'Customer', accounts = [], fds = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! Welcome to ARUCI 24x7 Digital Banking Helpdesk. How can I assist you with your accounts, loans, or transfers today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getBotResponse = (query) => {
    const q = query.toLowerCase().trim();

    if (q.includes('balance') || q.includes('paisa') || q.includes('amount') || q.includes('rupaye')) {
      const total = accounts.reduce((acc, a) => acc + (a.Balance || 0), 0);
      if (accounts.length > 0) {
        return `Your total balance across ${accounts.length} account(s) is Rs. ${total.toLocaleString()}. Primary Account #${accounts[0].AccountID} balance is Rs. ${(accounts[0].Balance || 0).toLocaleString()}.`;
      }
      return 'You currently do not have any active accounts found.';
    }

    if (q.includes('fd') || q.includes('fixed deposit')) {
      if (fds.length > 0) {
        return `You have ${fds.length} active Fixed Deposit(s). ARUCI Bank offers up to 12% interest on 5-year FDs!`;
      }
      return 'You have no active FDs right now. You can open a new FD anytime from the Fixed Deposit section with interest rates up to 12%!';
    }

    if (q.includes('loan') || q.includes('emi') || q.includes('apply')) {
      return 'You can apply for an instant Online Loan backed by your Fixed Deposit (up to 60% of FD amount or Rs. 500,000) with a 14% p.a. interest rate. Check the "Apply Loan" tab in the navbar!';
    }

    if (q.includes('transfer') || q.includes('send money') || q.includes('bhejna')) {
      return 'To transfer funds, go to "Online Transfer". You will need the recipient account number and your registered email for 2FA OTP verification.';
    }

    if (q.includes('card') || q.includes('debit') || q.includes('freeze') || q.includes('cvv')) {
      return 'You can manage your Virtual Platinum Debit Card directly on your dashboard: view CVV, copy card numbers, freeze/unfreeze transactions, or adjust daily limits!';
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
      return `Hello! How can I assist you with your banking needs today? You can ask about your Balance, Loans, Transfers, or Debit Card.`;
    }

    if (q.includes('who are you') || q.includes('kya ho')) {
      return 'I am ARUCI AI Smart Banking Bot, designed to assist customers with instant account insights, transfer guidance, and automated banking FAQs.';
    }

    return "I can help with: 'Check Balance', 'FD Rates', 'Apply Loan', 'Card Security', or 'How to Transfer'. What would you like to know?";
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg('');

    setTimeout(() => {
      const reply = getBotResponse(text);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const quickQuestions = ['Check Balance', 'FD Offers', 'Apply Loan', 'Debit Card Help'];

  return (
    <>
      {/* Floating Toggle Button */}
      <Tooltip title={isOpen ? 'Close Chat' : 'ARUCI Smart Banking Assistant'} placement="left">
        <Button
          type="primary"
          shape="circle"
          size="large"
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '32px',
            width: '60px',
            height: '60px',
            boxShadow: '0 6px 20px rgba(22,119,255,0.45)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '26px',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
            border: 'none',
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <CloseOutlined style={{ fontSize: 22 }} /> : <CustomerServiceOutlined style={{ fontSize: 24 }} />}
        </Button>
      </Tooltip>

      {/* Floating Chat Modal */}
      {isOpen && (
        <Card
          style={{
            position: 'fixed',
            bottom: '102px',
            left: '32px',
            width: '360px',
            height: '480px',
            borderRadius: 16,
            boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #d9d9d9',
          }}
          bodyStyle={{
            padding: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar style={{ backgroundColor: '#fff', color: '#1677ff' }} icon={<RobotOutlined />} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ARUCI Banking Bot</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>● Active 24/7 AI Assistant</div>
              </div>
            </div>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined style={{ color: '#fff' }} />}
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '14px',
              overflowY: 'auto',
              background: '#f8faff',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: 8,
                }}
              >
                {msg.sender === 'bot' && (
                  <Avatar size="small" style={{ backgroundColor: '#1677ff' }} icon={<RobotOutlined />} />
                )}
                <div
                  style={{
                    maxWidth: '78%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    background: msg.sender === 'user' ? '#1677ff' : '#ffffff',
                    color: msg.sender === 'user' ? '#fff' : '#333',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    fontSize: '0.88rem',
                    lineHeight: 1.4,
                  }}
                >
                  {msg.text}
                  <div
                    style={{
                      fontSize: '0.65rem',
                      color: msg.sender === 'user' ? '#d6e4ff' : '#999',
                      textAlign: 'right',
                      marginTop: 4,
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <Avatar size="small" style={{ backgroundColor: '#52c41a' }} icon={<UserOutlined />} />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div
            style={{
              padding: '6px 12px',
              background: '#fff',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {quickQuestions.map((q) => (
              <Tag
                key={q}
                color="blue"
                style={{ cursor: 'pointer', borderRadius: 12, padding: '2px 8px' }}
                onClick={() => handleSend(q)}
              >
                {q}
              </Tag>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ padding: '10px 12px', background: '#fff', borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
            <Input
              placeholder="Ask anything about your account..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onPressEnter={() => handleSend()}
              style={{ borderRadius: 20 }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={() => handleSend()}
              disabled={!inputMsg.trim()}
            />
          </div>
        </Card>
      )}
    </>
  );
}
