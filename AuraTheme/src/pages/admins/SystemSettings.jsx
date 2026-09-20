import React, { useState } from 'react';
import { Card, Col, Flex, Row, Space, Switch, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { getMenuByKey, getModuleByKey } from '../../data/erpModules';

const { Text, Title } = Typography;

const settingsGroups = [
  {
    title: 'Platform',
    items: [
      { key: 'maintenance', label: 'Maintenance Mode', desc: 'Temporarily disable storefront checkout', default: false },
      { key: 'multiCurrency', label: 'Multi-Currency', desc: 'Allow prices in more than one currency', default: true },
      { key: 'guestCheckout', label: 'Guest Checkout', desc: 'Allow purchases without an account', default: true },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { key: 'emailAlerts', label: 'Email Alerts', desc: 'Send order and stock alerts by email', default: true },
      { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Send critical alerts by SMS', default: false },
      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summarize activity every Monday', default: true },
    ],
  },
  {
    title: 'Security',
    items: [
      { key: 'twoFactor', label: 'Require Two-Factor Auth', desc: 'Enforce 2FA for all admin operators', default: true },
      { key: 'sessionTimeout', label: 'Auto Session Timeout', desc: 'Sign out idle sessions after 30 minutes', default: true },
    ],
  },
];

const SystemSettings = () => {
  const adminTheme = useAdminTheme();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const moduleKey = searchParams.get('module') || 'settings';
  const menuKey = searchParams.get('menu') || 'system-settings';
  
  // Get module info for breadcrumb-like display
  const module = getModuleByKey(moduleKey);
  const menu = getMenuByKey(moduleKey, menuKey);
  
  const [state, setState] = useState(() =>
    Object.fromEntries(settingsGroups.flatMap((g) => g.items.map((item) => [item.key, item.default])))
  );

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <div>
        <Text style={{ color: adminTheme.subtext, fontSize: 12.5 }}>
          {module.label}
          {menu?.groupPath?.length ? ` / ${menu.groupPath.join(' / ')}` : ''}
        </Text>
        <Title level={4} style={{ margin: '2px 0 0', color: adminTheme.text }}>
          System Settings
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        {settingsGroups.map((group) => (
          <Col xs={24} lg={8} key={group.title}>
            <Card 
              style={{ 
                borderRadius: 18, 
                border: `1px solid ${adminTheme.border}`, 
                background: adminTheme.card, 
                height: '100%' 
              }} 
              styles={{ body: { padding: 20 } }}
            >
              <Title level={5} style={{ margin: '0 0 14px', color: adminTheme.text }}>
                {group.title}
              </Title>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {group.items.map((item) => (
                  <Flex key={item.key} justify="space-between" align="center">
                    <div style={{ maxWidth: '80%' }}>
                      <Text strong style={{ display: 'block', color: adminTheme.text, fontSize: 13 }}>
                        {item.label}
                      </Text>
                      <Text style={{ color: adminTheme.subtext, fontSize: 11.5 }}>
                        {item.desc}
                      </Text>
                    </div>
                    <Switch
                      checked={state[item.key]}
                      onChange={(checked) => setState((prev) => ({ ...prev, [item.key]: checked }))}
                      style={{ background: state[item.key] ? adminTheme.primary : undefined }}
                    />
                  </Flex>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default SystemSettings;