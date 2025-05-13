import { SupportedNetwork, SupportedToken } from "./types";

/**
 * Get supported tokens and networks
 */
export const getSupportedTokens = (): SupportedToken[] => {
    return ['USDT', 'USDC', 'ETH', 'BNB', 'POL'];
}

export const getSupportedNetworks = (): SupportedNetwork[] => {
    return ['ETH', 'POL', 'OP', 'BNB', 'BASE'];
}
