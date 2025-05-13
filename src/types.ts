// Configuration
export interface PayIDPluginConfig {
    apiKey: string;
    baseUrl?: string;
  }
  
  // Supported tokens and networks
  export type SupportedToken = 'USDT' | 'USDC' | 'ETH' | 'BNB' | 'POL';
  export type SupportedNetwork = 'ETH' | 'POL' | 'OP' | 'BNB' | 'BASE';
  
  // Request types
  export interface ClaimPayIdRequest {
    name: string;
    userId: string;
  }
  
  export interface SearchPayIdsRequest {
    search: string;
    limit?: number;
    activeOnly?: boolean;
  }
  
  export interface InitTransactionRequest {
    userId: string;
    amount: number;
    token: SupportedToken;
    network: SupportedNetwork;
    recipientPayId?: string;
    walletAddress?: string;
    message?: string;
  }
  
  export interface CreateRouteRequest {
    userId: string;
    name: string;
    incomingNetworks: SupportedNetwork[];
    incomingTokens: SupportedToken[];
    incomingWallets?: string[];
    swapNetwork?: SupportedNetwork;
    swapToken?: SupportedToken;
    outgoingWallet?: string;
  }
  
  // Response types
  export interface PayId {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
    }
  }
  
  export interface TransactionInitialize {
    amount: number;
    token: SupportedToken;
    network: SupportedNetwork;
    tx: {
      to: string;
      data: string;
      value: string;
      chainId: number;
    };
    fees?: {
      applicationFee: number | null;
      protocolFee: number | null;
      bridgeFee: number | null;
    };
    approveTx?: {
      to: string;
      data: string;
      chainId: number;
    } | null;
  }
  
  export interface TransactionActivity {
    id: string;
    userId: string;
    type: 'SEND' | 'RECEIVE';
    amount: number;
    incomingToken: string;
    incomingNetwork: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    hash: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PayIdRoute {
    id: string;
    name: string;
    incomingWallets: string[];
    incomingNetworks: SupportedNetwork[];
    incomingTokens: SupportedToken[];
    swapNetwork: SupportedNetwork | null;
    swapToken: SupportedToken | null;
    outgoingWallet: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  