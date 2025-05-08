import { Action, ActionExample, composePromptFromState, elizaLogger, IAgentRuntime, Memory, ModelType, parseJSONObjectFromText, State } from '@elizaos/core';
import { PayIDService } from './provider';
// import {
//     // ClaimPayIdRequest,
//     // SearchPayIdsRequest,
//     // InitTransactionRequest,
//     // CreateRouteRequest,
//     // SupportedToken,
//     // SupportedNetwork
// } from './types';
// import { PayIDService } from './provider';

// // Action to claim a PayID
// export const claimPayId: Action = ({
//     name: "claimPayId",
//     description: "claimPayId Action",
//     validate: async () => true,
//     handler: async (
//         runtime: IAgentRuntime,
//         _message: Memory,
//         __state: State,
//         _options: unknown,
//         // params: ClaimPayIdRequest
//     ) => {
//         const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);

//         return await payIdService.claimPayId(/* params */);
//     }
// })

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
            const payIDList = await s.searchPayIds({ search });
    
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

// // Action to initialize a transaction
// export const initTransaction: Action = ({
//     name: "initTransaction",
//     description: "initTransaction Action",
//     validate: async () => true,
//     handler: async (
//         runtime: IAgentRuntime,
//         _message: Memory,
//         _state: State,
//         _options: unknown,
//         // params: InitTransactionRequest
//     ) => {
//         const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
//         return await payIdService.initTransaction(/* params */);
//     }
// })

// // Action to create a payment route
// export const createRoute: Action = ({
//     name: "createRoute",
//     description: "createRoute Action",
//     validate: async () => true,
//     handler: async (
//         runtime: IAgentRuntime,
//         _message: Memory,
//         _state: State,
//         _options: unknown,
//         // params: CreateRouteRequest
//     ) => {
//         const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
//         return await payIdService.createRoute(/* params */);
//     }
// })

// // Action to get routes for a user
// export const getRoutes: Action = ({
//     name: "getRoutes",
//     description: "getRoutes Action",
//     validate: async () => true,
//     handler: async (
//         runtime: IAgentRuntime,
//         _message: Memory,
//         _state: State,
//         _options: unknown,
//         // userId: string
//     ) => {
//         const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
//         return await payIdService.getRoutes(/* userId */);
//     }
// })
                    
// // Action to delete a route
// export const deleteRoute: Action = ({
//     name: "deleteRoute",
//     description: "deleteRoute Action",
//     validate: async () => true,
//     handler: async (
//         runtime: IAgentRuntime,
//         _message: Memory,
//         _state: State,
//         _options: unknown,
//         // routeId: string,
//         // userId: string
//     ) => {
//         const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
//         return await payIdService.deleteRoute(/* routeId, userId */);
//     }
// })
                        
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
// export const getTransactionHistory: Action = ({
//     name: "getTransactionHistory",
//     description: "getTransactionHistory Action",
//     validate: async () => true,
//     handler: async (
//         runtime: IAgentRuntime,
//         _message: Memory,
//         _state: State,
//         _options: unknown,
//         // userId: string,
//         // page?: number,
//         // pageSize?: number
//     ) => {
//         const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
//         return await payIdService.getTransactionHistory(/* userId, page, pageSize */);
//     }
// })
                            
// // // Utility actions
// // export const getSupportedTokens = () => {
// //     const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
// //     return payIdService.getSupportedTokens();
// // }

// // export const getSupportedNetworks = () => {
// //     const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
// //     return payIdService.getSupportedNetworks();
// // }

// // export const validateTokenNetworkPair = (token: SupportedToken, network: SupportedNetwork) => {
// //     const payIdService = runtime.getService<PayIDService>(PayIDService.serviceType);
// //     return payIdService.isValidTokenNetworkPair(token, network);
// // }
