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
exports.PoolFilters = void 0;
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const burn_filter_1 = require("./burn.filter");
const mutable_filter_1 = require("./mutable.filter");
const renounced_filter_1 = require("./renounced.filter");
const pool_size_filter_1 = require("./pool-size.filter");
const helpers_1 = require("../helpers");
class PoolFilters {
    constructor(connection, args) {
        this.connection = connection;
        this.args = args;
        this.filters = [];
        if (helpers_1.CHECK_IF_BURNED) {
            this.filters.push(new burn_filter_1.BurnFilter(connection));
        }
        if (helpers_1.CHECK_IF_MINT_IS_RENOUNCED || helpers_1.CHECK_IF_FREEZABLE) {
            this.filters.push(new renounced_filter_1.RenouncedFreezeFilter(connection, helpers_1.CHECK_IF_MINT_IS_RENOUNCED, helpers_1.CHECK_IF_FREEZABLE));
        }
        if (helpers_1.CHECK_IF_MUTABLE || helpers_1.CHECK_IF_SOCIALS) {
            this.filters.push(new mutable_filter_1.MutableFilter(connection, (0, mpl_token_metadata_1.getMetadataAccountDataSerializer)(), helpers_1.CHECK_IF_MUTABLE, helpers_1.CHECK_IF_SOCIALS));
        }
        if (!args.minPoolSize.isZero() || !args.maxPoolSize.isZero()) {
            this.filters.push(new pool_size_filter_1.PoolSizeFilter(connection, args.quoteToken, args.minPoolSize, args.maxPoolSize));
        }
    }
    execute(poolKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.filters.length === 0) {
                return true;
            }
            const result = yield Promise.all(this.filters.map((f) => f.execute(poolKeys)));
            const pass = result.every((r) => r.ok);
            if (pass) {
                return true;
            }
            for (const filterResult of result.filter((r) => !r.ok)) {
                helpers_1.logger.trace(filterResult.message);
            }
            return false;
        });
    }
}
exports.PoolFilters = PoolFilters;
