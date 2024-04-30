"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.JitoTransactionExecutor = void 0;
const web3_js_1 = require("@solana/web3.js");
const helpers_1 = require("../helpers");
const axios_1 = __importStar(require("axios"));
const bs58_1 = __importDefault(require("bs58"));
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
class JitoTransactionExecutor {
    constructor(jitoFee, connection) {
        this.jitoFee = jitoFee;
        this.connection = connection;
        // https://jito-labs.gitbook.io/mev/searcher-resources/json-rpc-api-reference/bundles/gettipaccounts
        this.jitpTipAccounts = [
            "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
            "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
            "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
            "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
            "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
            "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
            "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
            "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
        ];
        this.JitoFeeWallet = this.getRandomValidatorKey();
    }
    getRandomValidatorKey() {
        const randomValidator = this.jitpTipAccounts[Math.floor(Math.random() * this.jitpTipAccounts.length)];
        return new web3_js_1.PublicKey(randomValidator);
    }
    executeAndConfirm(transaction, payer, latestBlockhash) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            helpers_1.logger.debug("Starting Jito transaction execution...");
            this.JitoFeeWallet = this.getRandomValidatorKey(); // Update wallet key each execution
            helpers_1.logger.trace(`Selected Jito fee wallet: ${this.JitoFeeWallet.toBase58()}`);
            try {
                const fee = new raydium_sdk_1.CurrencyAmount(raydium_sdk_1.Currency.SOL, this.jitoFee, false).raw.toNumber();
                helpers_1.logger.trace(`Calculated fee: ${fee} lamports`);
                const jitTipTxFeeMessage = new web3_js_1.TransactionMessage({
                    payerKey: payer.publicKey,
                    recentBlockhash: latestBlockhash.blockhash,
                    instructions: [
                        web3_js_1.SystemProgram.transfer({
                            fromPubkey: payer.publicKey,
                            toPubkey: this.JitoFeeWallet,
                            lamports: fee,
                        }),
                    ],
                }).compileToV0Message();
                const jitoFeeTx = new web3_js_1.VersionedTransaction(jitTipTxFeeMessage);
                jitoFeeTx.sign([payer]);
                const jitoTxsignature = bs58_1.default.encode(jitoFeeTx.signatures[0]);
                // Serialize the transactions once here
                const serializedjitoFeeTx = bs58_1.default.encode(jitoFeeTx.serialize());
                const serializedTransaction = bs58_1.default.encode(transaction.serialize());
                const serializedTransactions = [serializedjitoFeeTx, serializedTransaction];
                // https://jito-labs.gitbook.io/mev/searcher-resources/json-rpc-api-reference/url
                const endpoints = [
                    "https://mainnet.block-engine.jito.wtf/api/v1/bundles",
                    "https://amsterdam.mainnet.block-engine.jito.wtf/api/v1/bundles",
                    "https://frankfurt.mainnet.block-engine.jito.wtf/api/v1/bundles",
                    "https://ny.mainnet.block-engine.jito.wtf/api/v1/bundles",
                    "https://tokyo.mainnet.block-engine.jito.wtf/api/v1/bundles",
                ];
                const requests = endpoints.map((url) => axios_1.default.post(url, {
                    jsonrpc: "2.0",
                    id: 1,
                    method: "sendBundle",
                    params: [serializedTransactions],
                }));
                helpers_1.logger.trace("Sending transactions to endpoints...");
                const results = yield Promise.all(requests.map((p) => p.catch((e) => e)));
                const successfulResults = results.filter((result) => !(result instanceof Error));
                if (successfulResults.length > 0) {
                    helpers_1.logger.trace(`At least one successful response`);
                    helpers_1.logger.debug(`Confirming jito transaction...`);
                    return yield this.confirm(jitoTxsignature, latestBlockhash);
                }
                else {
                    helpers_1.logger.debug(`No successful responses received for jito`);
                }
                return { confirmed: false };
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    helpers_1.logger.trace({ error: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data }, "Failed to execute jito transaction");
                }
                helpers_1.logger.error("Error during transaction execution", error);
                return { confirmed: false };
            }
        });
    }
    confirm(signature, latestBlockhash) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmation = yield this.connection.confirmTransaction({
                signature,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                blockhash: latestBlockhash.blockhash,
            }, this.connection.commitment);
            return { confirmed: !confirmation.value.err, signature };
        });
    }
}
exports.JitoTransactionExecutor = JitoTransactionExecutor;
