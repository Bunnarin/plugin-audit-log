import { defineCollection } from '@nocobase/database';

export default defineCollection({
    name: '__auditConfig',
    title: 'audit config',
    filterTargetKey: 'collection',
    fields: [
        {
            type: 'string',
            interface: 'collection',
            name: 'collection',
            primaryKey: true,
            unique: true,
            uiSchema: {
                title: 'collection',
                type: 'string',
                'x-component': 'CollectionSelect',
                'x-component-props': {
                    multiple: false,
                },
                required: true,
            },
        },
        {
            type: 'boolean',
            name: 'skipIP',
            interface: 'checkbox',
            uiSchema: {
                title: 'skip ip',
                type: 'boolean',
                'x-component': 'Checkbox',
            },
        },
        {
            type: 'boolean',
            name: 'skipCreate',
            interface: 'checkbox',
            uiSchema: {
                title: 'skip create',
                type: 'boolean',
                'x-component': 'Checkbox',
            },
        },
        {
            type: 'boolean',
            name: 'skipDelete',
            interface: 'checkbox',
            uiSchema: {
                title: 'skip delete',
                type: 'boolean',
                'x-component': 'Checkbox',
            },
        },
        // key will be either include all except or whitelist and value will be array of field names
        {
            type: 'json',
            name: 'updateListenLogic',
            interface: 'json',
            uiSchema: {
                title: 'update listen logic',
                type: 'object',
                'x-component': 'JSONEditor',
            },
        }
    ]
})