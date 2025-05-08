import axios, { AxiosInstance } from 'axios';
import {
  ClaimPayIdRequest,
  SearchPayIdsRequest,
  InitTransactionRequest,
  CreateRouteRequest,
  TransactionActivity,
  PayIdRoute,
  SupportedToken,
  SupportedNetwork,
  PayId
} from './types';
import { IAgentRuntime, Provider } from '@elizaos/core';

export class PayIDService {
  private client: AxiosInstance;

  constructor(runtime: IAgentRuntime) {
    const apiKey = process.env.REVEEL_PAYID_API_KEY
    const baseURL = process.env.REVEEL_PAYID_BASE_URL
  
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Claim a PayID for a user
   */
  async claimPayId(params?: ClaimPayIdRequest): Promise<any> {
    try {
      const response = await this.client.post('/pay-ids', {
        name: params.name,
        userId: params.userId
      });

      const { data } = response.data;
      return data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('PayID already taken');
      }
      throw new Error(`Failed to claim PayID: ${error.message}`);
    }
  }

  /**
   * Search for PayIDs
   */
  async searchPayIds(params?: SearchPayIdsRequest): Promise<PayId[]> {
    try {
      const { data } = await this.client.get('/pay-ids/search', {
        params: {
          q: params.search,
          limit: params.limit || 10,
          activeOnly: params.activeOnly || true
        }
      });

      const payIds = data.data.results;
      return payIds;
    } catch (error) {
      throw new Error(`Failed to search for PayIDs: ${error.message}`);
    }
  }

  /**
   * Initialize a transaction
   */
  async initTransaction(params?: InitTransactionRequest): Promise<any> {
    try {
      const payload: any = {
        userId: params.userId,
        amount: params.amount,
        token: params.token,
        network: params.network
      };

      if (params.recipientPayId) {
        payload.recipientPayId = params.recipientPayId;
      } else if (params.walletAddress) {
        payload.walletAddress = params.walletAddress;
      } else {
        throw new Error('Either recipientPayId or walletAddress must be provided');
      }

      if (params.message) {
        payload.message = params.message;
      }

      const response = await this.client.post('/transactions', payload);

      const { data } = response.data;
      return data;
    } catch (error) {
      throw new Error(`Failed to initialize transaction: ${error.message}`);
    }
  }

  /**
   * Create a payment route
   */
  async createRoute(params?: CreateRouteRequest): Promise<PayIdRoute> {
    try {
      const response = await this.client.post('/routes', {
        userId: params.userId,
        name: params.name,
        incomingNetworks: params.incomingNetworks,
        incomingTokens: params.incomingTokens,
        incomingWallets: params.incomingWallets || [],
        swapNetwork: params.swapNetwork || null,
        swapToken: params.swapToken || null,
        outgoingWallet: params.outgoingWallet
      });

      const { data } = response.data;
      return data.route;
    } catch (error) {
      throw new Error(`Failed to create route: ${error.message}`);
    }
  }

  /**
   * Get routes for a user
   */
  async getRoutes(userId?: string): Promise<PayIdRoute[]> {
    try {
      const response = await this.client.get(`/routes/${userId}`);

      const { data } = response.data;
      return data.routes;
    } catch (error) {
      throw new Error(`Failed to get routes: ${error.message}`);
    }
  }

  /**
   * Delete a route
   */
  async deleteRoute(routeId?: string, userId?: string): Promise<void> {
    try {
      await this.client.delete(`/routes/${routeId}`, {
        data: {
          userId
        }
      });
    } catch (error) {
      throw new Error(`Failed to delete route: ${error.message}`);
    }
  }

  /**
   * Get transaction history for a user
   */
  async getTransactionHistory(userId?: string, page?: number, pageSize?: number): Promise<{activities: TransactionActivity[], pagination: any}> {
    try {
      const response = await this.client.get(`/transactions/users/${userId}/activities`, {
        params: {
          page,
          pageSize
        }
      });

      const { data } = response.data;
      return data;
    } catch (error) {
      throw new Error(`Failed to get transaction history: ${error.message}`);
    }
  }

  /**
   * Check if a route configuration conflicts with existing routes
   */
  async checkRouteConflicts(userId?: string, incomingNetworks?: SupportedNetwork[], incomingTokens?: SupportedToken[], routeId?: string): Promise<boolean> {
    try {
      const payload: any = {
        userId,
        incomingNetworks,
        incomingTokens
      };

      if (routeId) {
        payload.routeId = routeId;
      }

      const response = await this.client.post('/routes/check-conflicts', payload);

      const { data } = response.data;
      return data.hasConflicts;
    } catch (error) {
      throw new Error(`Failed to check route conflicts: ${error.message}`);
    }
  }

  /**
   * Get supported tokens and networks
   */
  getSupportedTokens(): SupportedToken[] {
    return ['USDT', 'USDC', 'ETH', 'BNB', 'POL'];
  }

  getSupportedNetworks(): SupportedNetwork[] {
    return ['ETH', 'POL', 'OP', 'BNB', 'BASE'];
  }

  /**
   * Validate token/network compatibility
   */
  isValidTokenNetworkPair(token: SupportedToken, network: SupportedNetwork): boolean {
    // Based on the API documentation, these combinations are not supported
    const invalidCombinations = [
      { token: 'POL', network: 'OP' },
      { token: 'BNB', network: 'OP' },
      { token: 'USDT', network: 'BASE' },
      { token: 'BNB', network: 'BASE' },
      { token: 'POL', network: 'BASE' }
    ];

    return !invalidCombinations.some(
      combo => combo.token === token && combo.network === network
    );
  }
}

export const searchPayID: Provider = {
  name: 'searchReveelPayID',
  description: 'search a PayID',
  dynamic: true,
  get: async (runtime, _message, state) => {
    const search = state.values.search || "";

    try {
      const s = new PayIDService(runtime);

      const payIds = await s.searchPayIds({ search });

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
