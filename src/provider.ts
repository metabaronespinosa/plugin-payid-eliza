
import { Provider } from '@elizaos/core';
import { PayIDService } from './apiClient';

export const searchPayID: Provider = {
  name: 'searchReveelPayID',
  description: 'search a PayID',
  dynamic: true,
  get: async (runtime, _message, state) => {
    const search = state.values.search || "";

    try {
      const s = new PayIDService(runtime);

      const { results: payIds } = await s.searchPayIds({ search });

      let output = `Reveel Pay(ID) search results for "${1}"\n`;

      output += `Results count: ${payIds.length}\n`;

      output += '------------------------\n';

      for (const payId of payIds) {
        output += `Pay(ID): ${payId.name}, Email: ${payId.user.email}\n`;
      }

      output += '------------------------\n';

      return {
        text: output,
        values: {
          payIds
        },
      };
    } catch (error) {
      // throw new Error(`Failed to search PayID: ${error.message}`);
      console.log("ERR:::", error)

      return {
        text: 'No PayID found',
        values: {},
      };
    }
  },
};
