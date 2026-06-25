import { Plugin } from '@nocobase/server';
import { afterCreate } from './hooks/afterCreate';
import { afterUpdate } from './hooks/afterUpdate';
import { afterDestroy } from './hooks/afterDestroy';

export class PluginAuditLogServer extends Plugin {
  async load() {
    this.db.on('afterCreate', (model, options) => this.afterWrite(model, options, 'create'));
    this.db.on('afterUpdate', (model, options) => this.afterWrite(model, options, 'update'));
    this.db.on('afterDestroy', (model, options) => this.afterWrite(model, options, 'delete'));
  }

  async afterWrite(model: any, options: any, type: 'create' | 'update' | 'delete') {
    const { collection } = model.constructor;
    if (!collection) return;

    console.log('filterTargetKey: ', collection.filterTargetKey)
    console.log('primaryKeyAttribute: ', collection.model?.primaryKeyAttribute)

    const config = await this.db.getRepository('__auditConfig').findOne({
      filter: {
        collectionName: collection.name
      }
    })
    if (!config) return;
    if (type === 'create' && config.get('skipCreate')) return;
    if (type === 'delete' && config.get('skipDelete')) return;

    // get ip
    const ip = options.context?.request?.headers?.['x-forwarded-for']?.split(', ')?.[0];
    let ipRecord: any;
    if (ip && !config.get('skipIP'))
      ipRecord = await this.db.getRepository('__ipAddress').firstOrCreate({
        filterKeys: ['ip'],
        values: {
          ip
        }
      })

    if (type === 'create')
      await afterCreate(model, options, ipRecord.get('id'));
    else if (type === 'update')
      await afterUpdate(model, options, ipRecord.get('id'), config);
    else if (type === 'delete')
      await afterDestroy(model, options, ipRecord.get('id'));
  }
}

export default PluginAuditLogServer;
