export async function afterDestroy(model: any, options: any, ipAddressId: number | null) {
    const { database, collection } = model.constructor
    await database.getRepository('__auditLog').create({
        values: {
            isDelete: true,
            collection: collection.name,
            recordId: model[collection.filterTargetKey],
            ipAddressId,
            createdBy: options?.context?.state?.currentUser
        },
        transaction: options.transaction,
    })
}