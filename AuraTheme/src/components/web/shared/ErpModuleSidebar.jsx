import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip, Typography } from 'antd';
import {
  AppstoreOutlined,
  BankOutlined,
  BuildOutlined,
  CreditCardOutlined,
  DownOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  MoneyCollectOutlined,
  ReconciliationOutlined,
  RightOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { erpModules, getMenuLineage } from '../../../data/erpModules';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

const { Text } = Typography;

const moduleIconMap = {
  clinic: MedicineBoxOutlined,
  inventory: AppstoreOutlined,
  asset: BuildOutlined,
  procurement: ReconciliationOutlined,
  sales: ShoppingCartOutlined,
  pos: CreditCardOutlined,
  loans: MoneyCollectOutlined,
  property: HomeOutlined,
  accounting: BankOutlined,
  crm: UsergroupAddOutlined,
  hr: TeamOutlined,
  payroll: FileTextOutlined,
  reports: FileTextOutlined,
  settings: SettingOutlined,
  frontEnd: GlobalOutlined,
};

const getIconNode = (iconKey) => {
  const IconComponent = moduleIconMap[iconKey] || AppstoreOutlined;
  return <IconComponent />;
};

const sectionGroups = [
  { label: 'Main Menu', keys: ['clinic', 'inventory', 'asset', 'procurement', 'sales', 'pos', 'loans', 'property', 'accounting', 'hr', 'payroll'] },
  { label: 'System', keys: ['reports', 'settings', 'front-end'] },
];

const rowBase = {
  width: '100%',
  border: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '9px 10px',
  borderRadius: 10,
  cursor: 'pointer',
  textAlign: 'left',
};

const FlatMenuTree = ({ items, moduleKey, activeMenuKey, activeLineage, openGroups, onToggleGroup, onNavigate, depth = 1, parentPath = [] }) => {
  const adminTheme = useAdminTheme();

  return (
  <>
    {items.map((item) => {
      const isGroup = Boolean(item.children?.length);
      const isInActivePath = activeLineage.includes(item.key);
      const isOpen = isGroup && openGroups.has(item.key);
      const itemPath = [...parentPath, item.key];
      const indent = 20 + depth * 14;

      if (isGroup) {
        return (
          <div key={item.key}>
            <button
              type="button"
              onClick={() => onToggleGroup(itemPath)}
              style={{
                ...rowBase,
                paddingLeft: indent,
                color: isInActivePath ? adminTheme.sidebarActiveText : adminTheme.subtext,
                fontSize: 13,
                fontWeight: isInActivePath ? 700 : 500,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor', flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              <DownOutlined rotate={isOpen ? 0 : -90} style={{ fontSize: 9, opacity: 0.6 }} />
            </button>
            {isOpen && (
              <FlatMenuTree
                items={item.children}
                moduleKey={moduleKey}
                activeMenuKey={activeMenuKey}
                activeLineage={activeLineage}
                openGroups={openGroups}
                onToggleGroup={onToggleGroup}
                onNavigate={onNavigate}
                depth={depth + 1}
                parentPath={itemPath}
              />
            )}
          </div>
        );
      }

      const isActive = activeMenuKey === item.key;

      return (
        <button
          key={item.key}
          type="button"
          onClick={() => onNavigate(moduleKey, item.key)}
          style={{
            ...rowBase,
            paddingLeft: indent,
            color: isActive ? adminTheme.sidebarActiveText : adminTheme.subtext,
            fontSize: 13,
            fontWeight: isActive ? 700 : 500,
            background: isActive ? adminTheme.sidebarActiveBg : 'transparent',
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor', flexShrink: 0 }} />
          <span>{item.label}</span>
        </button>
      );
    })}
  </>
  );
};

const ErpModuleSidebar = ({ collapsed, activeModuleKey, activeMenuKey, onNavigate }) => {
  const adminTheme = useAdminTheme();
  const activeLineage = useMemo(() => getMenuLineage(activeModuleKey, activeMenuKey), [activeMenuKey, activeModuleKey]);

  // Sidebar state is always derived from the current URL: whenever the active
  // module/menu changes (i.e. the user navigated), collapse whatever was
  // previously open and expand only the group/menu/sub-menu for the new page.
  const [openModuleKey, setOpenModuleKey] = useState(activeModuleKey);
  const [openGroups, setOpenGroups] = useState(() => new Set(activeLineage));

  useEffect(() => {
    setOpenModuleKey(activeModuleKey);
    setOpenGroups(new Set(activeLineage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModuleKey, activeMenuKey]);

  const toggleModule = (moduleKey) => {
    setOpenModuleKey((previous) => (previous === moduleKey ? null : moduleKey));
  };

  // Opening a group closes any sibling group/sub-menu that was open, and
  // keeps only the clicked item's ancestor path expanded (accordion-style).
  const toggleGroup = (groupPath) => {
    const groupKey = groupPath[groupPath.length - 1];
    setOpenGroups((previous) => {
      if (previous.has(groupKey)) {
        return new Set(groupPath.slice(0, -1));
      }
      return new Set(groupPath);
    });
  };

  const modulesByKey = useMemo(() => Object.fromEntries(erpModules.map((module) => [module.key, module])), []);

  if (collapsed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {erpModules.map((module) => {
          const isActive = activeModuleKey === module.key;
          return (
            <Tooltip key={module.key} title={module.label} placement="right">
              <button
                type="button"
                onClick={() => onNavigate(module.key, null)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: 'none',
                  background: isActive ? adminTheme.sidebarActiveBg : 'transparent',
                  color: isActive ? adminTheme.sidebarActiveText : module.accent,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 17,
                  cursor: 'pointer',
                }}
              >
                {getIconNode(module.iconKey)}
              </button>
            </Tooltip>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {sectionGroups.map((section) => (
        <div key={section.label}>
          <Text
            style={{
              display: 'block',
              color: adminTheme.sidebarSectionLabel,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              fontSize: 10.5,
              fontWeight: 700,
              padding: '0 10px 8px',
            }}
          >
            {section.label}
          </Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {section.keys.map((moduleKey) => {
              const module = modulesByKey[moduleKey];
              if (!module) return null;
              const isActive = activeModuleKey === module.key;
              const isOpen = openModuleKey === module.key;

              return (
                <div key={module.key}>
                  <button
                    type="button"
                    onClick={() => {
                      toggleModule(module.key);
                      onNavigate(module.key, null);
                    }}
                    style={{
                      ...rowBase,
                      background: isActive && !activeMenuKey ? adminTheme.sidebarActiveBg : 'transparent',
                      color: isActive ? adminTheme.sidebarActiveText : adminTheme.text,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 13.5,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = adminTheme.sidebarHoverBg;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: 16, color: isActive ? adminTheme.sidebarActiveText : module.accent, width: 18, textAlign: 'center' }}>
                      {getIconNode(module.iconKey)}
                    </span>
                    <span style={{ flex: 1 }}>{module.label}</span>
                    {module.menus?.length > 0 && (
                      <RightOutlined rotate={isOpen ? 90 : 0} style={{ fontSize: 10, opacity: 0.5 }} />
                    )}
                  </button>

                  {isOpen && module.menus?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2, marginBottom: 4 }}>
                      <FlatMenuTree
                        items={module.menus}
                        moduleKey={module.key}
                        activeMenuKey={isActive ? activeMenuKey : null}
                        activeLineage={isActive ? activeLineage : []}
                        openGroups={openGroups}
                        onToggleGroup={toggleGroup}
                        onNavigate={onNavigate}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ErpModuleSidebar;
