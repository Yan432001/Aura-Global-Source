import React from 'react';
import { Card, Col, List, Row, Space, Table, Tag, Typography } from 'antd';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text, Title } = Typography;

const userRows = [
  { key: '1', name: 'Nila S.', role: 'Super Admin', branch: 'HQ', status: 'Active' },
  { key: '2', name: 'Arun P.', role: 'Inventory Lead', branch: 'Bangkok', status: 'Review' },
  { key: '3', name: 'Linh T.', role: 'Commerce Ops', branch: 'Ho Chi Minh City', status: 'Active' },
  { key: '4', name: 'Mika A.', role: 'Support Lead', branch: 'Jakarta', status: 'Active' },
];

const userColumns = [
  { title: 'Operator', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Branch', dataIndex: 'branch', key: 'branch' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (value) => (
      <Tag color={value === 'Active' ? 'green' : 'orange'} style={{ borderRadius: 999 }}>
        {value}
      </Tag>
    ),
  },
];

const roleChecks = [
  '6 accounts need quarterly permission review',
  '2 password reset requests are pending approval',
  'MFA adoption has reached 96% across operator roles',
];

const AdminUsers = () => {
  const adminTheme = useAdminTheme();
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Card style={{ borderRadius: 18, border: `1px solid ${adminTheme.border}`, background: `linear-gradient(140deg, rgba(255,255,255,0.98), ${adminTheme.systemTealSoft})` }} styles={{ body: { padding: 24 } }}>
        <Tag style={{ borderRadius: 999, border: 'none', background: adminTheme.systemTealSoft, color: adminTheme.systemTeal, padding: '6px 12px', fontWeight: 700, marginBottom: 12 }}>
          Access controller
        </Tag>
        <Title level={2} style={{ marginTop: 0, marginBottom: 8, color: adminTheme.text }}>
          User roles and permission oversight
        </Title>
        <Text style={{ color: adminTheme.subtext, fontSize: 16 }}>
          Present operator management as a secure control surface instead of a placeholder page.
        </Text>
      </Card>

      <Row gutter={[18, 18]}>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 16, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 20 } }}>
            <Text style={{ color: adminTheme.subtext }}>Active operators</Text>
            <Title level={3} style={{ margin: '8px 0 0', color: adminTheme.text }}>42</Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 16, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 20 } }}>
            <Text style={{ color: adminTheme.subtext }}>Reviews due</Text>
            <Title level={3} style={{ margin: '8px 0 0', color: adminTheme.text }}>6</Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 16, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 20 } }}>
            <Text style={{ color: adminTheme.subtext }}>Protected accounts</Text>
            <Title level={3} style={{ margin: '8px 0 0', color: adminTheme.text }}>96%</Title>
          </Card>
        </Col>
      </Row>

      <Row gutter={[18, 18]}>
        <Col xs={24} xl={9}>
          <Card style={{ borderRadius: 18, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 22 } }}>
            <Title level={4} style={{ marginTop: 0, color: adminTheme.text }}>
              Access review queue
            </Title>
            <Text style={{ color: adminTheme.subtext, display: 'block', marginBottom: 18 }}>
              Items that need admin attention.
            </Text>
            <List
              dataSource={roleChecks}
              renderItem={(item) => (
                <List.Item style={{ paddingInline: 0 }}>
                  <Card style={{ width: '100%', borderRadius: 14, background: adminTheme.cardMuted, border: `1px solid ${adminTheme.border}` }} styles={{ body: { padding: 16 } }}>
                    <Text style={{ color: adminTheme.text }}>{item}</Text>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} xl={15}>
          <Card style={{ borderRadius: 18, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 22 } }}>
            <Title level={4} style={{ marginTop: 0, color: adminTheme.text }}>
              Operator registry
            </Title>
            <Text style={{ color: adminTheme.subtext, display: 'block', marginBottom: 18 }}>
              Current team members with branch and role visibility.
            </Text>
            <Table columns={userColumns} dataSource={userRows} pagination={false} size="small" scroll={{ x: 560 }} />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default AdminUsers;
