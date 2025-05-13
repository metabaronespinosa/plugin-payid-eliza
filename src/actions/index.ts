import { Action, ActionExample, composePromptFromState, IAgentRuntime, Memory, ModelType, parseJSONObjectFromText, State } from '@elizaos/core';
import { PayIDService } from '../apiClient';
import { getSupportedNetworks, getSupportedTokens } from '../utils';
import { SupportedNetwork, SupportedToken } from '../types';


// // Action to claim a PayID
export const claimPayId: Action = ({
    name: 'CLAIM_PAYID',
    similes: ['REGISTER_PAYID'],
    description: 'Performs a claim of a Pay(ID)',
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options,
        callback
    ) => {
        try {
            state = await runtime.composeState(message, [
                ...(message.content.providers ?? []),
                'RECENT_MESSAGES',
            ]);

            const searchPayIDTemplate = `
                ${message.content.text}.

                From the above message extract the following information:
                1. In one word, the name of the Pay(ID) to claim which is the word next to Pay(ID).
                2. In one word, the user id of the owner of the Pay(ID).

                Return the name of the Pay(ID) and user id separated by a comma.
            `

            const text = await runtime.useModel(ModelType.TEXT_SMALL, {
                prompt: composePromptFromState({
                  state,
                  template: searchPayIDTemplate,
                }),
            });

            const [name, userId] = text.split(',');

            const s = new PayIDService(runtime);
            await s.claimPayId({ name, userId });

            const responseContent = {
                text: `Pay(ID) ${name} successfully claimed`,
                actions: ['CLAIM_PAYID']
            };

            await callback?.(responseContent);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    },
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "claim Pay(ID) fernando with user id 123-456-789",
                },
            },
            {
                name: "{{user2}}",
                content: {
                    text: "Pay(ID) fernando successfully claimed",
                },
                actions: ['CLAIM_PAYID']
            }
        ],
    ] as ActionExample[][],
})

// Action to search for PayIDs
export const searchPayIds: Action = ({
    name: 'SEARCH_PAYID',
    similes: ['LOOKUP_PAYID', 'CHECK_PAYID'],
    description: 'Performs a query of a Pay(ID)',
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options,
        callback
    ) => {
        try {
            state = await runtime.composeState(message, [
                ...(message.content.providers ?? []),
                'RECENT_MESSAGES',
            ]);
    
            const searchPayIDTemplate = `What is the Pay(ID) the user wants to search about? Extract ONLY the word next to Pay(ID) from this message: "${message.content.text}". Return just the word next to Pay(ID) with no additional text, punctuation, or explanation.`
    
            const search = await runtime.useModel(ModelType.TEXT_SMALL, {
                prompt: composePromptFromState({
                  state,
                  template: searchPayIDTemplate,
                }),
            });
    
            const s = new PayIDService(runtime);
            const { results: payIDList } = await s.searchPayIds({ search });
    
            const responseContent = {
                text: `Reveel Pay(ID) search results for "${search}"\n\nResults count: ${payIDList.length}\n\n${payIDList.map(payID => `Pay(ID): ${payID.name}, Email: ${payID.user.email}`).join('\n')}`,
                actions: ['SEARCH_PAYID']
            };
    
            await callback?.(responseContent);
    
            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    },
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "search Pay(ID) fernando",
                },
            },
            {
                name: "{{user2}}",
                content: {
                    text: "Search results here...",
                },
                actions: ['SEARCH_PAYID']
            }
        ],
    ] as ActionExample[][],
})

// Action to initialize a transaction
export const initTransaction: Action = ({
    name: 'INIT_TX_PAYID',
    similes: [],
    description: 'Performs a transaction to a Pay(ID)',
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options,
        callback
    ) => {
        try {
            state = await runtime.composeState(message, [
                ...(message.content.providers ?? []),
                'RECENT_MESSAGES',
            ]);
    
            const searchPayIDTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

            Example response:
            \`\`\`json
            {
                "userId": "123-456-789",
                "token": "USDT",
                "network": "BASE",
                "recipient": "fernando",
                "amount": "1000"
            }
            \`\`\`

            ${message.content.text}

            Extract the following information about the requested token transfer:
            - Sender id
            - Token type which must be one of the following: ${getSupportedTokens().join(', ')}
            - Network type which must be one of the following: ${getSupportedNetworks().join(', ')}
            - Recipient Pay(ID)
            - Amount to transfer

            If no token, recipient or network is mentioned, respond with null.`
    
            const result = await runtime.useModel(ModelType.TEXT_SMALL, {
                prompt: composePromptFromState({
                  state,
                  template: searchPayIDTemplate,
                }),
            });

            const responseContentObj = parseJSONObjectFromText(result) as {
                userId: string;
                token: SupportedToken;
                network: SupportedNetwork;
                recipient: string;
                amount: number
            };
    
            const s = new PayIDService(runtime);
            const response = await s.initTransaction({
                userId: responseContentObj.userId,
                amount: responseContentObj.amount,
                token: responseContentObj.token,
                network: responseContentObj.network,
                recipientPayId: responseContentObj.recipient
            });
    
            const responseContent = {
                text: `
                    Successfully initialized transaction:

                    ${JSON.stringify(response, null, 2)}
                `,
                actions: ['INIT_TX_PAYID']
            };
    
            await callback?.(responseContent);
    
            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    },
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Send 69 USDT from 123-456-789 to Pay(ID) fernando on the POL network",
                },
            },
            {
                name: "{{user2}}",
                content: {
                    text: "Successfully initialized transaction:",
                },
                actions: ['INIT_TX_PAYID']
            }
        ],
    ] as ActionExample[][],
})

// // Action to create a payment route
export const createRoute: Action = ({
    name: 'CREATE_ROUTE_PAYID',
    similes: [],
    description: 'Creates a route for a Pay(ID) user',
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options,
        callback
    ) => {
        try {
            state = await runtime.composeState(message, [
                ...(message.content.providers ?? []),
                'RECENT_MESSAGES',
            ]);
    
            const searchPayIDTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

            Example response:
            \`\`\`json
            {
                "userId": "123-456-789",
                "name": "My Route",
                "incomingTokens": ["USDT", "USDC"],
                "incomingNetworks": ["BASE", "POL"],
                "swapNetwork": "ETH",
                "swapToken": "ETH"
            }
            \`\`\`

            ${message.content.text}

            Extract the following information about the requested route creation:
            - user creator id
            - name of the route
            - incoming tokens list separated by a comma which must be included in this list: ${getSupportedTokens().join(', ')}
            - incoming networks list separated by a comma which must be included in this list: ${getSupportedNetworks().join(', ')}
            - swap network which must be one of the following: ${getSupportedNetworks().join(', ')}-
            - swap token which must be one of the following: ${getSupportedTokens().join(', ')}

            If no incoming tokens or networks is mentioned, respond with null.`
    
            const result = await runtime.useModel(ModelType.TEXT_LARGE, {
                prompt: composePromptFromState({
                  state,
                  template: searchPayIDTemplate,
                }),
            });

            const responseContentObj = parseJSONObjectFromText(result) as {
                userId,
                name,
                incomingTokens,
                incomingNetworks,
                swapNetwork,
                swapToken,
            };
    
            const s = new PayIDService(runtime);
            await s.createRoute({
                userId: responseContentObj.userId,
                name: responseContentObj.name,
                incomingNetworks: responseContentObj.incomingNetworks,
                incomingTokens: responseContentObj.incomingTokens,
                swapNetwork: responseContentObj.swapNetwork,
                swapToken: responseContentObj.swapToken
            });
    
            const responseContent = {
                text: `Route created successfully..`,
                actions: ['CREATE_ROUTE_PAYID']
            };
    
            await callback?.(responseContent);
    
            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    },
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Create a route with user id 123-456-789 and name My Route with incoming tokens USDT, USDC and incoming networks BASE, POL and swap network ETH and swap token ETH",
                },
            },
            {
                name: "{{user2}}",
                content: {
                    text: "Route created uccessfully...",
                },
                actions: ['CREATE_ROUTE_PAYID']
            }
        ],
    ] as ActionExample[][],
})

// // Action to get routes for a user
export const getRoutes: Action = ({
    name: 'GET_USER_ROUTES',
    similes: ['LIST_PAYID_ROUTES'],
    description: 'Performs a routes created of a Pay(ID)',
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options,
        callback
    ) => {
        try {
            state = await runtime.composeState(message, [
                ...(message.content.providers ?? []),
                'RECENT_MESSAGES',
            ]);

            const searchPayIDTemplate = `
                ${message.content.text}.

                from the text above, return in one word the user id.
            `

            const text = await runtime.useModel(ModelType.TEXT_SMALL, {
                prompt: composePromptFromState({
                  state,
                  template: searchPayIDTemplate,
                }),
            });

            const s = new PayIDService(runtime);
            const { routes } = await s.getRoutes(text);

            const responseContent = {
                text: `
                    Pay(ID) routes for user "${text}":\n\n
                    ${routes.map((route) => `
                        - Name: ${route.name}, 
                        Incoming tokens: ${route.incomingTokens.join(', ')},
                        Incoming networks: ${route.incomingNetworks.join(', ')},
                        Incoming wallets: ${route.incomingWallets.join(', ')},
                        Swap network: ${route.swapNetwork}, 
                        Swap token: ${route.swapToken}, 
                        Outgoing wallet: ${route.outgoingWallet}`).join('\n')}
                `,
                actions: ['GET_USER_ROUTES']
            };

            await callback?.(responseContent);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    },
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "get routes for user id 123-456-789",
                },
            },
            {
                name: "{{user2}}",
                content: {
                    text: "Pay(ID) routes for user id 123-456-789:",
                },
                actions: ['GET_USER_ROUTES']
            }
        ],
    ] as ActionExample[][],
})

// // Action to delete a route
export const deleteRoute: Action = ({
    name: 'DELETE_ROUTE_PAYID',
    similes: ['REMOVE_ROUTE_PAYID'],
    description: 'Performs a route deletion',
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options,
        callback
    ) => {
        try {
            state = await runtime.composeState(message, [
                ...(message.content.providers ?? []),
                'RECENT_MESSAGES',
            ]);

            const searchPayIDTemplate = `
                ${message.content.text}.

                From the above message extract the following information:
                1. the value of the Pay(ID) route id.
                2. the value of the user id.

                Return only the values for the route if and user id separated by a comma.
            `

            const text = await runtime.useModel(ModelType.TEXT_SMALL, {
                prompt: composePromptFromState({
                  state,
                  template: searchPayIDTemplate,
                }),
            });

            console.log("#$%#$%#$%", text)

            const [routeId, userId] = text.split(',');

            const s = new PayIDService(runtime);
            await s.deleteRoute(routeId, userId);

            const responseContent = {
                text: `"Pay(ID) Route ${routeId} from user id ${userId} successfully deleted`,
                actions: ['DELETE_ROUTE_PAYID']
            };

            await callback?.(responseContent);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    },
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Delete Pay(ID) route with id 1123-4456-7789 from user with if 123-456-789",
                },
            },
            {
                name: "{{user2}}",
                content: {
                    text: "Pay(ID) Route with id 1123-4456-7789 from user with id 123-456-789 successfully deleted",
                },
                actions: ['DELETE_ROUTE_PAYID']
            }
        ],
    ] as ActionExample[][],
})
                        
// // Action to check route conflicts
// export const checkRouteConflicts: Action = ({
//     name: "checkRouteConflicts",
//     description: "checkRouteConflicts Action",
//     validate: async () => true,
//     handler: async (
//         runtime: IAgentRuntime,
//         _message: Memory,
//         _state: State,
//         _options: unknown,
//         // userId: string,
//         // incomingNetworks: SupportedNetwork[],
//         // incomingTokens: SupportedToken[],
//         // routeId?: string
//     ) => {
//             const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
//             return await payIdService.checkRouteConflicts(/* userId, incomingNetworks, incomingTokens, routeId */);
//         }
//     })
                            
// // Action to get transaction history
export const getTransactionHistory: Action = ({
    name: 'GET_USER_TX_HISTORY',
    similes: ['LIST_USER_TX_HISTORY'],
    description: 'get transaction history of a Pay(ID)',
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options,
        callback
    ) => {
        try {
            state = await runtime.composeState(message, [
                ...(message.content.providers ?? []),
                'RECENT_MESSAGES',
            ]);

            const searchPayIDTemplate = `
                ${message.content.text}.

                from the text above, return in one word the user id.
            `

            const text = await runtime.useModel(ModelType.TEXT_SMALL, {
                prompt: composePromptFromState({
                  state,
                  template: searchPayIDTemplate,
                }),
            });

            const s = new PayIDService(runtime);
            const { activities } = await s.getTransactionHistory(text);

            const responseContent = {
                text: `
                    Transaction history for user "${text}":\n\n
                    ${activities.map((activity) => `
                        - Tx hash: ${activity.hash}, 
                        - Type: ${activity.type}, 
                        - Amount: ${activity.amount}, 
                        - Token: ${activity.incomingToken}, 
                        - Network: ${activity.incomingNetwork}, 
                        - Timestamp: ${activity.createdAt}`).join('\n')}
                `,
                actions: ['GET_USER_TX_HISTORY']
            };

            await callback?.(responseContent);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    },
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "get transaction history for user id 123-456-789",
                },
            },
            {
                name: "{{user2}}",
                content: {
                    text: "Transaction history for user id 123-456-789:",
                },
                actions: ['GET_USER_TX_HISTORY']
            }
        ],
    ] as ActionExample[][],
})
                            
// // // Utility actions
// export const getSupportedTokens = () => {
//     const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
//     return payIdService.getSupportedTokens();
// }

// // export const getSupportedNetworks = () => {
// //     const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
// //     return payIdService.getSupportedNetworks();
// // }

// // export const validateTokenNetworkPair = (token: SupportedToken, network: SupportedNetwork) => {
// //     const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
// //     return payIdService.isValidTokenNetworkPair(token, network);
// // }
