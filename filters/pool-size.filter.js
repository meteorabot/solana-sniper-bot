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
exports.PoolSizeFilter = void 0;
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
const helpers_1 = require("../helpers");
class PoolSizeFilter {
    constructor(connection, quoteToken, minPoolSize, maxPoolSize) {
        this.connection = connection;
        this.quoteToken = quoteToken;
        this.minPoolSize = minPoolSize;
        this.maxPoolSize = maxPoolSize;
    }
    execute(poolKeys) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.connection.getTokenAccountBalance(poolKeys.quoteVault, this.connection.commitment);
                const poolSize = new raydium_sdk_1.TokenAmount(this.quoteToken, response.value.amount, true);
                let inRange = true;
                if (!((_a = this.maxPoolSize) === null || _a === void 0 ? void 0 : _a.isZero())) {
                    inRange = poolSize.raw.lte(this.maxPoolSize.raw);
                    if (!inRange) {
                        return { ok: false, message: `PoolSize -> Pool size ${poolSize.toFixed()} > ${this.maxPoolSize.toFixed()}` };
                    }
                }
                if (!((_b = this.minPoolSize) === null || _b === void 0 ? void 0 : _b.isZero())) {
                    inRange = poolSize.raw.gte(this.minPoolSize.raw);
                    if (!inRange) {
                        return { ok: false, message: `PoolSize -> Pool size ${poolSize.toFixed()} < ${this.minPoolSize.toFixed()}` };
                    }
                }
                return { ok: inRange };
            }
            catch (error) {
                helpers_1.logger.error({ mint: poolKeys.baseMint }, `Failed to check pool size`);
            }
            return { ok: false, message: "PoolSize -> Failed to check pool size" };
        });
    }
}
exports.PoolSizeFilter = PoolSizeFilter;
