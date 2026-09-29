import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ModuleWorkspace from './ModuleWorkspace';
import SystemSettings from './SystemSettings';
import Patients from './Patients';
import AdminCmsManager from './cms/AdminCmsManager';

const AdminDashboardRouter = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hasModule = searchParams.has('module');
  const moduleKey = searchParams.get('module');
  const menuKey = searchParams.get('menu');
  
  // If module is 'cms' or menu is cms-*, render the Website CMS Admin Panel
  if (moduleKey === 'cms' || (menuKey && menuKey.startsWith('cms'))) {
    return <AdminCmsManager />;
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