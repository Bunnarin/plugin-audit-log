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
            name: 'ip',
            unique: true,
            allowNull: false,
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
