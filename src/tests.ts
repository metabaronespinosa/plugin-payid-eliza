import { Content, IAgentRuntime, Memory, ModelType, State, UUID } from "@elizaos/core";
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
                        console.log("SEARCH_PAYID_ACTION_RESPONSE:::", content)

                        if (content.actions?.includes('SEARCH_PAYID')) {
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
                          console.log("CLAIM_PAYID_ACTION_RESPONSE:::", content)
  
                          if (content.actions?.includes('CLAIM_PAYID')) {
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
          }
      ],
    },
  ];
