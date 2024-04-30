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
exports.MutableFilter = void 0;
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
const helpers_1 = require("../helpers");
class MutableFilter {
    constructor(connection, metadataSerializer, checkMutable, checkSocials) {
        this.connection = connection;
        this.metadataSerializer = metadataSerializer;
        this.checkMutable = checkMutable;
        this.checkSocials = checkSocials;
        this.errorMessage = [];
        this.cachedResult = undefined;
        if (this.checkMutable) {
            this.errorMessage.push("mutable");
        }
        if (this.checkSocials) {
            this.errorMessage.push("socials");
        }
    }
    execute(poolKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachedResult) {
                return this.cachedResult;
            }
            try {
                const metadataPDA = (0, raydium_sdk_1.getPdaMetadataKey)(poolKeys.baseMint);
                const metadataAccount = yield this.connection.getAccountInfo(metadataPDA.publicKey, this.connection.commitment);
                if (!(metadataAccount === null || metadataAccount === void 0 ? void 0 : metadataAccount.data)) {
                    return { ok: false, message: "Mutable -> Failed to fetch account data" };
                }
                const deserialize = this.metadataSerializer.deserialize(metadataAccount.data);
                const mutable = !this.checkMutable || deserialize[0].isMutable;
                const hasSocials = !this.checkSocials || (yield this.hasSocials(deserialize[0]));
                const ok = !mutable && hasSocials;
                const message = [];
                if (mutable) {
                    message.push("metadata can be changed");
                }
                if (!hasSocials) {
                    message.push("has no socials");
                }
                const result = { ok: ok, message: ok ? undefined : `MutableSocials -> Token ${message.join(" and ")}` };
                if (!mutable) {
                    this.cachedResult = result;
                }
                return result;
            }
            catch (e) {
                helpers_1.logger.error({ mint: poolKeys.baseMint }, `MutableSocials -> Failed to check ${this.errorMessage.join(" and ")}`);
            }
            return {
                ok: false,
                message: `MutableSocials -> Failed to check ${this.errorMessage.join(" and ")}`,
            };
        });
    }
    hasSocials(metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(metadata.uri);
            const data = yield response.json();
            return Object.values((_a = data === null || data === void 0 ? void 0 : data.extensions) !== null && _a !== void 0 ? _a : {}).filter((value) => value).length > 0;
        });
    }
}
exports.MutableFilter = MutableFilter;
