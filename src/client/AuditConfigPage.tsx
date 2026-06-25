import React, { useEffect, useState, useMemo } from 'react';
import { useCollectionManager, useAPIClient } from '@nocobase/client';
import { Table, Switch, Select, Spin, message, Typography } from 'antd';

export const AuditConfigPage = () => {
    const collectionManager = useCollectionManager();
    const collections = collectionManager.getCollections();
    const api = useAPIClient();
    const [configs, setConfigs] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            const { data } = await api.resource('__auditConfig').list({
                paginate: false,
            });
            const configMap: Record<string, any> = {};
            data?.data?.forEach((item: any) => {
                configMap[item.collection] = item;
            });
            setConfigs(configMap);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch audit configs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const handleUpdate = async (collection: string, payload: any) => {
        try {
            const current = configs[collection] || {};
            const next = { ...current, ...payload };
            setConfigs(prev => ({ ...prev, [collection]: next }));

            const isCreate = !current.collection;

            // then update our local
            if (isCreate)
                await api.resource('__auditConfig').create({
                    values: { collection, ...payload }
                }).then(res => setConfigs(prev => ({
                    ...prev,
                    [collection]: Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
                })))
            else
                await api.resource('__auditConfig').update({
                    filter: {
                        collection
                    },
                    values: payload
                }).then(res => setConfigs(prev => ({
                    ...prev,
                    [collection]: Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
                })))
            message.success('Config saved');
        } catch (error) {
            console.error(error);
            message.error('Failed to save config');
            fetchConfigs(); // revert on fail
        }
    };

    const handleDelete = async (collection: string) => {
        try {
            const current = configs[collection];
            if (!current) return;
            
            setConfigs(prev => {
                const next = { ...prev };
                delete next[collection];
                return next;
            });

            await api.resource('__auditConfig').destroy({
                filter: { collection }
            });
            message.success('Config deleted');
        } catch (error) {
            console.error(error);
            message.error('Failed to delete config');
            fetchConfigs();
        }
    };

    // Filter out internal audit log collections to prevent infinite loops and clutter
    const filteredCollections = useMemo(() => {
        return collections.filter(c => !c.name.startsWith('__audit') && c.name !== '__ipAddress');
    }, [collections]);

    const columns = [
        {
            title: 'Collection',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => {
                return (
                    <div>
                        <Typography.Text strong>{record.title || text}</Typography.Text>
                        <br />
                        <Typography.Text type="secondary">{text}</Typography.Text>
                    </div>
                );
            }
        },
        {
            title: 'Skip IP',
            dataIndex: 'skipIP',
            key: 'skipIP',
            render: (_: any, record: any) => {
                const configExists = !!configs[record.name];
                const checked = configs[record.name]?.skipIP || false;
                return <Switch disabled={!configExists} checked={checked} onChange={(v) => handleUpdate(record.name, { skipIP: v })} />;
            }
        },
        {
            title: 'Skip Create',
            dataIndex: 'skipCreate',
            key: 'skipCreate',
            render: (_: any, record: any) => {
                const configExists = !!configs[record.name];
                const checked = configs[record.name]?.skipCreate || false;
                return <Switch disabled={!configExists} checked={checked} onChange={(v) => handleUpdate(record.name, { skipCreate: v })} />;
            }
        },
        {
            title: 'Skip Delete',
            dataIndex: 'skipDelete',
            key: 'skipDelete',
            render: (_: any, record: any) => {
                const configExists = !!configs[record.name];
                const checked = configs[record.name]?.skipDelete || false;
                return <Switch disabled={!configExists} checked={checked} onChange={(v) => handleUpdate(record.name, { skipDelete: v })} />;
            }
        },
        {
            title: 'Update Listen Logic',
            dataIndex: 'updateListenLogic',
            key: 'updateListenLogic',
            render: (_: any, record: any) => {
                const configExists = !!configs[record.name];
                const config = configs[record.name]?.updateListenLogic || {};
                const mode = !configExists ? 'none' : (config['blacklist'] ? 'blacklist' : (config['whitelist'] ? 'whitelist' : 'none'));
                const fields = mode === 'blacklist' ? config['blacklist'] : (mode === 'whitelist' ? config['whitelist'] : []);

                // Filter out association fields
                const availableFields = record.fields?.filter((f: any) => {
                    const type = f.type;
                    return !['hasOne', 'hasMany', 'belongsTo', 'belongsToMany'].includes(type);
                }) || [];

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '250px' }}>
                        <Select
                            value={mode}
                            onChange={(v) => {
                                if (v === 'none') {
                                    handleDelete(record.name);
                                } else {
                                    handleUpdate(record.name, {
                                        updateListenLogic: {
                                            [v]: []
                                        }
                                    });
                                }
                            }}
                            options={[
                                { label: 'Unconfigured (Log nothing)', value: 'none' },
                                { label: 'Blacklist', value: 'blacklist' },
                                { label: 'Whitelist', value: 'whitelist' },
                            ]}
                        />
                        {mode !== 'none' && (
                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="Select fields"
                                value={fields}
                                onChange={(selected) => {
                                    handleUpdate(record.name, {
                                        updateListenLogic: {
                                            [mode]: selected
                                        }
                                    });
                                }}
                                options={availableFields.map((f: any) => ({
                                    label: f.title || f.name,
                                    value: f.name
                                }))}
                            />
                        )}
                    </div>
                );
            }
        }
    ];

    if (loading && Object.keys(configs).length === 0) {
        return <Spin style={{ margin: '20px' }} />;
    }

    return (
        <div style={{ padding: '24px' }}>
            <style>{`
                .audit-config-disabled-row {
                    opacity: 0.5;
                    background-color: #fafafa;
                    transition: all 0.3s;
                }
            `}</style>
            <h2>Audit Log Configuration</h2>
            <Table
                dataSource={filteredCollections}
                columns={columns}
                rowKey="name"
                pagination={false}
                bordered
                rowClassName={(record) => !configs[record.name] ? 'audit-config-disabled-row' : ''}
            />
        </div>
    );
};
