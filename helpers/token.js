"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
function getToken(token) {
    switch (token) {
        case "WSOL": {
            return raydium_sdk_1.Token.WSOL;
        }
        case "USDC": {
            return new raydium_sdk_1.Token(spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), 6, "USDC", "USDC");
        }
        default: {
            throw new Error(`Unsupported quote mint "${token}". Supported values are USDC and WSOL`);
        }
    }
}
exports.getToken = getToken;
