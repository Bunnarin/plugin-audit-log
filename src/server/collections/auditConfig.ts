import { defineCollection } from '@nocobase/database';

export default defineCollection({
    name: '__auditConfig',
    title: 'audit config',
    filterTargetKey: 'collectionName',
    fields: [
        {
            type: 'string',
            name: 'collectionName',
            primaryKey: true,
        },
        {
            type: 'belongsTo',
            name: 'collection',
            target: 'collections',
            targetKey: 'name',
            sourceKey: 'id',
            foreignKey: 'collectionName',
            constraints: false,
        },
        {
            type: 'boolean',
            name: 'skipIP'
        },
        {
            type: 'boolean',
            name: 'skipCreate'
        },
        {
            type: 'boolean',
            name: 'skipDelete'
        },
        // key will be either include all except or whitelist and value will be array of field names
        {
            type: 'json',
            name: 'updateListenLogic'
        }
    ]
})