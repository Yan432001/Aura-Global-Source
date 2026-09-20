import React from 'react';
import { Row, Col, Card, Space, Tag, Button, Avatar, Divider } from 'antd';
import { Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Profile = () => (
  <div style={{ padding: 0 }}>
    {/* Profile Header */}
    <div style={{
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      padding: '48px 32px',
      textAlign: 'center',
      borderRadius: 24,
      color: 'white',
      marginBottom: 48,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }}>
      <Avatar size={120} style={{ background: '#FFFFFF', marginBottom: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <UserOutlined style={{ fontSize: 60, color: '#6366F1' }} />
      </Avatar>
      <Title level={2} style={{ fontSize: '32px', margin: '0 0 8px 0', color: 'white', fontWeight: 700 }}>John Doe</Title>
      <Paragraph style={{ fontSize: '16px', margin: '0', color: 'rgba(255,255,255,0.9)' }}>Premium Member • Joined 6 months ago</Paragraph>
    </div>
    {/* Stats Overview */}
    <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
      <Col xs={24} sm={12} md={6}>
        <Card style={{ borderRadius: 16, textAlign: 'center', background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)', borderColor: 'transparent' }}>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>24</div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>Posts Created</div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card style={{ borderRadius: 16, textAlign: 'center', background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', borderColor: 'transparent' }}>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>156</div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>Followers</div>
          </div>
        </Card>
      </Col>
      {/* Add other stats... */}
    </Row>
    {/* Badges and Settings Row */}
    <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
      <Col xs={24} md={12}>
        <Card style={{ borderRadius: 16 }} title={<div style={{ fontSize: 16, fontWeight: 700 }}>🏆 Your Badges</div>}>
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            <Tag color="#6366F1" style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, width: '100%', textAlign: 'center', border: 'none' }}>✨ Inspired Creator</Tag>
            {/* Other badges */}
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card style={{ borderRadius: 16 }} title={<div style={{ fontSize: 16, fontWeight: 700 }}>⚙️ Settings</div>}>
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            <Button type="primary" block style={{ borderRadius: 8, height: 40 }}>Edit Profile</Button>
            <Button block style={{ borderRadius: 8, height: 40 }}>Privacy Settings</Button>
            <Button block style={{ borderRadius: 8, height: 40 }}>Notification Preferences</Button>
          </Space>
        </Card>
      </Col>
    </Row>
    {/* Recent Orders */}
    <Title level={2} style={{ marginBottom: 24, fontSize: 24, fontWeight: 700 }}>📦 Recent Orders</Title>
    <Row gutter={[24, 24]}>
      {[
        { id: 'ORD-001', items: 3, total: 159.99, date: '2025-11-10', status: 'Delivered' },
        // ... other orders
      ].map((order) => (
        <Col xs={24} sm={12} md={6} key={order.id}>
          <Card style={{ borderRadius: 16 }} hoverable>
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{order.id}</div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">{order.items} items</Text>
                <Text strong>${order.total}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{order.date}</Text>
                <Tag color={order.status === 'Delivered' ? '#10B981' : order.status === 'Shipped' ? '#06B6D4' : '#F59E0B'}>{order.status}</Tag>
              </div>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default Profile;