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
exports.DefaultTransactionExecutor = void 0;
const helpers_1 = require("../helpers");
class DefaultTransactionExecutor {
    constructor(connection) {
        this.connection = connection;
    }
    executeAndConfirm(transaction, payer, latestBlockhash) {
        return __awaiter(this, void 0, void 0, function* () {
            helpers_1.logger.debug("Executing transaction...");
            const signature = yield this.execute(transaction);
            helpers_1.logger.debug({ signature }, "Confirming transaction...");
            return this.confirm(signature, latestBlockhash);
        });
    }
    execute(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.sendRawTransaction(transaction.serialize(), {
                preflightCommitment: this.connection.commitment,
            });
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
exports.DefaultTransactionExecutor = DefaultTransactionExecutor;
