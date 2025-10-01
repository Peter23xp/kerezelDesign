// Supabase Client simplifié pour navigateur
(function() {
    'use strict';

    function createClient(supabaseUrl, supabaseKey, options = {}) {
        return {
            auth: {
                signUp: async (credentials) => ({ data: null, error: null }),
                signIn: async (credentials) => ({ data: null, error: null }),
                signOut: async () => ({ error: null }),
                getSession: async () => ({ data: { session: null }, error: null }),
                onAuthStateChange: (callback) => ({ data: { subscription: { unsubscribe: () => {} } } })
            },
            from: (table) => ({
                select: (columns = '*') => ({
                    eq: (column, value) => ({
                        single: async () => {
                            try {
                                const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&select=${columns}`, {
                                    headers: {
                                        'apikey': supabaseKey,
                                        'Authorization': `Bearer ${supabaseKey}`,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                
                                if (!response.ok) {
                                    return { data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } };
                                }
                                
                                const text = await response.text();
                                if (!text.trim()) {
                                    return { data: null, error: { message: 'Empty response' } };
                                }
                                
                                const data = JSON.parse(text);
                                return { data: data[0] || null, error: null };
                            } catch (error) {
                                return { data: null, error: { message: error.message } };
                            }
                        },
                        eq: (column2, value2) => ({
                            single: async () => {
                                try {
                                    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&${column2}=eq.${value2}&select=${columns}`, {
                                        headers: {
                                            'apikey': supabaseKey,
                                            'Authorization': `Bearer ${supabaseKey}`,
                                            'Content-Type': 'application/json'
                                        }
                                    });
                                    
                                    if (!response.ok) {
                                        return { data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } };
                                    }
                                    
                                    const text = await response.text();
                                    if (!text.trim()) {
                                        return { data: null, error: { message: 'Empty response' } };
                                    }
                                    
                                    const data = JSON.parse(text);
                                    return { data: data[0] || null, error: null };
                                } catch (error) {
                                    return { data: null, error: { message: error.message } };
                                }
                            },
                            eq: (column3, value3) => ({
                                single: async () => {
                                    try {
                                        const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&${column2}=eq.${value2}&${column3}=eq.${value3}&select=${columns}`, {
                                            headers: {
                                                'apikey': supabaseKey,
                                                'Authorization': `Bearer ${supabaseKey}`,
                                                'Content-Type': 'application/json'
                                            }
                                        });
                                        
                                        if (!response.ok) {
                                            return { data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } };
                                        }
                                        
                                        const text = await response.text();
                                        if (!text.trim()) {
                                            return { data: null, error: { message: 'Empty response' } };
                                        }
                                        
                                        const data = JSON.parse(text);
                                        return { data: data[0] || null, error: null };
                                    } catch (error) {
                                        return { data: null, error: { message: error.message } };
                                    }
                                }
                            })
                        }),
                        limit: (count) => ({
                            order: (column, options = {}) => ({
                                async then(callback) {
                                    try {
                                        const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&select=${columns}&limit=${count}&order=${column}.${options.ascending ? 'asc' : 'desc'}`, {
                                            headers: {
                                                'apikey': supabaseKey,
                                                'Authorization': `Bearer ${supabaseKey}`,
                                                'Content-Type': 'application/json'
                                            }
                                        });
                                        
                                        if (!response.ok) {
                                            callback({ data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } });
                                            return;
                                        }
                                        
                                        const text = await response.text();
                                        if (!text.trim()) {
                                            callback({ data: [], error: { message: 'Empty response' } });
                                            return;
                                        }
                                        
                                        const data = JSON.parse(text);
                                        callback({ data, error: null });
                                    } catch (error) {
                                        callback({ data: null, error: { message: error.message } });
                                    }
                                }
                            })
                        })
                    }),
                    limit: (count) => ({
                        order: (column, options = {}) => ({
                            async then(callback) {
                                const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&limit=${count}&order=${column}.${options.ascending ? 'asc' : 'desc'}`, {
                                    headers: {
                                        'apikey': supabaseKey,
                                        'Authorization': `Bearer ${supabaseKey}`,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                const data = await response.json();
                                callback({ data, error: response.ok ? null : { message: 'Error' } });
                            }
                        }),
                        async then(callback) {
                            try {
                                const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&limit=${count}`, {
                                    headers: {
                                        'apikey': supabaseKey,
                                        'Authorization': `Bearer ${supabaseKey}`,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                
                                if (!response.ok) {
                                    callback({ data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } });
                                    return;
                                }
                                
                                const text = await response.text();
                                if (!text.trim()) {
                                    callback({ data: [], error: { message: 'Empty response' } });
                                    return;
                                }
                                
                                const data = JSON.parse(text);
                                callback({ data, error: null });
                            } catch (error) {
                                callback({ data: null, error: { message: error.message } });
                            }
                        }
                    }),
                    order: (column, options = {}) => ({
                        limit: (count) => ({
                        async then(callback) {
                            try {
                                const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&order=${column}.${options.ascending ? 'asc' : 'desc'}&limit=${count}`, {
                                    headers: {
                                        'apikey': supabaseKey,
                                        'Authorization': `Bearer ${supabaseKey}`,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                
                                if (!response.ok) {
                                    callback({ data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } });
                                    return;
                                }
                                
                                const text = await response.text();
                                if (!text.trim()) {
                                    callback({ data: [], error: { message: 'Empty response' } });
                                    return;
                                }
                                
                                const data = JSON.parse(text);
                                callback({ data, error: null });
                            } catch (error) {
                                callback({ data: null, error: { message: error.message } });
                            }
                        }
                        }),
                        async then(callback) {
                            try {
                                const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&order=${column}.${options.ascending ? 'asc' : 'desc'}`, {
                                    headers: {
                                        'apikey': supabaseKey,
                                        'Authorization': `Bearer ${supabaseKey}`,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                
                                if (!response.ok) {
                                    callback({ data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } });
                                    return;
                                }
                                
                                const text = await response.text();
                                if (!text.trim()) {
                                    callback({ data: [], error: { message: 'Empty response' } });
                                    return;
                                }
                                
                                const data = JSON.parse(text);
                                callback({ data, error: null });
                            } catch (error) {
                                callback({ data: null, error: { message: error.message } });
                            }
                        }
                    }),
                    async then(callback) {
                        try {
                            const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}`, {
                                headers: {
                                    'apikey': supabaseKey,
                                    'Authorization': `Bearer ${supabaseKey}`,
                                    'Content-Type': 'application/json'
                                }
                            });
                            
                            if (!response.ok) {
                                callback({ data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } });
                                return;
                            }
                            
                            const text = await response.text();
                            if (!text.trim()) {
                                callback({ data: [], error: { message: 'Empty response' } });
                                return;
                            }
                            
                            const data = JSON.parse(text);
                            callback({ data, error: null });
                        } catch (error) {
                            callback({ data: null, error: { message: error.message } });
                        }
                    }
                }),
                insert: (records) => ({
                    select: async () => {
                        try {
                            const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
                                method: 'POST',
                                headers: {
                                    'apikey': supabaseKey,
                                    'Authorization': `Bearer ${supabaseKey}`,
                                    'Content-Type': 'application/json',
                                    'Prefer': 'return=representation'
                                },
                                body: JSON.stringify(records)
                            });
                            
                            if (!response.ok) {
                                return { data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } };
                            }
                            
                            const text = await response.text();
                            if (!text.trim()) {
                                return { data: [], error: { message: 'Empty response' } };
                            }
                            
                            const data = JSON.parse(text);
                            return { data, error: null };
                        } catch (error) {
                            return { data: null, error: { message: error.message } };
                        }
                    }
                }),
                update: (updates) => ({
                    eq: (column, value) => ({
                        select: async () => {
                            try {
                                const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'apikey': supabaseKey,
                                        'Authorization': `Bearer ${supabaseKey}`,
                                        'Content-Type': 'application/json',
                                        'Prefer': 'return=representation'
                                    },
                                    body: JSON.stringify(updates)
                                });
                                
                                if (!response.ok) {
                                    return { data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } };
                                }
                                
                                const text = await response.text();
                                if (!text.trim()) {
                                    return { data: [], error: { message: 'Empty response' } };
                                }
                                
                                const data = JSON.parse(text);
                                return { data, error: null };
                            } catch (error) {
                                return { data: null, error: { message: error.message } };
                            }
                        }
                    })
                }),
                delete: () => ({
                    eq: async (column, value) => {
                        try {
                            const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
                                method: 'DELETE',
                                headers: {
                                    'apikey': supabaseKey,
                                    'Authorization': `Bearer ${supabaseKey}`,
                                    'Content-Type': 'application/json'
                                }
                            });
                            
                            if (!response.ok) {
                                return { error: { message: `HTTP ${response.status}: ${response.statusText}` } };
                            }
                            
                            return { error: null };
                        } catch (error) {
                            return { error: { message: error.message } };
                        }
                    }
                })
            }),
            rpc: (functionName, params = {}) => ({
                async then(callback) {
                    try {
                        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
                            method: 'POST',
                            headers: {
                                'apikey': supabaseKey,
                                'Authorization': `Bearer ${supabaseKey}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(params)
                        });
                        
                        if (!response.ok) {
                            callback({ data: null, error: { message: `HTTP ${response.status}: ${response.statusText}` } });
                            return;
                        }
                        
                        const text = await response.text();
                        if (!text.trim()) {
                            callback({ data: null, error: { message: 'Empty response' } });
                            return;
                        }
                        
                        const data = JSON.parse(text);
                        callback({ data, error: null });
                    } catch (error) {
                        callback({ data: null, error: { message: error.message } });
                    }
                }
            }),
            storage: {
                from: (bucket) => ({
                    upload: async (path, file) => {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${supabaseKey}`
                            },
                            body: formData
                        });
                        
                        return { data: response.ok ? { path } : null, error: response.ok ? null : { message: 'Upload failed' } };
                    },
                    remove: async (paths) => {
                        const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${supabaseKey}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(paths)
                        });
                        
                        return { error: response.ok ? null : { message: 'Delete failed' } };
                    },
                    getPublicUrl: (path) => ({
                        data: { publicUrl: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}` }
                    })
                })
            }
        };
    }

    // Exposer createClient globalement
    if (typeof window !== 'undefined') {
        window.supabase = { createClient };
    }

})();
