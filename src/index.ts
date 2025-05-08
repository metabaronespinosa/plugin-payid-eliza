import type { Plugin } from "@elizaos/core";
import { PayIDService } from "./client.ts";
import {
    claimPayId,
    searchPayIds,
    getRoutes,
    createRoute,
    initTransaction,
    deleteRoute,
    getTransactionHistory,
    checkRouteConflicts
} from "./actions.ts";

export const payIDPlugin: Plugin = {
    name: "payid-eliza-plugin",
    description: "Reveel PayID ElizaOS Plugin",
    providers: [],
    evaluators: [],
    services: [PayIDService],
    actions: [
        claimPayId,
        searchPayIds,
        getRoutes,
        createRoute,
        initTransaction,
        deleteRoute,
        getTransactionHistory,
        checkRouteConflicts
    ],
};

export default payIDPlugin;
