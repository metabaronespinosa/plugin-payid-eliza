import { Content, IAgentRuntime, Memory, State, UUID } from "@elizaos/core";
import { v4 as uuidv4 } from 'uuid';

export const testSuite = [
    {
        name: 'search-payid',
        tests: [
            {
                name: 'search-andree',
                fn: async (runtime: IAgentRuntime) => {
                    const message: Memory = {
                        entityId: uuidv4() as UUID,
                        roomId: uuidv4() as UUID,
                        content: {
                            text: 'list all similar Pay(ID) for andree',
                            source: 'test',
                            actions: ['SEARCH_PAYID'],
                        },
                    };
                    
                    const state: State = {
                        values: {},
                        data: {},
                        text: '',
                    };
                    let responseReceived = false;
                    
                    try {
                        await runtime.processActions(message, [], state, async (content: Content) => {
                            if (content.actions?.includes('SEARCH_PAYID')) {
                                responseReceived = true;
                            }
                            return [];
                        });
                        
                        if (!responseReceived) {
                            const searchPayIDAction = runtime.actions.find((a) => a.name === 'SEARCH_PAYID');
                            
                            if (searchPayIDAction) {
                                await searchPayIDAction.handler(
                                    runtime,
                                    message,
                                    state,
                                    {},
                                    async (content: Content) => {                                        
                                        if (content.actions?.includes('SEARCH_PAYID')) {
                                            console.log("SEARCH_PAYID_ACTION_RESPONSE:::", content)

                                            responseReceived = true;
                                        }
                                        return [];
                                    },
                                    []
                                );
                            } else {
                                throw new Error('SEARCH_PAYID action not found in runtime.actions');
                            }
                        }
                        
                        if (!responseReceived) {
                            throw new Error('SEARCH_PAYID action did not produce expected response');
                        }
                    } catch (error) {
                        throw new Error(`SEARCH_PAYID action test failed: ${error.message}`);
                    }
                },
            },
            {
                name: 'claim-andree',
                fn: async (runtime: IAgentRuntime) => {
                    const message: Memory = {
                        entityId: uuidv4() as UUID,
                        roomId: uuidv4() as UUID,
                        content: {
                            text: 'claim Pay(ID) andree with the user id 123-456-789',
                            source: 'test',
                            actions: ['CLAIM_PAYID'],
                        },
                    };
                    
                    const state: State = {
                        values: {},
                        data: {},
                        text: '',
                    };
                    let responseReceived = false;
                    
                    try {
                        await runtime.processActions(message, [], state, async (content: Content) => {
                            if (content.actions?.includes('CLAIM_PAYID')) {
                                responseReceived = true;
                            }
                            return [];
                        });
                        
                        if (!responseReceived) {
                            const searchPayIDAction = runtime.actions.find((a) => a.name === 'CLAIM_PAYID');
                            
                            if (searchPayIDAction) {
                                await searchPayIDAction.handler(
                                    runtime,
                                    message,
                                    state,
                                    {},
                                    async (content: Content) => {                                        
                                        if (content.actions?.includes('CLAIM_PAYID')) {
                                            console.log("CLAIM_PAYID_ACTION_RESPONSE:::", content)

                                            responseReceived = true;
                                        }
                                        return [];
                                    },
                                    []
                                );
                            } else {
                                throw new Error('CLAIM_PAYID action not found in runtime.actions');
                            }
                        }
                        
                        if (!responseReceived) {
                            throw new Error('CLAIM_PAYID action did not produce expected response');
                        }
                    } catch (error) {
                        throw new Error(`CLAIM_PAYID action test failed: ${error.message}`);
                    }
                },
            },
            {
                name: 'init-tx',
                fn: async (runtime: IAgentRuntime) => {
                    const message: Memory = {
                        entityId: uuidv4() as UUID,
                        roomId: uuidv4() as UUID,
                        content: {
                            text: 'Send 69 USDT from 123-456-789 to Pay(ID) fernando on the BASE network',
                            source: 'test',
                            actions: ['INIT_TX_PAYID'],
                        },
                    };
                    
                    const state: State = {
                        values: {},
                        data: {},
                        text: '',
                    };
                    let responseReceived = false;
                    
                    try {
                        await runtime.processActions(message, [], state, async (content: Content) => {
                            if (content.actions?.includes('INIT_TX_PAYID')) {
                                responseReceived = true;
                            }
                            return [];
                        });
                        
                        if (!responseReceived) {
                            const searchPayIDAction = runtime.actions.find((a) => a.name === 'INIT_TX_PAYID');
                            
                            if (searchPayIDAction) {
                                await searchPayIDAction.handler(
                                    runtime,
                                    message,
                                    state,
                                    {},
                                    async (content: Content) => {                                        
                                        if (content.actions?.includes('INIT_TX_PAYID')) {
                                            console.log("INIT_TX_PAYID_ACTION_RESPONSE:::", content)

                                            responseReceived = true;
                                        }
                                        return [];
                                    },
                                    []
                                );
                            } else {
                                throw new Error('INIT_TX_PAYID action not found in runtime.actions');
                            }
                        }
                        
                        if (!responseReceived) {
                            throw new Error('INIT_TX_PAYID action did not produce expected response');
                        }
                    } catch (error) {
                        throw new Error(`INIT_TX_PAYID action test failed: ${error.message}`);
                    }
                },
            },
            {
                name: 'get-pay-id-routes',
                fn: async (runtime: IAgentRuntime) => {
                    const message: Memory = {
                        entityId: uuidv4() as UUID,
                        roomId: uuidv4() as UUID,
                        content: {
                            text: 'get routes for user id 8d397e08-f264-4b0f-8460-951ad6806f69',
                            source: 'test',
                            actions: ['GET_USER_ROUTES'],
                        },
                    };
                    
                    const state: State = {
                        values: {},
                        data: {},
                        text: '',
                    };
                    let responseReceived = false;

                    try {
                        await runtime.processActions(message, [], state, async (content: Content) => {
                            if (content.actions?.includes('GET_USER_ROUTES')) {
                                responseReceived = true;
                            }
                            return [];
                        });

                        if (!responseReceived) {
                            const searchPayIDAction = runtime.actions.find((a) => a.name === 'GET_USER_ROUTES');

                            if (searchPayIDAction) {
                                await searchPayIDAction.handler(
                                    runtime,
                                    message,
                                    state,
                                    {},
                                    async (content: Content) => {                                        
                                        if (content.actions?.includes('GET_USER_ROUTES')) {
                                            console.log("GET_USER_ROUTES_ACTION_RESPONSE:::", content)

                                            responseReceived = true;
                                        }
                                        return [];
                                    },
                                    []
                                );
                            } else {
                                throw new Error('GET_USER_ROUTES action not found in runtime.actions');
                            }
                        }

                        if (!responseReceived) {
                            throw new Error('GET_USER_ROUTES action did not produce expected response');
                        }
                    } catch (error) {
                        throw new Error(`GET_USER_ROUTES action test failed: ${error.message}`);
                    }
                },
            },
            {
                name: 'get-pay-id-tx-history',
                fn: async (runtime: IAgentRuntime) => {
                    const message: Memory = {
                        entityId: uuidv4() as UUID,
                        roomId: uuidv4() as UUID,
                        content: {
                            text: 'get transaction history for user id 8d397e08-f264-4b0f-8460-951ad6806f69',
                            source: 'test',
                            actions: ['GET_USER_TX_HISTORY'],
                        },
                    };
                    
                    const state: State = {
                        values: {},
                        data: {},
                        text: '',
                    };
                    let responseReceived = false;

                    try {
                        await runtime.processActions(message, [], state, async (content: Content) => {
                            if (content.actions?.includes('GET_USER_TX_HISTORY')) {
                                responseReceived = true;
                            }
                            return [];
                        });

                        if (!responseReceived) {
                            const searchPayIDAction = runtime.actions.find((a) => a.name === 'GET_USER_TX_HISTORY');

                            if (searchPayIDAction) {
                                await searchPayIDAction.handler(
                                    runtime,
                                    message,
                                    state,
                                    {},
                                    async (content: Content) => {                                        
                                        if (content.actions?.includes('GET_USER_TX_HISTORY')) {
                                            console.log("GET_USER_TX_HISTORY_ACTION_RESPONSE:::", content)

                                            responseReceived = true;
                                        }
                                        return [];
                                    },
                                    []
                                );
                            } else {
                                throw new Error('GET_USER_TX_HISTORY action not found in runtime.actions');
                            }
                        }

                        if (!responseReceived) {
                            throw new Error('GET_USER_TX_HISTORY action did not produce expected response');
                        }
                    } catch (error) {
                        throw new Error(`GET_USER_TX_HISTORY action test failed: ${error.message}`);
                    }
                },
            },
            {
                name: 'create-route',
                fn: async (runtime: IAgentRuntime) => {
                    const message: Memory = {
                        entityId: uuidv4() as UUID,
                        roomId: uuidv4() as UUID,
                        content: {
                            text: 'create a route with user id 123-456-789 and name My Route with incoming tokens "USDT,USDC" and incoming networks "BASE,POL" and swap network ETH and swap token ETH',
                            source: 'test',
                            actions: ['CREATE_ROUTE_PAYID'],
                        },
                    };
                    
                    const state: State = {
                        values: {},
                        data: {},
                        text: '',
                    };
                    let responseReceived = false;

                    try {
                        await runtime.processActions(message, [], state, async (content: Content) => {
                            if (content.actions?.includes('CREATE_ROUTE_PAYID')) {
                                responseReceived = true;
                            }
                            return [];
                        });

                        if (!responseReceived) {
                            const searchPayIDAction = runtime.actions.find((a) => a.name === 'CREATE_ROUTE_PAYID');

                            if (searchPayIDAction) {
                                await searchPayIDAction.handler(
                                    runtime,
                                    message,
                                    state,
                                    {},
                                    async (content: Content) => {                                        
                                        if (content.actions?.includes('CREATE_ROUTE_PAYID')) {
                                            console.log("CREATE_ROUTE_PAYID_ACTION_RESPONSE:::", content)

                                            responseReceived = true;
                                        }
                                        return [];
                                    },
                                    []
                                );
                            } else {
                                throw new Error('CREATE_ROUTE_PAYID action not found in runtime.actions');
                            }
                        }

                        if (!responseReceived) {
                            throw new Error('CREATE_ROUTE_PAYID action did not produce expected response');
                        }
                    } catch (error) {
                        throw new Error(`CREATE_ROUTE_PAYID action test failed: ${error.message}`);
                    }
                },
            },
            {
                name: 'delete-route',
                fn: async (runtime: IAgentRuntime) => {
                    const message: Memory = {
                        entityId: uuidv4() as UUID,
                        roomId: uuidv4() as UUID,
                        content: {
                            text: 'Delete Pay(ID)route with id 1123-4456-7789 from user with id 123-456-789',
                            source: 'test',
                            actions: ['DELETE_ROUTE_PAYID'],
                        },
                    };
                    
                    const state: State = {
                        values: {},
                        data: {},
                        text: '',
                    };
                    let responseReceived = false;

                    try {
                        await runtime.processActions(message, [], state, async (content: Content) => {
                            if (content.actions?.includes('DELETE_ROUTE_PAYID')) {
                                responseReceived = true;
                            }
                            return [];
                        });

                        if (!responseReceived) {
                            const searchPayIDAction = runtime.actions.find((a) => a.name === 'DELETE_ROUTE_PAYID');

                            if (searchPayIDAction) {
                                await searchPayIDAction.handler(
                                    runtime,
                                    message,
                                    state,
                                    {},
                                    async (content: Content) => {                                        
                                        if (content.actions?.includes('DELETE_ROUTE_PAYID')) {
                                            console.log("DELETE_ROUTE_PAYID_ACTION_RESPONSE:::", content)

                                            responseReceived = true;
                                        }
                                        return [];
                                    },
                                    []
                                );
                            } else {
                                throw new Error('DELETE_ROUTE_PAYID action not found in runtime.actions');
                            }
                        }

                        if (!responseReceived) {
                            throw new Error('DELETE_ROUTE_PAYID action did not produce expected response');
                        }
                    } catch (error) {
                        throw new Error(`DELETE_ROUTE_PAYID action test failed: ${error.message}`);
                    }
                },
            }
        ],
    },
];
