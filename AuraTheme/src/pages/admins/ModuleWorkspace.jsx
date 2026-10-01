import React, { useMemo } from 'react';
import { Avatar, Badge, Button, Card, Col, Empty, Flex, Row, Space, Table, Tag, Typography } from 'antd';
import { CheckCircleFilled, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMenuByKey, getModuleByKey, moduleHealthLabel } from '../../data/erpModules';
import { formatCurrency } from '../../utils/uiTheme';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text, Title } = Typography;

const healthTone = {
  stable: { bg: '#e7faf0', color: '#22c55e' },
  watch: { bg: '#fdf3d9', color: '#f0b429' },
  paused: { bg: '#f2f3f5', color: '#8a94a6' },
};

const mockRows = (moduleLabel) =>
  Array.from({ length: 6 }).map((_, i) => ({
    key: i,
    id: `#${moduleLabel.slice(0, 3).toUpperCase()}-${1040 + i}`,
    name: ['Riverside Order', 'North Branch Batch', 'Central Ledger Entry', 'East Depot Transfer', 'Weekly Snapshot', 'Partner Reconciliation'][i],
    status: ['Active', 'Pending', 'Active', 'Review', 'Active', 'Pending'][i],
    updated: ['2 hours ago', 'Yesterday', '3 days ago', '5 days ago', '1 week ago', '2 weeks ago'][i],
    amount: 1200 + i * 460,
  }));

const statusColor = { Active: 'green', Pending: 'gold', Review: 'blue' };

const ModuleWorkspace = () => {
  const adminTheme = useAdminTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const moduleKey = searchParams.get('module');
  const menuKey = searchParams.get('menu');

  const module = useMemo(() => getModuleByKey(moduleKey), [moduleKey]);
  const menu = useMemo(() => getMenuByKey(moduleKey, menuKey), [moduleKey, menuKey]);
  const rows = useMemo(() => mockRows(module.label), [module.label]);
  const tone = healthTone[module.health] || healthTone.stable;

  const columns = [
    { title: 'Reference', dataIndex: 'id', key: 'id', render: (v) => <Text strong style={{ color: module.accent }}>{v}</Text> },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v) => <Tag color={statusColor[v]} style={{ borderRadius: 999 }}>{v}</Tag>,
    },
    { title: 'Last Updated', dataIndex: 'updated', key: 'updated' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: formatCurrency },
  ];

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <div>
          <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>
            {module.label}
            {menu?.groupPath?.length ? ` / ${menu.groupPath.join(' / ')}` : ''}
          </Text>
          <Title level={4} style={{ margin: '2px 0 0', color: adminTheme.text }}>
            {menu?.label || module.label}
          </Title>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 10, background: module.accent, border: 'none' }}>
          New {menu?.label || module.label}
        </Button>
      </Flex>

      <Card style={{ borderRadius: 18, border: `1px solid ${adminTheme.border}`, background: `linear-gradient(140deg, rgba(255,255,255,0.98), ${module.accent}14)` }} styles={{ body: { padding: 22 } }}>
        <Row gutter={[20, 16]} align="middle">
          <Col xs={24} md={16}>
            <Flex align="center" gap={10} style={{ marginBottom: 8 }}>
              <Tag style={{ margin: 0, borderRadius: 999, border: 'none', background: tone.bg, color: tone.color, fontWeight: 700, padding: '4px 12px' }}>
                <CheckCircleFilled style={{ marginRight: 6 }} />
                {moduleHealthLabel[module.health]}
              </Tag>
              <Badge color={module.accent} text={<Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>{module.kpiLabel}: {module.kpiValue}</Text>} />
            </Flex>
            <Text style={{ color: adminTheme.text, fontSize: 14 }}>{module.description}</Text>
            <Text style={{ color: adminTheme.subtext, fontSize: 12.5, display: 'block', marginTop: 6 }}>{module.statusNote}</Text>
          </Col>
          <Col xs={24} md={8}>
            <Space direction="vertical" size={6} style={{ width: '100%' }}>
              {(module.detailBullets || []).map((bullet) => (
                <Flex key={bullet} align="flex-start" gap={8}>
                  <CheckCircleFilled style={{ color: module.accent, fontSize: 13, marginTop: 3 }} />
                  <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>{bullet}</Text>
                </Flex>
              ))}
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 18, border: `1px solid ${adminTheme.border}`, background: adminTheme.card }} styles={{ body: { padding: 20 } }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 14 }}>
          <Title level={5} style={{ margin: 0, color: adminTheme.text }}>{menu?.label || module.label} Records</Title>
          <Text style={{ color: adminTheme.subtext, fontSize: 12 }}>Preview data — connect this workspace to live records when ready</Text>
        </Flex>
        {rows.length ? (
          <Table columns={columns} dataSource={rows} pagination={false} size="small" scroll={{ x: 560 }} />
        ) : (
          <Empty description="No records yet" />
        )}
      </Card>
    </Space>
  );
};

export default ModuleWorkspace;
