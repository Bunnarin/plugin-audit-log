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
    fields: [
        {
            type: 'integer',
            name: 'id',
            primaryKey: true,
            interface: 'integer',
            uiSchema: {
                "type": "number",
                "x-component": "InputNumber",
                "x-component-props": {
                    "stringMode": true,
                    "step": "1"
                },
                "x-validator": "integer",
                "title": "ID"
            }
        },
        {
            type: 'string',
            name: 'fieldName',
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
            interface: 'textarea',
            uiSchema: {
                type: "string",
                "x-component": "Input.TextArea",
                "title": "value"
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
                "title": "value"
            }
        },
        {
            type: 'integer',
            name: 'auditLogId',
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
            target: 'auditLog',
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
