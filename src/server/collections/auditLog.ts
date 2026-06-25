import { defineCollection } from '@nocobase/database';

export default defineCollection({
    migrationRules: ['schema-only', 'skip'],
    title: 'audit log',
    name: '__auditLog',
    uiManageable: true,
    createdAt: true,
    createdBy: true,
    updatedBy: false,
    updatedAt: false,
    shared: true,
    autoGenId: true,
    fields: [
        {
            autoIncrement: true,
            primaryKey: true,
            interface: 'integer',
            name: 'id',
            type: 'integer',
        },
        {
            type: 'string',
            name: 'recordId',
            interface: 'input',
            uiSchema: {
                title: 'record id',
                type: 'string',
                'x-component': 'Input',
                required: true,
            },
        },
        {
            type: 'boolean',
            name: 'isCreate',
            interface: 'checkbox',
            uiSchema: {
                title: 'is create',
                type: 'boolean',
                'x-component': 'Checkbox',
            },
        },
        {
            type: 'boolean',
            name: 'isUpdate',
            interface: 'checkbox',
            uiSchema: {
                title: 'is update',
                type: 'boolean',
                'x-component': 'Checkbox',
            },
        },
        {
            type: 'boolean',
            name: 'isDelete',
            interface: 'checkbox',
            uiSchema: {
                title: 'is delete',
                type: 'boolean',
                'x-component': 'Checkbox',
            },
        },
        {
            type: 'string',
            interface: 'collection',
            name: 'collection',
            allowNull: false,
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
            type: 'hasMany',
            name: 'changes',
            interface: 'o2m',
            target: 'auditChanges',
            foreignKey: 'auditLogId',
            uiSchema: {
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": true
                },
                "title": "changes"
            },
        },
        {
            type: 'integer',
            name: 'ipAddressId',
            isForeignKey: true,
            uiSchema: {
                "type": "number",
                "x-component": "InputNumber",
                "x-component-props": {
                    "stringMode": true,
                    "step": "1"
                },
                "x-validator": "integer",
                "title": "ip address id"
            }
        },
        {
            type: 'belongsTo',
            title: 'ip address',
            interface: 'm2o',
            name: 'ipAddress',
            target: '__ipAddress',
            targetKey: 'id',
            sourceKey: 'id',
            foreignKey: 'ipAddressId',
            uiSchema: {
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": false
                },
                title: "ip address"
            }
        },
    ],
});
