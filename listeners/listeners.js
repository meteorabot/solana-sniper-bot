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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listeners = void 0;
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
const bs58_1 = __importDefault(require("bs58"));
const spl_token_1 = require("@solana/spl-token");
const events_1 = require("events");
class Listeners extends events_1.EventEmitter {
    constructor(connection) {
        super();
        this.connection = connection;
        this.subscriptions = [];
    }
    start(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config.cacheNewMarkets) {
                const openBookSubscription = yield this.subscribeToOpenBookMarkets(config);
                this.subscriptions.push(openBookSubscription);
            }
            const raydiumSubscription = yield this.subscribeToRaydiumPools(config);
            this.subscriptions.push(raydiumSubscription);
            if (config.autoSell) {
                const walletSubscription = yield this.subscribeToWalletChanges(config);
                this.subscriptions.push(walletSubscription);
            }
        });
    }
    subscribeToOpenBookMarkets(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.onProgramAccountChange(raydium_sdk_1.MAINNET_PROGRAM_ID.OPENBOOK_MARKET, (updatedAccountInfo) => __awaiter(this, void 0, void 0, function* () {
                this.emit("market", updatedAccountInfo);
            }), this.connection.commitment, [
                { dataSize: raydium_sdk_1.MARKET_STATE_LAYOUT_V3.span },
                {
                    memcmp: {
                        offset: raydium_sdk_1.MARKET_STATE_LAYOUT_V3.offsetOf("quoteMint"),
                        bytes: config.quoteToken.mint.toBase58(),
                    },
                },
            ]);
        });
    }
    subscribeToRaydiumPools(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.onProgramAccountChange(raydium_sdk_1.MAINNET_PROGRAM_ID.AmmV4, (updatedAccountInfo) => __awaiter(this, void 0, void 0, function* () {
                this.emit("pool", updatedAccountInfo);
            }), this.connection.commitment, [
                { dataSize: raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.span },
                {
                    memcmp: {
                        offset: raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.offsetOf("quoteMint"),
                        bytes: config.quoteToken.mint.toBase58(),
                    },
                },
                {
                    memcmp: {
                        offset: raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.offsetOf("marketProgramId"),
                        bytes: raydium_sdk_1.MAINNET_PROGRAM_ID.OPENBOOK_MARKET.toBase58(),
                    },
                },
                {
                    memcmp: {
                        offset: raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.offsetOf("status"),
                        bytes: bs58_1.default.encode([6, 0, 0, 0, 0, 0, 0, 0]),
                    },
                },
            ]);
        });
    }
    subscribeToWalletChanges(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.onProgramAccountChange(spl_token_1.TOKEN_PROGRAM_ID, (updatedAccountInfo) => __awaiter(this, void 0, void 0, function* () {
                this.emit("wallet", updatedAccountInfo);
            }), this.connection.commitment, [
                {
                    dataSize: 165,
                },
                {
                    memcmp: {
                        offset: 32,
                        bytes: config.walletPublicKey.toBase58(),
                    },
                },
            ]);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = this.subscriptions.length; i >= 0; --i) {
                const subscription = this.subscriptions[i];
                yield this.connection.removeAccountChangeListener(subscription);
                this.subscriptions.splice(i, 1);
            }
        });
    }
}
exports.Listeners = Listeners;
