"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWallet = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const bip39_1 = require("bip39");
const ed25519_hd_key_1 = require("ed25519-hd-key");
function getWallet(wallet) {
    // most likely someone pasted the private key in binary format
    if (wallet.startsWith("[")) {
        return web3_js_1.Keypair.fromSecretKey(JSON.parse(wallet));
    }
    // most likely someone pasted mnemonic
    if (wallet.split(" ").length > 1) {
        const seed = (0, bip39_1.mnemonicToSeedSync)(wallet, "");
        const path = `m/44'/501'/0'/0'`; // we assume it's first path
        return web3_js_1.Keypair.fromSeed((0, ed25519_hd_key_1.derivePath)(path, seed.toString("hex")).key);
    }
    // most likely someone pasted base58 encoded private key
    return web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(wallet));
}
exports.getWallet = getWallet;
