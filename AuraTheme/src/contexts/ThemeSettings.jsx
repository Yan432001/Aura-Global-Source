import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Space,
  Switch,
  Divider,
  Typography,
  Card,
  Row,
  Col,
  Button,
  Tooltip,
  Badge,
  Slider,
  Select,
  InputNumber,
  ColorPicker,
  Form,
  Collapse,
  Input,
} from 'antd';
import {
  SettingOutlined,
  BulbOutlined,
  BgColorsOutlined,
  CheckOutlined,
  MoonOutlined,
  SunOutlined,
  FontSizeOutlined,
  FontColorsOutlined,
  BorderOutlined,
  LayoutOutlined,
  LineHeightOutlined,
  BorderInnerOutlined,
  PictureOutlined,
} from '@ant-design/icons';

import { useTheme } from './ThemeContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const ThemeSettings = () => {
  const [open, setOpen] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    fontSize: 14,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont',
    borderRadius: 6,
    lineHeight: 1.5715,
    controlHeight: 32,
    padding: 16,
    margin: 16,
    buttonBg: '#f0f2f5',
    headerBg: '#ffffff',
    sidebarBg: '#001529',
  });
  
  const {
    themeMode,
    themePreset,
    toggleThemeMode,
    changePreset,
    themeConfigs,
    updateCustomTheme,
  } = useTheme();

  // Available font families
  const fontFamilies = [
    { value: 'Inter, -apple-system, BlinkMacSystemFont', label: 'Inter (Default)' },
    { value: "'Roboto', 'Helvetica Neue', Arial", label: 'Roboto' },
    { value: "'Open Sans', sans-serif", label: 'Open Sans' },
    { value: "'Poppins', sans-serif", label: 'Poppins' },
    { value: "'Montserrat', sans-serif", label: 'Montserrat' },
    { value: "'Nunito', sans-serif", label: 'Nunito' },
    { value: "'Segoe UI', Tahoma, Geneva", label: 'Segoe UI' },
    { value: "'SF Pro Display', -apple-system', BlinkMacSystemFont", label: 'SF Pro (Apple)' },
  ];

  // Available font sizes
  const fontSizeOptions = [
    { label: 'Small', value: 12 },
    { label: 'Medium', value: 14 },
    { label: 'Large', value: 16 },
    { label: 'X-Large', value: 18 },
  ];

  const presetCards = [
    {
      key: 'default',
      name: 'Aura Blue',
      colors: ['#2f6fed', '#22c55e', '#f0b429', '#f5484d'],
      icon: '🔵',
      buttonBg: '#eef3ff',
      headerBg: '#ffffff',
      sidebarBg: '#ffffff',
    },
    {
      key: 'modernBlue',
      name: 'Modern Blue',
      colors: ['#1677ff', '#00b96b', '#d48806', '#ff4d4f'],
      icon: '💎',
      buttonBg: '#e6f4ff',
      headerBg: '#ffffff',
      sidebarBg: '#001529',
    },
    {
      key: 'purple',
      name: 'Purple',
      colors: ['#722ed1', '#13c2c2', '#fa8c16', '#f5222d'],
      icon: '👑',
      buttonBg: '#f9f0ff',
      headerBg: '#ffffff',
      sidebarBg: '#1f1f1f',
    },
    {
      key: 'green',
      name: 'Green',
      colors: ['#00a854', '#00a854', '#ffbf00', '#f04134'],
      icon: '🌿',
      buttonBg: '#f6ffed',
      headerBg: '#ffffff',
      sidebarBg: '#001529',
    },
    {
      key: 'darkOnly',
      name: 'Dark Mode',
      colors: ['#177ddc', '#49aa19', '#d89614', '#a61d24'],
      icon: themeMode === 'dark' ? '🌙' : '☀️',
      darkOnly: true,
      buttonBg: '#1f1f1f',
      headerBg: '#141414',
      sidebarBg: '#001529',
    },
  ];

  // Load custom settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('admin-custom-theme-settings');
    if (savedSettings) {
      setCustomSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save custom settings to localStorage and update theme
  useEffect(() => {
    localStorage.setItem('admin-custom-theme-settings', JSON.stringify(customSettings));
    
    // Update the theme with custom settings
    if (updateCustomTheme) {
      updateCustomTheme(customSettings);
    }
  }, [customSettings, updateCustomTheme]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSettingChange = (key, value) => {
    setCustomSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePresetChange = (presetKey) => {
    const preset = presetCards.find(p => p.key === presetKey);
    if (preset) {
      changePreset(presetKey);
      
      // Apply preset-specific customizations
      setCustomSettings(prev => ({
        ...prev,
        buttonBg: preset.buttonBg,
        headerBg: preset.headerBg,
        sidebarBg: preset.sidebarBg,
        fontSize: 14,
        borderRadius: preset.key === 'purple' ? 12 : 
                     preset.key === 'modernBlue' ? 8 : 6,
      }));
    }
  };

  const resetToDefaults = () => {
    const defaultPreset = presetCards.find(p => p.key === 'default');
    setCustomSettings({
      fontSize: 14,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont',
      borderRadius: 6,
      lineHeight: 1.5715,
      controlHeight: 32,
      padding: 16,
      margin: 16,
      buttonBg: defaultPreset.buttonBg,
      headerBg: defaultPreset.headerBg,
      sidebarBg: defaultPreset.sidebarBg,
    });
    
    if (themeMode === 'dark') {
      toggleThemeMode();
    }
    changePreset('default');
  };

  return (
    <>
      <Tooltip title="Theme Settings">
        <Badge dot={themePreset !== 'default' || themeMode !== 'light'}>
          <Button
            type="text"
            icon={<SettingOutlined style={{ fontSize: '18px' }} />}
            onClick={showDrawer}
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: themeMode === 'dark' ? 'rgba(255,255,255,0.85)' : '#666',
            }}
          />
        </Badge>
      </Tooltip>

      <Drawer
        title={
          <Space>
            <BgColorsOutlined />
            <span>Theme Customizer</span>
          </Space>
        }
        placement="right"
        onClose={onClose}
        open={open}
        width={420}
        styles={{
          body: { padding: '16px 24px' },
          header: { borderBottom: '1px solid #f0f0f0' },
        }}
      >
        {/* Theme Mode Card */}
        <Card
          size="small"
          style={{ marginBottom: 16, borderRadius: 8 }}
          styles={{ body: { padding: '16px' } }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <BulbOutlined />
                <Text strong>Theme Mode</Text>
              </Space>
              <Switch
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                checked={themeMode === 'dark'}
                onChange={toggleThemeMode}
                style={{ background: themeMode === 'dark' ? themeConfigs[themePreset]?.token?.colorPrimary : undefined }}
              />
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {themeMode === 'dark' 
                ? 'Dark mode is easier on the eyes in low-light environments' 
                : 'Light mode provides better readability in bright conditions'}
            </Text>
          </Space>
        </Card>

        <Divider style={{ margin: '16px 0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>COLOR PRESETS</Text>
        </Divider>

        {/* Color Presets */}
        <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
          {presetCards.map((preset) => (
            <Col span={12} key={preset.key}>
              <Card
                hoverable
                onClick={() => preset.darkOnly && themeMode === 'light' ? null : handlePresetChange(preset.key)}
                style={{
                  borderRadius: 8,
                  border: themePreset === preset.key 
                    ? `2px solid ${themeConfigs[preset.key]?.token?.colorPrimary || '#1890ff'}` 
                    : '1px solid #f0f0f0',
                  position: 'relative',
                  opacity: preset.darkOnly && themeMode === 'light' ? 0.5 : 1,
                  cursor: preset.darkOnly && themeMode === 'light' ? 'not-allowed' : 'pointer',
                }}
                styles={{ body: { padding: '12px' } }}
              >
                {themePreset === preset.key && (
                  <div style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    background: themeConfigs[preset.key]?.token?.colorPrimary,
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CheckOutlined style={{ color: 'white', fontSize: 12 }} />
                  </div>
                )}
                
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '18px' }}>{preset.icon}</span>
                    <Text strong style={{ fontSize: '14px' }}>{preset.name}</Text>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 4 }}>
                    {preset.colors.map((color, index) => (
                      <div
                        key={index}
                        style={{
                          flex: 1,
                          height: 6,
                          background: color,
                          borderRadius: 2,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Show background previews */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    <div style={{
                      width: 16,
                      height: 16,
                      background: preset.buttonBg,
                      borderRadius: 4,
                      border: '1px solid #f0f0f0'
                    }} title="Button Background" />
                    <div style={{
                      width: 16,
                      height: 16,
                      background: preset.headerBg,
                      borderRadius: 4,
                      border: '1px solid #f0f0f0'
                    }} title="Header Background" />
                    <div style={{
                      width: 16,
                      height: 16,
                      background: preset.sidebarBg,
                      borderRadius: 4,
                      border: '1px solid #f0f0f0'
                    }} title="Sidebar Background" />
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider style={{ margin: '16px 0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>BACKGROUND COLORS</Text>
        </Divider>

        {/* Background Color Settings */}
        <Collapse
          ghost
          size="small"
          defaultActiveKey={['backgrounds']}
          style={{ marginBottom: 16 }}
        >
          <Panel header={
            <Space>
              <PictureOutlined />
              <Text strong>Background Colors</Text>
            </Space>
          } key="backgrounds">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {/* Button Background */}
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Button Background
                </Text>
                <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <ColorPicker
                    value={customSettings.buttonBg}
                    onChange={(color) => handleSettingChange('buttonBg', color.toHexString())}
                    size="small"
                    showText
                  />
                  <Input
                    value={customSettings.buttonBg}
                    onChange={(e) => handleSettingChange('buttonBg', e.target.value)}
                    size="small"
                    style={{ width: 120 }}
                  />
                </Space>
              </div>

              {/* Header Background */}
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Header Background
                </Text>
                <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <ColorPicker
                    value={customSettings.headerBg}
                    onChange={(color) => handleSettingChange('headerBg', color.toHexString())}
                    size="small"
                    showText
                  />
                  <Input
                    value={customSettings.headerBg}
                    onChange={(e) => handleSettingChange('headerBg', e.target.value)}
                    size="small"
                    style={{ width: 120 }}
                  />
                </Space>
              </div>

              {/* Sidebar Background */}
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Sidebar Background
                </Text>
                <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <ColorPicker
                    value={customSettings.sidebarBg}
                    onChange={(color) => handleSettingChange('sidebarBg', color.toHexString())}
                    size="small"
                    showText
                  />
                  <Input
                    value={customSettings.sidebarBg}
                    onChange={(e) => handleSettingChange('sidebarBg', e.target.value)}
                    size="small"
                    style={{ width: 120 }}
                  />
                </Space>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Divider style={{ margin: '16px 0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>TYPOGRAPHY & SPACING</Text>
        </Divider>

        {/* Font Settings */}
        <Collapse
          ghost
          size="small"
          defaultActiveKey={['1']}
          style={{ marginBottom: 16 }}
        >
          <Panel header={
            <Space>
              <FontSizeOutlined />
              <Text strong>Typography</Text>
            </Space>
          } key="1">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {/* Font Family */}
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Font Family
                </Text>
                <Select
                  value={customSettings.fontFamily}
                  onChange={(value) => handleSettingChange('fontFamily', value)}
                  style={{ width: '100%' }}
                  size="small"
                >
                  {fontFamilies.map(font => (
                    <Option key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value.split(',')[0] }}>
                        {font.label}
                      </span>
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Font Size */}
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Base Font Size
                </Text>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Slider
                    min={10}
                    max={20}
                    step={1}
                    value={customSettings.fontSize}
                    onChange={(value) => handleSettingChange('fontSize', value)}
                    style={{ flex: 1 }}
                  />
                  <InputNumber
                    min={10}
                    max={20}
                    value={customSettings.fontSize}
                    onChange={(value) => handleSettingChange('fontSize', value)}
                    size="small"
                    style={{ width: 70 }}
                    addonAfter="px"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {fontSizeOptions.map(option => (
                    <Button
                      key={option.value}
                      size="small"
                      type={customSettings.fontSize === option.value ? 'primary' : 'default'}
                      onClick={() => handleSettingChange('fontSize', option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Line Height
                </Text>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Slider
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    value={customSettings.lineHeight}
                    onChange={(value) => handleSettingChange('lineHeight', value)}
                    style={{ flex: 1 }}
                  />
                  <InputNumber
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    value={customSettings.lineHeight}
                    onChange={(value) => handleSettingChange('lineHeight', value)}
                    size="small"
                    style={{ width: 70 }}
                  />
                </div>
              </div>
            </Space>
          </Panel>
        </Collapse>

        {/* Layout Settings */}
        <Collapse
          ghost
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Panel header={
            <Space>
              <LayoutOutlined />
              <Text strong>Layout & Spacing</Text>
            </Space>
          } key="2">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {/* Border Radius */}
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Border Radius
                </Text>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Slider
                    min={0}
                    max={24}
                    step={2}
                    value={customSettings.borderRadius}
                    onChange={(value) => handleSettingChange('borderRadius', value)}
                    style={{ flex: 1 }}
                  />
                  <InputNumber
                    min={0}
                    max={24}
                    value={customSettings.borderRadius}
                    onChange={(value) => handleSettingChange('borderRadius', value)}
                    size="small"
                    style={{ width: 70 }}
                    addonAfter="px"
                  />
                </div>
              </div>

              {/* Control Height */}
              <div>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Control Height
                </Text>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Slider
                    min={24}
                    max={48}
                    step={4}
                    value={customSettings.controlHeight}
                    onChange={(value) => handleSettingChange('controlHeight', value)}
                    style={{ flex: 1 }}
                  />
                  <InputNumber
                    min={24}
                    max={48}
                    value={customSettings.controlHeight}
                    onChange={(value) => handleSettingChange('controlHeight', value)}
                    size="small"
                    style={{ width: 70 }}
                    addonAfter="px"
                  />
                </div>
              </div>

              {/* Padding & Margin */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    Base Padding
                  </Text>
                  <InputNumber
                    min={8}
                    max={32}
                    value={customSettings.padding}
                    onChange={(value) => handleSettingChange('padding', value)}
                    size="small"
                    style={{ width: '100%' }}
                    addonAfter="px"
                  />
                </div>
                <div>
                  <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    Base Margin
                  </Text>
                  <InputNumber
                    min={8}
                    max={32}
                    value={customSettings.margin}
                    onChange={(value) => handleSettingChange('margin', value)}
                    size="small"
                    style={{ width: '100%' }}
                    addonAfter="px"
                  />
                </div>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Divider style={{ margin: '16px 0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>PREVIEW</Text>
        </Divider>

        {/* Live Preview */}
        <div style={{
          background: themeConfigs[themePreset]?.token?.colorBgBase,
          borderRadius: customSettings.borderRadius,
          padding: customSettings.padding,
          border: '1px solid #f0f0f0',
          fontFamily: customSettings.fontFamily,
          fontSize: customSettings.fontSize,
          lineHeight: customSettings.lineHeight,
        }}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <div style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}>
              <div style={{
                width: customSettings.controlHeight,
                height: customSettings.controlHeight,
                borderRadius: customSettings.borderRadius,
                background: themeConfigs[themePreset]?.token?.colorPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: Math.max(12, customSettings.fontSize - 2),
              }}>
                A
              </div>
              <Text strong style={{ 
                color: themeConfigs[themePreset]?.token?.colorTextBase,
              }}>
                Admin Panel Preview
              </Text>
            </div>
            
            <Text type="secondary" style={{ fontSize: Math.max(12, customSettings.fontSize - 2) }}>
              Current settings applied: {fontFamilies.find(f => f.value === customSettings.fontFamily)?.label}, 
              Font Size: {customSettings.fontSize}px, 
              Border Radius: {customSettings.borderRadius}px
            </Text>
            
            <div style={{
              display: 'flex',
              gap: customSettings.margin / 2,
              flexWrap: 'wrap',
            }}>
              <div style={{
                padding: `${customSettings.padding / 2}px ${customSettings.padding}px`,
                background: themeConfigs[themePreset]?.token?.colorPrimary,
                color: 'white',
                borderRadius: customSettings.borderRadius / 2,
                fontSize: Math.max(12, customSettings.fontSize - 2),
                height: customSettings.controlHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                Primary Button
              </div>
              <div style={{
                padding: `${customSettings.padding / 2}px ${customSettings.padding}px`,
                background: customSettings.buttonBg,
                color: themeConfigs[themePreset]?.token?.colorTextBase,
                borderRadius: customSettings.borderRadius / 2,
                fontSize: Math.max(12, customSettings.fontSize - 2),
                height: customSettings.controlHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #f0f0f0',
              }}>
                Button Bg: {customSettings.buttonBg}
              </div>
            </div>
            
            {/* Background preview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: customSettings.margin / 2,
              marginTop: 8,
            }}>
              <div style={{
                background: customSettings.headerBg,
                padding: 8,
                borderRadius: 4,
                fontSize: 10,
                textAlign: 'center',
                border: '1px solid #f0f0f0',
              }}>
                Header
              </div>
              <div style={{
                background: customSettings.sidebarBg,
                padding: 8,
                borderRadius: 4,
                fontSize: 10,
                textAlign: 'center',
                color: 'white',
                border: '1px solid #f0f0f0',
              }}>
                Sidebar
              </div>
              <div style={{
                background: customSettings.buttonBg,
                padding: 8,
                borderRadius: 4,
                fontSize: 10,
                textAlign: 'center',
                border: '1px solid #f0f0f0',
              }}>
                Buttons
              </div>
            </div>
          </Space>
        </div>

        {/* Reset Button */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button
            type="default"
            onClick={resetToDefaults}
            style={{ width: '100%' }}
          >
            Reset All to Defaults
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default ThemeSettings;