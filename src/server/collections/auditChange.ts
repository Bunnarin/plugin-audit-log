import { defineCollection } from '@nocobase/database';

export default defineCollection({
    name: '__auditChange',
    title: 'audit change',
    uiManageable: true,
    createdBy: false,
    updatedBy: false,
    createdAt: false,
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
            name: 'fieldName',
            allowNull: false,
            interface: 'input',
            uiSchema: {
                type: "string",
                "x-component": "Input",
                "title": "field"
            }
        },
        {
            type: 'text',
            length: 'long',
            name: 'before',
            allowNull: false,
            interface: 'textarea',
            uiSchema: {
                type: "string",
                "x-component": "Input.TextArea",
                "title": "before"
            }
        },
        {
            type: 'text',
            length: 'long',
            name: 'after',
            interface: 'textarea',
            uiSchema: {
                type: "string",
                "x-component": "Input.TextArea",
                "title": "after"
            }
        },
        {
            type: 'integer',
            name: 'auditLogId',
            allowNull: false,
            interface: 'integer',
            isForeignKey: true,
            uiSchema: {
                "type": "number",
                "title": "audit log id",
                "x-component": "InputNumber",
                "x-read-pretty": true
            }
        },
        {
            type: 'belongsTo',
            name: 'log',
            interface: 'm2o',
            target: '__auditLog',
            targetKey: 'id',
            foreignKey: 'auditLogId',
            uiSchema: {
                "x-component": "AssociationField",
                "x-component-props": {
                    "multiple": false
                },
                title: "audit log"
            }
        },
    ],
});
