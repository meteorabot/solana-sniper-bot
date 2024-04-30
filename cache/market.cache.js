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
exports.MarketCache = void 0;
const web3_js_1 = require("@solana/web3.js");
const helpers_1 = require("../helpers");
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
class MarketCache {
    constructor(connection) {
        this.connection = connection;
        this.keys = new Map();
    }
    init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            helpers_1.logger.debug({}, `Fetching all existing ${config.quoteToken.symbol} markets...`);
            const accounts = yield this.connection.getProgramAccounts(raydium_sdk_1.MAINNET_PROGRAM_ID.OPENBOOK_MARKET, {
                commitment: this.connection.commitment,
                dataSlice: {
                    offset: raydium_sdk_1.MARKET_STATE_LAYOUT_V3.offsetOf("eventQueue"),
                    length: helpers_1.MINIMAL_MARKET_STATE_LAYOUT_V3.span,
                },
                filters: [
                    { dataSize: raydium_sdk_1.MARKET_STATE_LAYOUT_V3.span },
                    {
                        memcmp: {
                            offset: raydium_sdk_1.MARKET_STATE_LAYOUT_V3.offsetOf("quoteMint"),
                            bytes: config.quoteToken.mint.toBase58(),
                        },
                    },
                ],
            });
            for (const account of accounts) {
                const market = helpers_1.MINIMAL_MARKET_STATE_LAYOUT_V3.decode(account.account.data);
                this.keys.set(account.pubkey.toString(), market);
            }
            helpers_1.logger.debug({}, `Cached ${this.keys.size} markets`);
        });
    }
    save(marketId, keys) {
        if (!this.keys.has(marketId)) {
            helpers_1.logger.trace({}, `Caching new market: ${marketId}`);
            this.keys.set(marketId, keys);
        }
    }
    get(marketId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keys.has(marketId)) {
                return this.keys.get(marketId);
            }
            helpers_1.logger.trace({}, `Fetching new market keys for ${marketId}`);
            const market = yield this.fetch(marketId);
            this.keys.set(marketId, market);
            return market;
        });
    }
    fetch(marketId) {
        return (0, helpers_1.getMinimalMarketV3)(this.connection, new web3_js_1.PublicKey(marketId), this.connection.commitment);
    }
}
exports.MarketCache = MarketCache;
