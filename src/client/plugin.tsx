import { Plugin } from '@nocobase/client';
import models from './models';
import { AuditConfigPage } from './AuditConfigPage';

export class PluginAuditLogClient extends Plugin {
  async load() {
    this.flowEngine?.registerModels?.(models);

    this.app.pluginSettingsManager.add('audit-log-config', {
      title: 'Audit Log Config',
      icon: 'SettingOutlined',
      Component: AuditConfigPage,
    });
  }
}

export default PluginAuditLogClient;
