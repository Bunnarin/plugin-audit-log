export async function afterCreate(model, options, ipAddressId) {
    const { database, collection } = model.constructor
    await database.getRepository('__auditLog').create({
        values: {
            isCreate: true,
            collection: collection.name,
            recordId: model[collection.filterTargetKey],
            ipAddressId,
            createdBy: options?.context?.state?.currentUser
        },
        transaction: options.transaction,
    })
}