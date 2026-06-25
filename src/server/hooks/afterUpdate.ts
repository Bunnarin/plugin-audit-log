export async function afterUpdate(model: any, options: any, ipAddressId: number | null, auditConfig: any) {
  const { collection, database } = model.constructor;

  // we need to know if the whitelisted fields are changed or not
  const changedFields = model.changed();
  if (!changedFields) return;

  const listenLogic = auditConfig.get('updateListenLogic');
  // this can either be { blacklist } or { whitelist }
  let allowedFields: string[] = [];
  if (listenLogic?.blacklist?.length)
    allowedFields = changedFields.filter((f: string) => !listenLogic.blacklist.includes(f));
  else if (listenLogic?.whitelist?.length)
    allowedFields = changedFields.filter((f: string) => listenLogic.whitelist.includes(f));
  else
    allowedFields = changedFields;

  if (allowedFields.length == 0) return;

  const changes: any[] = [];
  allowedFields.forEach((key) => {
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

  const transaction = options.transaction
  const auditLog = await database.getRepository('__auditLog').create({
    values: {
      recordId: model[collection.filterTargetKey],
      isUpdate: true,
      collection: collection.name,
      ipAddressId,
      createdBy: options?.context?.state?.currentUser,
    },
    transaction,
  });
  await database.getRepository('__auditChange').createMany({
    records: changes.map(c => ({ ...c, auditLogId: auditLog.get('id') })),
    transaction,
  })
}

function stringifyValue(val: any) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}