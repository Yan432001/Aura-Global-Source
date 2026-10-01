import React from 'react';
import { Avatar, Button, Card, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text, Title } = Typography;

const avatarUrl = (seed) => `https://i.pravatar.cc/80?img=${seed}`;

const accounts = [
  { key: 1, name: 'Nila S.', email: 'nila@auraerp.com', role: 'Super Admin', status: 'Active', avatar: avatarUrl(30) },
  { key: 2, name: 'Arun P.', email: 'arun@auraerp.com', role: 'Inventory Lead', status: 'Active', avatar: avatarUrl(31) },
  { key: 3, name: 'Linh T.', email: 'linh@auraerp.com', role: 'Commerce Ops', status: 'Invited', avatar: avatarUrl(32) },
  { key: 4, name: 'Mika A.', email: 'mika@auraerp.com', role: 'Support Lead', status: 'Active', avatar: avatarUrl(33) },
  { key: 5, name: 'Devon K.', email: 'devon@auraerp.com', role: 'Finance', status: 'Suspended', avatar: avatarUrl(34) },
];

const statusColor = { Active: 'green', Invited: 'blue', Suspended: 'red' };

const UserManagement = () => {
  const adminTheme = useAdminTheme();

  const columns = [
    {
      title: 'Account',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space size={10}>
          <Avatar size={34} src={record.avatar} />
          <div>
            <Text strong style={{ display: 'block', color: adminTheme.text }}>{name}</Text>
            <Text style={{ color: adminTheme.subtext, fontSize: 12 }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v) => <Tag color={statusColor[v]} style={{ borderRadius: 999 }}>{v}</Tag>,
    },
  ];

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: adminTheme.text }}>User Management</Title>
          <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>Admin operator accounts and access status</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 10, background: adminTheme.primary, border: 'none' }}>
          Invite Operator
        </Button>
      </div>

      <Card style={{ borderRadius: 18, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 20 } }}>
        <Table columns={columns} dataSource={accounts} pagination={false} size="small" scroll={{ x: 480 }} />
      </Card>
    </Space>
  );
};

export default UserManagement;
