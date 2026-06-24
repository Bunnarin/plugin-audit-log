import { Plugin } from '@nocobase/server';
import { afterCreate, afterUpdate, afterDestroy } from './hooks';

export class PluginAuditLogServer extends Plugin {
  async afterAdd() { }

  async beforeLoad() {
    this.db.on('afterCreate', afterCreate);
    this.db.on('afterUpdate', afterUpdate);
    this.db.on('afterDestroy', afterDestroy);
  }

  async load() {
  }

  async install() { }

  async afterEnable() { }

  async afterDisable() {
  }

  async remove() { }
}

export default PluginAuditLogServer;
