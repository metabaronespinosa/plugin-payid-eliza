import type { Plugin } from "@elizaos/core";
import { searchPayID } from "./provider";
import {
    searchPayIds,
    claimPayId,
    getRoutes,
    createRoute,
    initTransaction,
    deleteRoute,
    getTransactionHistory,
//     checkRouteConflicts
} from "./actions";
import { testSuite } from "./tests";

export const payIDPlugin: Plugin = {
    name: "plugin-payid-eliza",
    description: "Reveel PayID ElizaOS Plugin",
    providers: [searchPayID],
    evaluators: [],
    services: [],
    tests: [...testSuite],
    actions: [
        searchPayIds,
        claimPayId,
        getRoutes,
        createRoute,
        initTransaction,
        deleteRoute,
        getTransactionHistory,
        // checkRouteConflicts
    ],
};

export default payIDPlugin;
