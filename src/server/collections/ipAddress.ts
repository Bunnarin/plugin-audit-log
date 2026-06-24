import { defineCollection } from '@nocobase/database';

export default defineCollection({
    migrationRules: ['schema-only', 'skip'],
    title: 'IP Address',
    name: '__ipAddress',
    uiManageable: true,
    createdBy: false,
    updatedBy: false,
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
            name: 'ip',
            index: true,
            interface: 'input',
            uiSchema: {
                "type": "string",
                "x-component": "Input",
                "x-validator": "string",
                "title": "IP Address"
            }
        }
    ],
});
