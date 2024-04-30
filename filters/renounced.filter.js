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
exports.RenouncedFreezeFilter = void 0;
const spl_token_1 = require("@solana/spl-token");
const helpers_1 = require("../helpers");
class RenouncedFreezeFilter {
    constructor(connection, checkRenounced, checkFreezable) {
        this.connection = connection;
        this.checkRenounced = checkRenounced;
        this.checkFreezable = checkFreezable;
        this.errorMessage = [];
        this.cachedResult = undefined;
        if (this.checkRenounced) {
            this.errorMessage.push("mint");
        }
        if (this.checkFreezable) {
            this.errorMessage.push("freeze");
        }
    }
    execute(poolKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachedResult) {
                return this.cachedResult;
            }
            try {
                const accountInfo = yield this.connection.getAccountInfo(poolKeys.baseMint, this.connection.commitment);
                if (!(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.data)) {
                    return { ok: false, message: "RenouncedFreeze -> Failed to fetch account data" };
                }
                const deserialize = spl_token_1.MintLayout.decode(accountInfo.data);
                const renounced = !this.checkRenounced || deserialize.mintAuthorityOption === 0;
                const freezable = !this.checkFreezable || deserialize.freezeAuthorityOption !== 0;
                const ok = renounced && !freezable;
                const message = [];
                if (!renounced) {
                    message.push("mint");
                }
                if (freezable) {
                    message.push("freeze");
                }
                const result = {
                    ok: ok,
                    message: ok ? undefined : `RenouncedFreeze -> Creator can ${message.join(" and ")} tokens`,
                };
                if (result.ok) {
                    this.cachedResult = result;
                }
                return result;
            }
            catch (e) {
                helpers_1.logger.error({ mint: poolKeys.baseMint }, `RenouncedFreeze -> Failed to check if creator can ${this.errorMessage.join(" and ")} tokens`);
            }
            return {
                ok: false,
                message: `RenouncedFreeze -> Failed to check if creator can ${this.errorMessage.join(" and ")} tokens`,
            };
        });
    }
}
exports.RenouncedFreezeFilter = RenouncedFreezeFilter;
