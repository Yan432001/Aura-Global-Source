import React from 'react';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import {
  BookOutlined,
  BulbOutlined,
  ReadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { publicTheme } from '../../utils/webTheme';

const { Title, Paragraph, Text } = Typography;

const academyTracks = [
  {
    title: 'Business basics',
    icon: <BookOutlined />,
    text: 'Understand pricing, customer trust, operations, and how to manage a small online business well.',
    modules: '7 courses',
  },
  {
    title: 'How to start a business here',
    icon: <BulbOutlined />,
    text: 'Learn shop setup, product publishing, order flow, customer support, and first sales on this website.',
    modules: '9 courses',
  },
  {
    title: 'Education and school community',
    icon: <TeamOutlined />,
    text: 'Provide learning paths for students, school communities, and educational teams using the platform.',
    modules: '6 courses',
  },
];

const highlights = [
  {
    title: 'Startup guide',
    value: '12 steps',
    text: 'A guided checklist for launching a shop and setting up your first products.',
  },
  {
    title: 'Community lessons',
    value: '18 topics',
    text: 'Content for collaboration, communication, and education-focused community activity.',
  },
  {
    title: 'Seller resources',
    value: '24 files',
    text: 'Templates, playbooks, and guides to help teams run their business better.',
  },
];

const Learn = () => (
  <div style={{ padding: 0 }}>
    <Card
      className="frosted-panel stagger-rise"
      style={{
        borderRadius: 32,
        border: `1px solid ${publicTheme.border}`,
        boxShadow: publicTheme.shadow,
        background: publicTheme.heroBackground,
        marginBottom: 24,
      }}
      styles={{ body: { padding: 28 } }}
    >
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} lg={15}>
          <Space direction="vertical" size={16}>
            <Tag style={{ width: 'fit-content', borderRadius: 999, border: 'none', background: publicTheme.pill, color: publicTheme.primary, fontWeight: 700, padding: '8px 14px' }}>
              Learn page
            </Tag>
            <Title level={1} style={{ margin: 0, color: publicTheme.text, fontSize: 'clamp(30px, 4vw, 50px)', lineHeight: 1.06 }}>
              Courses for business, startup, and education community growth.
            </Title>
            <Paragraph style={{ margin: 0, color: publicTheme.subtext, fontSize: 16, maxWidth: 760 }}>
              The learning section is now focused on useful topics for this website: how to run a business, how to start selling here, and how education or school communities can learn together.
            </Paragraph>
            <Space wrap>
              <Button
                type="primary"
                style={{ height: 46, borderRadius: 16, background: publicTheme.ribbon, border: 'none', fontWeight: 700 }}
              >
                Start learning
              </Button>
              <Button style={{ height: 46, borderRadius: 16, fontWeight: 700 }}>
                Download guides
              </Button>
            </Space>
          </Space>
        </Col>

        <Col xs={24} lg={9}>
          <div
            style={{
              borderRadius: 28,
              padding: 22,
              background: 'linear-gradient(160deg, #1c2333 0%, #2f6fed 100%)',
              color: 'white',
            }}
          >
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <ReadOutlined style={{ fontSize: 22, color: '#b7efe3' }} />
              <Title level={3} style={{ margin: 0, color: 'white' }}>
                Learning that fits the website
              </Title>
              <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.76)' }}>
                Every course block now supports the real website journey instead of showing random or overloaded content.
              </Paragraph>
            </Space>
          </div>
        </Col>
      </Row>
    </Card>

    <Row gutter={[18, 18]} style={{ marginBottom: 24 }}>
      {academyTracks.map((track) => (
        <Col xs={24} md={12} xl={8} key={track.title}>
          <Card
            style={{
              height: '100%',
              borderRadius: 28,
              border: `1px solid ${publicTheme.border}`,
              background: publicTheme.cardBackground,
              boxShadow: publicTheme.lightShadow,
            }}
            styles={{ body: { padding: 24 } }}
          >
            <Space direction="vertical" size={14}>
              <div style={{ color: publicTheme.primary, fontSize: 22 }}>{track.icon}</div>
              <div>
                <Title level={4} style={{ margin: 0, color: publicTheme.text }}>
                  {track.title}
                </Title>
                <Text style={{ color: publicTheme.secondary, fontWeight: 700 }}>{track.modules}</Text>
              </div>
              <Paragraph style={{ margin: 0, color: publicTheme.subtext }}>
                {track.text}
              </Paragraph>
              <Button type="link" style={{ padding: 0, color: publicTheme.primary, fontWeight: 700 }}>
                View courses
              </Button>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>

    <Card
      style={{
        borderRadius: 30,
        border: `1px solid ${publicTheme.border}`,
        background: publicTheme.cardBackground,
        boxShadow: publicTheme.lightShadow,
      }}
      styles={{ body: { padding: 24 } }}
    >
      <Row gutter={[18, 18]}>
        {highlights.map((item) => (
          <Col xs={24} md={8} key={item.title}>
            <div
              style={{
                height: '100%',
                borderRadius: 24,
                background: publicTheme.cardMuted,
                border: `1px solid ${publicTheme.softBorder}`,
                padding: 20,
              }}
            >
              <Text style={{ color: publicTheme.subtext }}>{item.title}</Text>
              <Title level={2} style={{ margin: '8px 0', color: publicTheme.text }}>
                {item.value}
              </Title>
              <Paragraph style={{ margin: 0, color: publicTheme.subtext }}>
                {item.text}
              </Paragraph>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  </div>
);

export default Learn;
