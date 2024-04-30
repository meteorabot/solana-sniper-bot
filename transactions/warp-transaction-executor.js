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
exports.WarpTransactionExecutor = void 0;
const web3_js_1 = require("@solana/web3.js");
const helpers_1 = require("../helpers");
const axios_1 = __importStar(require("axios"));
const bs58_1 = __importDefault(require("bs58"));
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
class WarpTransactionExecutor {
    constructor(warpFee) {
        this.warpFee = warpFee;
        this.warpFeeWallet = new web3_js_1.PublicKey("WARPzUMPnycu9eeCZ95rcAUxorqpBqHndfV3ZP5FSyS");
    }
    executeAndConfirm(transaction, payer, latestBlockhash) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            helpers_1.logger.debug("Executing transaction...");
            try {
                const fee = new raydium_sdk_1.CurrencyAmount(raydium_sdk_1.Currency.SOL, this.warpFee, false).raw.toNumber();
                const warpFeeMessage = new web3_js_1.TransactionMessage({
                    payerKey: payer.publicKey,
                    recentBlockhash: latestBlockhash.blockhash,
                    instructions: [
                        web3_js_1.SystemProgram.transfer({
                            fromPubkey: payer.publicKey,
                            toPubkey: this.warpFeeWallet,
                            lamports: fee,
                        }),
                    ],
                }).compileToV0Message();
                const warpFeeTx = new web3_js_1.VersionedTransaction(warpFeeMessage);
                warpFeeTx.sign([payer]);
                const response = yield axios_1.default.post("https://tx.warp.id/transaction/execute", {
                    transactions: [bs58_1.default.encode(warpFeeTx.serialize()), bs58_1.default.encode(transaction.serialize())],
                    latestBlockhash,
                }, {
                    timeout: 100000,
                });
                return response.data;
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError) {
                    helpers_1.logger.trace({ error: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data }, "Failed to execute warp transaction");
                }
            }
            return { confirmed: false };
        });
    }
}
exports.WarpTransactionExecutor = WarpTransactionExecutor;
