"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnipeListCache = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../helpers");
class SnipeListCache {
    constructor() {
        this.snipeList = [];
        this.fileLocation = path_1.default.join(__dirname, "../snipe-list.txt");
        setInterval(() => this.loadSnipeList(), helpers_1.SNIPE_LIST_REFRESH_INTERVAL);
    }
    init() {
        this.loadSnipeList();
    }
    isInList(mint) {
        return this.snipeList.includes(mint);
    }
    loadSnipeList() {
        helpers_1.logger.trace(`Refreshing snipe list...`);
        const count = this.snipeList.length;
        const data = fs_1.default.readFileSync(this.fileLocation, "utf-8");
        this.snipeList = data
            .split("\n")
            .map((a) => a.trim())
            .filter((a) => a);
        if (this.snipeList.length != count) {
            helpers_1.logger.info(`Loaded snipe list: ${this.snipeList.length}`);
        }
    }
}
exports.SnipeListCache = SnipeListCache;
