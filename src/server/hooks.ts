import { Database } from '@nocobase/database';

function stringifyValue(val: any) {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
}

async function getAuditConfig(database: Database, collectionName: string) {
    const AuditConfig = database.getCollection('__auditConfig');
    if (!AuditConfig) return null;
    return await AuditConfig.repository.findOne({
        filter: { collectionName },
    });
}

async function getIpAddressId(database: Database, ip: string, transaction: any) {
    if (!ip) return null;
    const IpAddress = database.getCollection('__ipAddress');
    if (!IpAddress) return null;

    let record = await IpAddress.repository.findOne({
        filter: { ip },
        transaction,
    });

    if (!record) {
        record = await IpAddress.repository.create({
            values: { ip },
            transaction,
        });
    }
    return record.get('id');
}

export async function afterCreate(model: any, options: any) {
    if (options.logging === false) return;
    const { collection } = model.constructor;
    if (!collection) return;
    const collectionName = collection.name;

    if (collectionName.startsWith('__audit') || collectionName === '__ipAddress') {
        return;
    }

    const database = model.constructor.database;
    const config = await getAuditConfig(database, collectionName);

    if (config?.get('skipCreate')) {
        return;
    }

    const transaction = options.transaction;
    const AuditLog = database.getCollection('__auditLog');
    if (!AuditLog) return;
    const currentUserId = options?.context?.state?.currentUser?.id;
    const ip = options.context.request?.headers?.['x-forwarded-for']?.split(', ')?.[0];

    let ipAddressId = null;
    if (!config?.get('skipIP') && ip) {
        ipAddressId = await getIpAddressId(database, ip, transaction);
    }

    const changes: any[] = [];
    const changed = model.changed();
    if (changed) {
        changed.forEach((key: string) => {
            const field = collection.findField((field: any) => {
                return field.name === key || field.options.field === key;
            });
            if (field && !field.options.hidden) {
                changes.push({
                    fieldName: key,
                    after: stringifyValue(model.get(key)),
                });
            }
        });
    }

    if (!changes.length) return;

    try {
        await AuditLog.repository.create({
            values: {
                recordId: String(model.get(model.constructor.primaryKeyAttribute)),
                isCreate: true,
                isUpdate: false,
                isDelete: false,
                collection: collectionName,
                changes,
                ipAddressId,
                createdById: currentUserId,
            },
            transaction,
            hooks: false,
        });
    } catch (error) {
        console.error(error);
    }
}

export async function afterUpdate(model: any, options: any) {
    if (options.logging === false) return;
    const { collection } = model.constructor;
    if (!collection) return;
    const collectionName = collection.name;

    if (collectionName.startsWith('__audit') || collectionName === '__ipAddress') {
        return;
    }

    const changed = model.changed();
    if (!changed) return;

    const database = model.constructor.database;
    const config = await getAuditConfig(database, collectionName);

    let fieldsToLog = changed;
    const updateListenLogic = config?.get('updateListenLogic');

    if (updateListenLogic) {
        if (updateListenLogic['include all except']) {
            const except = updateListenLogic['include all except'] || [];
            fieldsToLog = changed.filter((f: string) => !except.includes(f));
        } else if (updateListenLogic['exclude all except']) {
            const except = updateListenLogic['exclude all except'] || [];
            fieldsToLog = changed.filter((f: string) => except.includes(f));
        }
    }

    if (!fieldsToLog || fieldsToLog.length === 0) return;

    const transaction = options.transaction;
    const AuditLog = database.getCollection('__auditLog');
    if (!AuditLog) return;
    const currentUserId = options?.context?.state?.currentUser?.id;
    const ip = options?.context?.ip || options?.context?.request?.ip;

    let ipAddressId = null;
    if (!config?.get('skipIP') && ip) {
        ipAddressId = await getIpAddressId(database, ip, transaction);
    }

    const changes: any[] = [];
    fieldsToLog.forEach((key: string) => {
        const field = collection.findField((field: any) => {
            return field.name === key || field.options.field === key;
        });
        if (field && !field.options.hidden) {
            changes.push({
                fieldName: key,
                before: stringifyValue(model.previous(key)),
                after: stringifyValue(model.get(key)),
            });
        }
    });

    if (!changes.length) return;

    try {
        await AuditLog.repository.create({
            values: {
                recordId: String(model.get(model.constructor.primaryKeyAttribute)),
                isCreate: false,
                isUpdate: true,
                isDelete: false,
                collection: collectionName,
                changes,
                ipAddressId,
                createdById: currentUserId,
            },
            transaction,
            hooks: false,
        });
    } catch (error) {
        console.error(error);
    }
}

export async function afterDestroy(model: any, options: any) {
    if (options.logging === false) return;
    const { collection } = model.constructor;
    if (!collection) return;
    const collectionName = collection.name;

    if (collectionName.startsWith('__audit') || collectionName === '__ipAddress') {
        return;
    }

    const database = model.constructor.database;
    const config = await getAuditConfig(database, collectionName);

    if (config?.get('skipDelete')) {
        return;
    }

    const transaction = options.transaction;
    const AuditLog = database.getCollection('__auditLog');
    if (!AuditLog) return;
    const currentUserId = options?.context?.state?.currentUser?.id;
    const ip = options?.context?.ip || options?.context?.request?.ip;

    let ipAddressId = null;
    if (!config?.get('skipIP') && ip) {
        ipAddressId = await getIpAddressId(database, ip, transaction);
    }

    const changes: any[] = [];
    Object.keys(model.get()).forEach((key: string) => {
        const field = collection.findField((field: any) => {
            return field.name === key || field.options.field === key;
        });
        if (field && !field.options.hidden) {
            changes.push({
                fieldName: key,
                before: stringifyValue(model.get(key)),
            });
        }
    });

    try {
        await AuditLog.repository.create({
            values: {
                recordId: String(model.get(model.constructor.primaryKeyAttribute)),
                isCreate: false,
                isUpdate: false,
                isDelete: true,
                collection: collectionName,
                changes,
                ipAddressId,
                createdById: currentUserId,
            },
            transaction,
            hooks: false,
        });
    } catch (error) {
        console.error(error);
    }
}
