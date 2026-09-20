import React, { useMemo } from 'react';
import { Button, Card, Col, Flex, Grid, Row, Space, Tag, Typography } from 'antd';
import {
  ApiOutlined,
  CheckCircleFilled,
  CloudServerOutlined,
  CloudSyncOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  LockOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
  SyncOutlined,
  TeamOutlined,
  ToolOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Area,
  AreaChart,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const kpiCards = [
  { title: 'ERP System Uptime', value: '99.9%', sub: 'Last 30 days', icon: <CloudServerOutlined />, colorKey: 'orange', bars: [8, 14, 10, 22, 16, 26, 18, 30, 20, 34, 24, 40] },
  { title: 'API Status', value: 'Healthy', sub: 'All operational', icon: <ApiOutlined />, colorKey: 'teal', bars: [20, 10, 26, 12, 30, 14, 24, 10, 28, 16, 22, 12] },
  { title: 'Open ERP Tickets', value: '18', sub: '5 high priority', icon: <SafetyCertificateOutlined />, colorKey: 'orange', bars: [12, 18, 14, 24, 12, 20, 16, 26, 14, 22, 18, 28] },
  { title: 'Background Jobs', value: 'Running', sub: '12/12 jobs healthy', icon: <ClusterOutlined />, colorKey: 'teal', bars: [10, 10, 10, 34, 10, 10, 10, 10, 10, 10, 10, 10] },
];

const storageByModule = [
  { module: 'Inventory', gb: 280 },
  { module: 'Sales', gb: 260 },
  { module: 'Accounting', gb: 140, highlight: true },
  { module: 'HR', gb: 68 },
  { module: 'Payroll', gb: 120 },
  { module: 'Procurement', gb: 260 },
];
const maxStorage = Math.max(...storageByModule.map((m) => m.gb));

const moduleUptime = [
  { module: 'Inventory', uptime: '99.9%', ok: true },
  { module: 'Sales Engine', uptime: '99.8%', ok: true },
  { module: 'Accounting Sync', uptime: '98.5%', ok: true },
  { module: 'HR Module', uptime: '19.7%', ok: false },
  { module: 'Payroll Engine', uptime: '99.9%', ok: true },
  { module: 'Procurement Sync', uptime: '97.2%', ok: true },
];

const mfaTotal = 24;
const mfaFilled = 21;

const quickActions = [
  { label: 'Restart ERP Services', icon: <ReloadOutlined /> },
  { label: 'Sync Inventory', icon: <SyncOutlined /> },
  { label: 'Clear System Cache', icon: <DeleteOutlined /> },
  { label: 'Schedule Maintenance', icon: <ScheduleOutlined /> },
  { label: 'Stop Background Jobs', icon: <PauseCircleOutlined /> },
  { label: 'Re-run Payroll Job', icon: <ToolOutlined /> },
];

const peakHours = [
  { time: '9 AM', percent: 85 },
  { time: '10 AM', percent: 92 },
  { time: '11 AM', percent: 78 },
  { time: '12 PM', percent: 45 },
  { time: '1 PM', percent: 38 },
  { time: '2 PM', percent: 68 },
  { time: '3 PM', percent: 82 },
  { time: '4 PM', percent: 95 },
  { time: '5 PM', percent: 88 },
  { time: '6 PM', percent: 52 },
];

const loginCount = [
  { time: '09:00 AM', count: 320 }, { time: '10:00 AM', count: 480 }, { time: '11:00 AM', count: 610 },
  { time: '12:00 PM', count: 540 }, { time: '01:00 PM', count: 700 }, { time: '02:00 PM', count: 460 },
  { time: '03:00 PM', count: 586 }, { time: '04:00 PM', count: 720 }, { time: '05:00 PM', count: 520 },
  { time: '06:00 PM', count: 640 }, { time: '07:00 PM', count: 400 }, { time: '08:00 PM', count: 300 },
];

const usageTrend = [
  { day: 'Mon', users: 2400 }, { day: 'Tue', users: 5600 }, { day: 'Wed', users: 5400 },
  { day: 'Thu', users: 2200 }, { day: 'Fri', users: 5800 }, { day: 'Sat', users: 7600 }, { day: 'Sun', users: 7500 },
];

const securityCompliance = [
  { label: 'Failed Logins', value: 47, sub: 'Last 24h', colorKey: 'red', spark: [4, 8, 5, 12, 7, 15, 10, 20, 14, 24] },
  { label: 'Suspicious Alerts', value: 12, sub: 'Active', colorKey: 'teal', spark: [10, 8, 12, 6, 14, 9, 16, 11, 13, 12] },
  { label: 'Blocked IPs', value: 34, sub: 'Currently blocked', colorKey: 'orange', spark: [6, 10, 8, 16, 12, 20, 15, 24, 18, 26] },
];

const userRoles = [
  { label: 'Employees', value: 2145, colorKey: 'orange', width: '58%' },
  { label: 'Managers', value: 234, colorKey: 'teal', width: '22%' },
  { label: 'HR Operations', value: 45, colorKey: 'dark', width: '12%' },
  { label: 'Admins', value: 12, colorKey: 'gold', width: '8%' },
];

const heatmapGrid = Array.from({ length: 9 }, (_, row) =>
  Array.from({ length: 24 }, (_, col) => (row * 7 + col * 3) % 11)
);

const MiniBars = ({ data, color }) => (
  <Flex align="flex-end" gap={3} style={{ height: 32 }}>
    {data.map((v, i) => (
      <div key={i} style={{ width: 4, height: v, borderRadius: 2, background: color, opacity: 0.35 + (i / data.length) * 0.65 }} />
    ))}
  </Flex>
);

const MiniSparkline = ({ data, color }) => {
  const w = 90;
  const h = 34;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const AdminDashboard = () => {
  const adminTheme = useAdminTheme();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const chartHeight = isMobile ? 200 : 240;
  const rangePills = useMemo(() => ['1H', '1D', '1W', '1M'], []);

  const c = {
    teal: adminTheme.systemTeal,
    orange: adminTheme.systemOrange,
    orangeSoft: adminTheme.systemOrangeSoft,
    green: '#22c55e',
    greenSoft: 'rgba(34,197,94,0.14)',
    red: '#f5484d',
    redSoft: 'rgba(245,72,77,0.14)',
    gold: '#f0b429',
    dark: adminTheme.text,
  };

  const cardStyle = {
    borderRadius: 18,
    border: `1px solid ${adminTheme.border}`,
    background: adminTheme.card,
    height: '100%',
  };

  const pillBtn = (active) => ({
    border: `1px solid ${active ? c.teal : adminTheme.border}`,
    background: active ? c.teal : 'transparent',
    color: active ? '#fff' : adminTheme.subtext,
    borderRadius: 8,
    padding: '3px 10px',
    fontSize: 11.5,
    fontWeight: 700,
    cursor: 'pointer',
  });

  const peakColor = (percent) => {
    if (percent >= 90) return c.red;
    if (percent >= 70) return c.gold;
    if (percent >= 50) return c.green;
    return c.orange;
  };

  const heatmapColor = (level) => {
    if (level <= 2) return adminTheme.cardMuted;
    if (level <= 4) return c.orangeSoft;
    if (level <= 6) return '#f9c397';
    if (level <= 8) return '#f4762a';
    return '#c94f13';
  };

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <div>
          <Title level={4} style={{ margin: 0, color: adminTheme.text }}>IT Admin Dashboard</Title>
          <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>Dashboard / IT Admin Dashboard</Text>
        </div>
        <Space size={10} wrap>
          <Tag icon={<CheckCircleFilled />} style={{ margin: 0, borderRadius: 8, border: 'none', background: c.greenSoft, color: c.green, padding: '6px 12px', fontWeight: 700 }}>
            Active Users 248
          </Tag>
          <Tag icon={<ExclamationCircleFilled />} style={{ margin: 0, borderRadius: 8, border: 'none', background: c.redSoft, color: c.red, padding: '6px 12px', fontWeight: 700 }}>
            Security Alerts 3
          </Tag>
          <Space size={0} style={{ border: `1px solid ${adminTheme.border}`, borderRadius: 8, padding: 3 }}>
            <Button size="small" type="text" style={{ background: c.orange, color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 12 }}>Production</Button>
            <Button size="small" type="text" style={{ color: adminTheme.subtext, fontSize: 12 }}>Staging</Button>
            <Button size="small" type="text" style={{ color: adminTheme.subtext, fontSize: 12 }}>Development</Button>
          </Space>
        </Space>
      </Flex>

      <Row gutter={[16, 16]}>
        {kpiCards.map((item) => (
          <Col xs={12} lg={6} key={item.title}>
            <Card style={cardStyle} styles={{ body: { padding: 18 } }}>
              <Flex justify="space-between" align="flex-start">
                <div>
                  <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>{item.title}</Text>
                  <Title level={3} style={{ margin: '4px 0 2px', color: adminTheme.text }}>{item.value}</Title>
                  <Text style={{ color: adminTheme.subtext, fontSize: 11.5 }}>{item.sub}</Text>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${c[item.colorKey]}1a`, color: c[item.colorKey], display: 'grid', placeItems: 'center', fontSize: 16 }}>
                  {item.icon}
                </div>
              </Flex>
              <div style={{ marginTop: 10 }}>
                <MiniBars data={item.bars} color={c[item.colorKey]} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
              <Flex align="center" gap={8}>
                <DatabaseOutlined style={{ color: c.teal }} />
                <Title level={5} style={{ margin: 0, color: adminTheme.text }}>Storage Usage by Module (GB)</Title>
              </Flex>
              <Space size={6}>
                {rangePills.map((p) => (
                  <span key={p} style={pillBtn(p === '1H')}>{p}</span>
                ))}
              </Space>
            </Flex>
            <Row gutter={[10, 10]}>
              {storageByModule.map((item) => (
                <Col span={4} key={item.module}>
                  <Flex vertical align="center" gap={8}>
                    <div style={{ width: '100%', height: 160, borderRadius: 10, background: adminTheme.cardMuted, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${(item.gb / maxStorage) * 100}%`,
                          background: item.highlight ? c.orange : c.teal,
                          borderRadius: '10px 10px 0 0',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          paddingTop: 8,
                        }}
                      >
                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{item.gb} GB</Text>
                      </div>
                    </div>
                    <Text style={{ color: adminTheme.subtext, fontSize: 11.5 }}>{item.module}</Text>
                  </Flex>
                </Col>
              ))}
            </Row>
            <Row gutter={[10, 10]} style={{ marginTop: 16 }}>
              {moduleUptime.map((item) => (
                <Col xs={12} sm={8} key={item.module}>
                  <Flex justify="space-between" align="center" style={{ padding: '10px 12px', borderRadius: 10, background: adminTheme.cardMuted }}>
                    <div>
                      <Text style={{ color: adminTheme.text, fontSize: 12.5, fontWeight: 600, display: 'block' }}>{item.module}</Text>
                      <Text style={{ color: adminTheme.subtext, fontSize: 11.5 }}>Uptime: {item.uptime}</Text>
                    </div>
                    {item.ok
                      ? <CheckCircleFilled style={{ color: c.green, fontSize: 16 }} />
                      : <ExclamationCircleFilled style={{ color: c.red, fontSize: 16 }} />}
                  </Flex>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
              <Flex align="center" gap={8} style={{ marginBottom: 14 }}>
                <LockOutlined style={{ color: c.teal }} />
                <Title level={5} style={{ margin: 0, color: adminTheme.text }}>MFA Enabled Users</Title>
              </Flex>
              <Flex justify="space-between" align="center" style={{ marginBottom: 10 }}>
                <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>2,168 out of 2,436 users</Text>
                <Text strong style={{ color: adminTheme.text }}>89%</Text>
              </Flex>
              <Flex gap={5} wrap="wrap">
                {Array.from({ length: mfaTotal }).map((_, i) => (
                  <span key={i} style={{ width: 12, height: 12, borderRadius: 999, background: i < mfaFilled ? c.orange : adminTheme.cardMuted }} />
                ))}
              </Flex>
            </Card>

            <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
              <Flex align="center" gap={8} style={{ marginBottom: 14 }}>
                <CloudSyncOutlined style={{ color: c.teal }} />
                <Title level={5} style={{ margin: 0, color: adminTheme.text }}>Quick IT Actions</Title>
              </Flex>
              <Row gutter={[10, 14]}>
                {quickActions.map((action) => (
                  <Col span={8} key={action.label}>
                    <Flex vertical align="center" gap={6}>
                      <Button
                        shape="circle"
                        icon={action.icon}
                        style={{ width: 46, height: 46, background: c.dark, color: adminTheme.card, border: 'none', fontSize: 16 }}
                      />
                      <Text style={{ color: adminTheme.subtext, fontSize: 10.5, textAlign: 'center', lineHeight: 1.2 }}>{action.label}</Text>
                    </Flex>
                  </Col>
                ))}
              </Row>
            </Card>
          </Space>
        </Col>
      </Row>

      <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
        <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
          <TeamOutlined style={{ color: c.teal }} />
          <Title level={5} style={{ margin: 0, color: adminTheme.text }}>User Access &amp; Role Management</Title>
        </Flex>

        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }} wrap="wrap" gap={8}>
          <Text strong style={{ color: adminTheme.text }}>Peak Hours (Today)</Text>
          <Space size={14} wrap>
            {[{ l: 'Low (0-50%)', color: c.orange }, { l: 'Medium (50-70%)', color: c.green }, { l: 'High (70-90%)', color: c.gold }, { l: 'Peak (90-100%)', color: c.red }].map((x) => (
              <Text key={x.l} style={{ fontSize: 11.5, color: adminTheme.subtext }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: x.color, marginRight: 6 }} />
                {x.l}
              </Text>
            ))}
          </Space>
        </Flex>

        <Row gutter={[10, 10]}>
          {peakHours.map((item) => {
            const tone = peakColor(item.percent);
            return (
              <Col xs={12} sm={8} md={4} key={item.time}>
                <div style={{ padding: 12, borderRadius: 10, background: adminTheme.cardMuted }}>
                  <Flex justify="space-between" align="center">
                    <Text style={{ color: adminTheme.subtext, fontSize: 11.5 }}>{item.time}</Text>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: tone }} />
                  </Flex>
                  <Title level={5} style={{ margin: '2px 0 8px', color: adminTheme.text }}>{item.percent}%</Title>
                  <div style={{ height: 5, borderRadius: 999, background: adminTheme.border }}>
                    <div style={{ width: `${item.percent}%`, height: '100%', borderRadius: 999, background: tone }} />
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        <Text strong style={{ color: adminTheme.text, display: 'block', margin: '20px 0 10px' }}>Login Count Analysis</Text>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={loginCount} margin={{ left: -20, right: 10 }}>
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: adminTheme.subtext }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: adminTheme.subtext }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: `1px solid ${adminTheme.border}`, background: adminTheme.card, color: adminTheme.text }}
              formatter={(value) => [value, 'Login Count']}
            />
            <Area type="monotone" dataKey="count" stroke={c.orange} strokeWidth={2} fill={c.orange} fillOpacity={0.16} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 14 }}>
                <Flex align="center" gap={8}>
                  <ClusterOutlined style={{ color: c.teal }} />
                  <Title level={5} style={{ margin: 0, color: adminTheme.text }}>ERP Usage Trend</Title>
                </Flex>
                <Space size={6}>
                  {rangePills.map((p) => (
                    <span key={p} style={pillBtn(p === '1W')}>{p}</span>
                  ))}
                </Space>
              </Flex>
              <ResponsiveContainer width="100%" height={chartHeight - 20}>
                <ComposedChart data={usageTrend} margin={{ left: -20, right: 10 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: adminTheme.subtext }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: adminTheme.subtext }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${adminTheme.border}`, background: adminTheme.card, color: adminTheme.text }} />
                  <Area type="monotone" dataKey="users" stroke={c.teal} strokeWidth={2} fill={c.teal} fillOpacity={0.14} />
                  <Line type="monotone" dataKey="users" stroke={c.teal} strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
              <Title level={5} style={{ margin: '0 0 14px', color: adminTheme.text }}>Security &amp; Compliance</Title>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {securityCompliance.map((item) => (
                  <Flex key={item.label} justify="space-between" align="center">
                    <div>
                      <Title level={3} style={{ margin: 0, color: adminTheme.text, display: 'inline-block', marginRight: 10 }}>{item.value}</Title>
                      <Text style={{ color: adminTheme.text, fontSize: 12.5, fontWeight: 600 }}>{item.label}</Text>
                      <Text style={{ color: adminTheme.subtext, fontSize: 11.5, display: 'block' }}>{item.sub}</Text>
                    </div>
                    <MiniSparkline data={item.spark} color={c[item.colorKey]} />
                  </Flex>
                ))}
              </Space>
            </Card>
          </Space>
        </Col>

        <Col xs={24} xl={12}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0, color: adminTheme.text }}>User Roles Distribution</Title>
                <Text style={{ color: adminTheme.subtext, fontSize: 12 }}>Monthly</Text>
              </Flex>
              <Flex style={{ height: 14, borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
                {userRoles.map((role) => (
                  <div key={role.label} style={{ width: role.width, background: c[role.colorKey] }} />
                ))}
              </Flex>
              <Row gutter={[12, 12]}>
                {userRoles.map((role) => (
                  <Col span={12} key={role.label}>
                    <Text style={{ color: adminTheme.subtext, fontSize: 12 }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: c[role.colorKey], marginRight: 6 }} />
                      {role.label}
                    </Text>
                    <Title level={4} style={{ margin: '2px 0 0', color: adminTheme.text }}>{role.value.toLocaleString()}</Title>
                  </Col>
                ))}
              </Row>
            </Card>

            <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 14 }}>
                <Flex align="center" gap={8}>
                  <WarningOutlined style={{ color: c.orange }} />
                  <Title level={5} style={{ margin: 0, color: adminTheme.text }}>Integration Error Counts (24h)</Title>
                </Flex>
              </Flex>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowX: 'auto' }}>
                {heatmapGrid.map((row, r) => (
                  <div key={r} style={{ display: 'flex', gap: 4 }}>
                    {row.map((level, cIdx) => (
                      <div key={cIdx} style={{ width: 14, height: 14, borderRadius: 4, background: heatmapColor(level), flexShrink: 0 }} />
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </Space>
  );
};

export default AdminDashboard;
