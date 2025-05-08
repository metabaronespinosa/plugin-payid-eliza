import { Action, ActionExample, composePromptFromState, elizaLogger, IAgentRuntime, Memory, ModelType, parseJSONObjectFromText, State } from '@elizaos/core';
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

const searchPayIDTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
    \`\`\`json
    {
        "PayID": "fernando"
    }
    \`\`\`

{{recentMessages}}

Given the recent messages, extract or generate (come up with if not included) the following information about the requested search of PayID:
- PayID

If no search or PayID is mentioned, respond with null.`;

// Action to search for PayIDs
export const searchPayIds: Action = ({
    name: 'SEARCH_PAYID',
    similes: ['LOOKUP_PAYID', 'CHECK_PAYID'],
    description: 'Performs a query of a PayID',
    validate: async () => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options,
        callback
    ) => {
        state = await runtime.composeState(message, [
            ...(message.content.providers ?? []),
            'RECENT_MESSAGES',
        ]);
        const response = await runtime.useModel(ModelType.TEXT_SMALL, {
            prompt: composePromptFromState({
              state,
              template: searchPayIDTemplate,
            }),
          });

        console.log('state', response);


        // const responseContentObj = parseJSONObjectFromText(response);
        // const responseContent = {
        //     thought: responseContentObj.thought,
        //     text: responseContentObj.message || '',
        //     actions: ['SEARCH_PAY_ID'],
        // };

        await callback?.({
            text: 'Search results here...',
            actions: ['SEARCH_PAYID'],
        });

        return true;
    },
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "search PayID fernando",
                },
            },
            {
                name: "{{user2}}",
                content: {
                    text: "Searching PayID...",
                },
                actions: ['SEARCH_PAYID']
            },
            {
                name: "{{user2}}",
                content: {
                    text: "Search results here...",
                }
            },
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
