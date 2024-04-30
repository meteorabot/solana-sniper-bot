"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SNIPE_LIST_REFRESH_INTERVAL = exports.USE_SNIPE_LIST = exports.MAX_POOL_SIZE = exports.MIN_POOL_SIZE = exports.CHECK_IF_BURNED = exports.CHECK_IF_FREEZABLE = exports.CHECK_IF_MINT_IS_RENOUNCED = exports.CHECK_IF_SOCIALS = exports.CHECK_IF_MUTABLE = exports.CONSECUTIVE_FILTER_MATCHES = exports.FILTER_CHECK_DURATION = exports.FILTER_CHECK_INTERVAL = exports.SKIP_SELLING_IF_LOST_MORE_THAN = exports.SELL_SLIPPAGE = exports.PRICE_CHECK_DURATION = exports.PRICE_CHECK_INTERVAL = exports.TRAILING_STOP_LOSS = exports.STOP_LOSS = exports.TAKE_PROFIT = exports.MAX_SELL_RETRIES = exports.AUTO_SELL_DELAY = exports.AUTO_SELL = exports.BUY_SLIPPAGE = exports.MAX_BUY_RETRIES = exports.QUOTE_AMOUNT = exports.QUOTE_MINT = exports.AUTO_BUY_DELAY = exports.CUSTOM_FEE = exports.TRANSACTION_EXECUTOR = exports.CACHE_NEW_MARKETS = exports.PRE_LOAD_EXISTING_MARKETS = exports.COMPUTE_UNIT_PRICE = exports.COMPUTE_UNIT_LIMIT = exports.MAX_TOKENS_AT_THE_TIME = exports.LOG_LEVEL = exports.RPC_WEBSOCKET_ENDPOINT = exports.RPC_ENDPOINT = exports.COMMITMENT_LEVEL = exports.NETWORK = exports.PRIVATE_KEY = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./logger");
dotenv_1.default.config();
const retrieveEnvVariable = (variableName, logger) => {
    const variable = process.env[variableName] || "";
    if (!variable) {
        logger.error(`${variableName} is not set`);
        process.exit(1);
    }
    return variable;
};
// Wallet
exports.PRIVATE_KEY = retrieveEnvVariable("PRIVATE_KEY", logger_1.logger);
// Connection
exports.NETWORK = "mainnet-beta";
exports.COMMITMENT_LEVEL = retrieveEnvVariable("COMMITMENT_LEVEL", logger_1.logger);
exports.RPC_ENDPOINT = retrieveEnvVariable("RPC_ENDPOINT", logger_1.logger);
exports.RPC_WEBSOCKET_ENDPOINT = retrieveEnvVariable("RPC_WEBSOCKET_ENDPOINT", logger_1.logger);
// Bot
exports.LOG_LEVEL = retrieveEnvVariable("LOG_LEVEL", logger_1.logger);
exports.MAX_TOKENS_AT_THE_TIME = Number(retrieveEnvVariable("MAX_TOKENS_AT_THE_TIME", logger_1.logger));
exports.COMPUTE_UNIT_LIMIT = Number(retrieveEnvVariable("COMPUTE_UNIT_LIMIT", logger_1.logger));
exports.COMPUTE_UNIT_PRICE = Number(retrieveEnvVariable("COMPUTE_UNIT_PRICE", logger_1.logger));
exports.PRE_LOAD_EXISTING_MARKETS = retrieveEnvVariable("PRE_LOAD_EXISTING_MARKETS", logger_1.logger) === "true";
exports.CACHE_NEW_MARKETS = retrieveEnvVariable("CACHE_NEW_MARKETS", logger_1.logger) === "true";
exports.TRANSACTION_EXECUTOR = retrieveEnvVariable("TRANSACTION_EXECUTOR", logger_1.logger);
exports.CUSTOM_FEE = retrieveEnvVariable("CUSTOM_FEE", logger_1.logger);
// Buy
exports.AUTO_BUY_DELAY = Number(retrieveEnvVariable("AUTO_BUY_DELAY", logger_1.logger));
exports.QUOTE_MINT = retrieveEnvVariable("QUOTE_MINT", logger_1.logger);
exports.QUOTE_AMOUNT = retrieveEnvVariable("QUOTE_AMOUNT", logger_1.logger);
exports.MAX_BUY_RETRIES = Number(retrieveEnvVariable("MAX_BUY_RETRIES", logger_1.logger));
exports.BUY_SLIPPAGE = Number(retrieveEnvVariable("BUY_SLIPPAGE", logger_1.logger));
// Sell
exports.AUTO_SELL = retrieveEnvVariable("AUTO_SELL", logger_1.logger) === "true";
exports.AUTO_SELL_DELAY = Number(retrieveEnvVariable("AUTO_SELL_DELAY", logger_1.logger));
exports.MAX_SELL_RETRIES = Number(retrieveEnvVariable("MAX_SELL_RETRIES", logger_1.logger));
exports.TAKE_PROFIT = Number(retrieveEnvVariable("TAKE_PROFIT", logger_1.logger));
exports.STOP_LOSS = Number(retrieveEnvVariable("STOP_LOSS", logger_1.logger));
exports.TRAILING_STOP_LOSS = retrieveEnvVariable("TRAILING_STOP_LOSS", logger_1.logger) === "true";
exports.PRICE_CHECK_INTERVAL = Number(retrieveEnvVariable("PRICE_CHECK_INTERVAL", logger_1.logger));
exports.PRICE_CHECK_DURATION = Number(retrieveEnvVariable("PRICE_CHECK_DURATION", logger_1.logger));
exports.SELL_SLIPPAGE = Number(retrieveEnvVariable("SELL_SLIPPAGE", logger_1.logger));
exports.SKIP_SELLING_IF_LOST_MORE_THAN = Number(retrieveEnvVariable("SKIP_SELLING_IF_LOST_MORE_THAN", logger_1.logger));
// Filters
exports.FILTER_CHECK_INTERVAL = Number(retrieveEnvVariable("FILTER_CHECK_INTERVAL", logger_1.logger));
exports.FILTER_CHECK_DURATION = Number(retrieveEnvVariable("FILTER_CHECK_DURATION", logger_1.logger));
exports.CONSECUTIVE_FILTER_MATCHES = Number(retrieveEnvVariable("CONSECUTIVE_FILTER_MATCHES", logger_1.logger));
exports.CHECK_IF_MUTABLE = retrieveEnvVariable("CHECK_IF_MUTABLE", logger_1.logger) === "true";
exports.CHECK_IF_SOCIALS = retrieveEnvVariable("CHECK_IF_SOCIALS", logger_1.logger) === "true";
exports.CHECK_IF_MINT_IS_RENOUNCED = retrieveEnvVariable("CHECK_IF_MINT_IS_RENOUNCED", logger_1.logger) === "true";
exports.CHECK_IF_FREEZABLE = retrieveEnvVariable("CHECK_IF_FREEZABLE", logger_1.logger) === "true";
exports.CHECK_IF_BURNED = retrieveEnvVariable("CHECK_IF_BURNED", logger_1.logger) === "true";
exports.MIN_POOL_SIZE = retrieveEnvVariable("MIN_POOL_SIZE", logger_1.logger);
exports.MAX_POOL_SIZE = retrieveEnvVariable("MAX_POOL_SIZE", logger_1.logger);
exports.USE_SNIPE_LIST = retrieveEnvVariable("USE_SNIPE_LIST", logger_1.logger) === "true";
exports.SNIPE_LIST_REFRESH_INTERVAL = Number(retrieveEnvVariable("SNIPE_LIST_REFRESH_INTERVAL", logger_1.logger));
