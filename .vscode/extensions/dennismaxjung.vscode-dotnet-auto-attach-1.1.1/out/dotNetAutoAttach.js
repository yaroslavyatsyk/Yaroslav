"use strict";
/*
 * @file Contains the DotNetAutoAttach base class.
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-16 15:41:58
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2019-02-02 10:43:19
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const dotNetAutoAttachDebugConfigurationProvider_1 = require("./dotNetAutoAttachDebugConfigurationProvider");
const attach_service_1 = require("./services/attach-service");
const cache_service_1 = require("./services/cache-service");
const debugger_service_1 = require("./services/debugger-service");
const process_service_1 = require("./services/process-service");
const task_service_1 = require("./services/task-service");
const ui_service_1 = require("./services/ui-service");
/**
 * The DotNetAutoAttach base class, contains instances of all it's services.
 *
 * @export
 * @class DotNetAutoAttach
 * @implements {Disposable}
 */
class DotNetAutoAttach {
    /**
     * Start the DotNetAutoAttach.
     *
     * @static
     * @memberof DotNetAutoAttach
     */
    static Start() {
        // Register AutoAttachDebugConfigurationProvider
        this.disposables.add(vscode.debug.registerDebugConfigurationProvider("DotNetAutoAttach", new dotNetAutoAttachDebugConfigurationProvider_1.default()));
        this.AttachService.StartTimer();
    }
    /**
     * Stop the DotNetAutoAttach.
     *
     * @static
     * @memberof DotNetAutoAttach
     */
    static Stop() {
        this.AttachService.StopTimer();
        DotNetAutoAttach.disposables.forEach(d => {
            d.dispose();
        });
        DotNetAutoAttach.disposables.clear();
        DotNetAutoAttach.Cache.dispose();
        DotNetAutoAttach.DebugService.dispose();
        DotNetAutoAttach.UiService.dispose();
    }
    /**
     * Dispose.
     *
     * @memberof DotNetAutoAttach
     */
    dispose() {
        DotNetAutoAttach.Cache.dispose();
        DotNetAutoAttach.DebugService.dispose();
        DotNetAutoAttach.TaskService.dispose();
        DotNetAutoAttach.ProcessService.dispose();
        DotNetAutoAttach.AttachService.dispose();
        DotNetAutoAttach.UiService.dispose();
        DotNetAutoAttach.disposables.forEach(d => {
            d.dispose();
        });
        DotNetAutoAttach.disposables.clear();
    }
}
exports.default = DotNetAutoAttach;
/**
 * The CacheService. Provides access to the central cache.
 *
 * @static
 * @type {CacheService}
 * @memberof DotNetAutoAttach
 */
DotNetAutoAttach.Cache = new cache_service_1.default();
/**
 * The TaskService, provides functions to manage tasks.
 *
 * @static
 * @type {TaskService}
 * @memberof DotNetAutoAttach
 */
DotNetAutoAttach.TaskService = new task_service_1.default();
/**
 * The DebuggerService. Provide functionality for starting, and manageing debug sessions.
 *
 * @static
 * @type {DebuggerService}
 * @memberof DotNetAutoAttach
 */
DotNetAutoAttach.DebugService = new debugger_service_1.default();
/**
 * The ProcessService. Provides functionality to scan and parse processes running.
 *
 * @static
 * @type {ProcessService}
 * @memberof DotNetAutoAttach
 */
DotNetAutoAttach.ProcessService = new process_service_1.default();
/**
 * The AttachService.
 *
 * @static
 * @type {AttachService}
 * @memberof DotNetAutoAttach
 */
DotNetAutoAttach.AttachService = new attach_service_1.default();
/**
 * The UiService.
 *
 * @static
 * @type {UiService}
 * @memberof DotNetAutoAttach
 */
DotNetAutoAttach.UiService = new ui_service_1.default();
/**
 * A list of all disposables.
 *
 * @private
 * @static
 * @type {Set<Disposable>}
 * @memberof DotNetAutoAttach
 */
DotNetAutoAttach.disposables = new Set();
//# sourceMappingURL=dotNetAutoAttach.js.map