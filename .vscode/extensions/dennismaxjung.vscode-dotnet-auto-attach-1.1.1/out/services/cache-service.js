"use strict";
/*
 * @file Contains the CacheService, stores information central.
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-15 12:30:24
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2019-02-17 16:25:34
 */
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_collections_1 = require("typescript-collections");
/**
 * The CacheService. Provides access to the central cache.
 *
 * @export
 * @class CacheService
 */
class CacheService {
    /**
     * Creates an instance of CacheService.
     * @memberof CacheService
     */
    constructor() {
        this.RunningAutoAttachTasks = new typescript_collections_1.Dictionary();
        this.RunningDebugs = new typescript_collections_1.Dictionary();
        this.DisconnectedDebugs = new Set();
    }
    /**
     * Dispose the object.
     *
     * @memberof CacheService
     */
    dispose() {
        this.RunningAutoAttachTasks.forEach((k, v) => {
            v.Terminate();
        });
        this.RunningAutoAttachTasks.clear();
        this.RunningDebugs.clear();
        this.DisconnectedDebugs.clear();
    }
}
exports.default = CacheService;
//# sourceMappingURL=cache-service.js.map