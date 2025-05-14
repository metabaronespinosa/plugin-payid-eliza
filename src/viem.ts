import { createPublicClient, createWalletClient, http, parseUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet, polygon, bsc, base, optimism } from 'viem/chains'

export const tokenDecimalsMapper = {
    ETH: 18,
    USDT: 6,
    USDC: 6,
    BNB: 18,
    POL: 18,
};

export const chainsMapper = {
    ETH: 1,
    POL: 137,
    BNB: 56,
    BASE: 8453,
    OP: 10,
};

const chainInstanceMapper = {
    [mainnet.id]: mainnet,
    [polygon.id]: polygon,
    [bsc.id]: bsc,
    [base.id]: base,
    [optimism.id]: optimism
}

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`) 

const client = (_chain: keyof typeof chainsMapper) => {
    const chain = chainInstanceMapper[_chain]

    return {
        walletClient: createWalletClient({
        account,
        chain,
        transport: http()
    }), publicClient: createPublicClient({ 
        chain,
        transport: http()
      })
    }
}

export const sendTx = async (chain: keyof typeof chainsMapper, tx: any) => {
    const { walletClient, publicClient } = client(chain)

    const hash = await walletClient.sendTransaction(tx)

    await publicClient.waitForTransactionReceipt({ hash })
    
    return hash
}
