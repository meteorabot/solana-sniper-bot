"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurnFilter = void 0;
const helpers_1 = require("../helpers");
class BurnFilter {
    constructor(connection) {
        this.connection = connection;
        this.cachedResult = undefined;
    }
    execute(poolKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachedResult) {
                return this.cachedResult;
            }
            try {
                const amount = yield this.connection.getTokenSupply(poolKeys.lpMint, this.connection.commitment);
                const burned = amount.value.uiAmount === 0;
                const result = { ok: burned, message: burned ? undefined : "Burned -> Creator didn't burn LP" };
                if (result.ok) {
                    this.cachedResult = result;
                }
                return result;
            }
            catch (e) {
                if (e.code == -32602) {
                    return { ok: true };
                }
                helpers_1.logger.error({ mint: poolKeys.baseMint }, `Failed to check if LP is burned`);
            }
            return { ok: false, message: "Failed to check if LP is burned" };
        });
    }
}
exports.BurnFilter = BurnFilter;
