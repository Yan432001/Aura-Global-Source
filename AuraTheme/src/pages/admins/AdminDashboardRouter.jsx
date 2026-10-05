import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ModuleWorkspace from './ModuleWorkspace';
import SystemSettings from './SystemSettings';
import Patients from './Patients';
import AdminCmsManager from './cms/AdminCmsManager';
import AdminSimpleDataManager from './AdminSimpleDataManager';
import AdminProductsManager from './AdminProductsManager';
import AdminModulesManager from './AdminModulesManager';
import AdminBranchesManager from './AdminBranchesManager';
import AdminFrontEndManager from './AdminFrontEndManager';
import { useAdminModules } from '../../hooks/useAdminModules';
import { Result, Button } from 'antd';
import { LockOutlined, ControlOutlined } from '@ant-design/icons';
import { getModuleByKey } from '../../data/erpModules';

const AdminDashboardRouter = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hasModule = searchParams.has('module');
  const moduleKey = searchParams.get('module');
  const menuKey = searchParams.get('menu');
  const hasSection = searchParams.has('section');
  const { isModuleOpen, toggleModule } = useAdminModules();

  // If module is 'modules' or menu is 'module-settings', render AdminModulesManager
  if (moduleKey === 'modules' || menuKey === 'module-settings' || menuKey === 'modules') {
    return <AdminModulesManager />;
  }

  // If module is 'branches' or menu is 'branches' / 'billers', render AdminBranchesManager
  if (
    moduleKey === 'branches' ||
    moduleKey === 'billers' ||
    menuKey === 'branches' ||
    menuKey === 'billers' ||
    menuKey === 'shops' ||
    (moduleKey === 'settings' && (menuKey === 'branches' || menuKey === 'billers' || menuKey === 'warehouses'))
  ) {
    return <AdminBranchesManager />;
  }

  // If module is 'front-end' or 'frontend' or any front-office menu, render AdminFrontEndManager
  if (
    moduleKey === 'front-end' ||
    moduleKey === 'frontend' ||
    menuKey === 'shop-control' ||
    menuKey === 'store-products' ||
    menuKey === 'website-display' ||
    menuKey === 'slider-settings' ||
    menuKey === 'list-pages' ||
    menuKey === 'preview-website' ||
    menuKey === 'shop-settings' ||
    menuKey === 'frontend-overview' ||
    menuKey === 'telegram-groups' ||
    menuKey === 'telegram'
  ) {
    return <AdminFrontEndManager initialTab={menuKey} />;
  }

  // Guard for closed modules
  if (moduleKey && !isModuleOpen(moduleKey)) {
    const modConfig = getModuleByKey(moduleKey);
    return (
      <div style={{ padding: '40px 24px' }}>
        <Result
          status="warning"
          icon={<LockOutlined style={{ color: '#ea580c' }} />}
          title={`Module "${modConfig?.label || moduleKey}" is Currently Closed`}
          subTitle={`This module has been deactivated in the ERP Modules Switchboard. Its sidebar menu and dashboard widgets are hidden.`}
          extra={[
            <Button
              type="primary"
              key="enable"
              style={{ background: '#16a34a', borderColor: '#16a34a' }}
              onClick={() => toggleModule(moduleKey, true)}
            >
              Re-open {modConfig?.label || moduleKey} Module
            </Button>,
            <Button
              key="manage"
              icon={<ControlOutlined />}
              onClick={() => {
                const params = new URLSearchParams(location.search);
                params.set('module', 'modules');
                window.location.search = params.toString();
              }}
            >
              Open Module Switchboard
            </Button>,
          ]}
        />
      </div>
    );
  }

  // If menu is 'products' or inventory products, render AdminProductsManager
  if (menuKey === 'products' || (moduleKey === 'inventory' && menuKey === 'products')) {
    return <AdminProductsManager />;
  }

  // If module is 'data' or has 'section', render the Simple Data Management UI
  if (moduleKey === 'data' || hasSection || menuKey === 'simple-data' || menuKey === 'data-manager') {
    return <AdminSimpleDataManager />;
  }

  // If module is 'cms' or menu is cms-*, render the Website CMS Admin Panel
  if (moduleKey === 'cms' || (menuKey && menuKey.startsWith('cms'))) {
    return <AdminSimpleDataManager />;
  }

  // If no module is specified, show the dashboard
  if (!hasModule) {
    return <AdminDashboard />;
  }
  
  // If the menu is 'system-settings' or 'settings', render SystemSettings
  if (menuKey === 'system-settings' || menuKey === 'settings') {
    return <SystemSettings />;
  }
  
  // If the menu is 'patients', render the Patients component
  if (menuKey === 'patients') {
    return <Patients />;
  }
  
  // Default: render ModuleWorkspace for other menus
  return <ModuleWorkspace />;
};

export default AdminDashboardRouter;