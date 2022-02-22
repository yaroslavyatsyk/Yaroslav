"use strict";
/*
 * @file Contains the AttachService.
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-16 18:53:11
 * @Last Modified by: Dmitry Kosinov
 * @Last Modified time: 2019-02-06 16:27:08
 */
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const vscode = require("vscode");
const dotNetAutoAttach_1 = require("../dotNetAutoAttach");
/**
 * The AttachService
 *
 * @export
 * @class AttachService
 */
class AttachService {
    /**
     * Creates an instance of AttachService.
     * @memberof AttachService
     */
    constructor() {
        this.disposables = new Set();
        this.timer = undefined;
    }
    /**
     * Get the default DebugConfiguration
     *
     * @private
     * @static
     * @returns {DebugConfiguration}
     * @memberof AttachService
     */
    static GetDefaultConfig() {
        return {
            type: "coreclr",
            request: "attach",
            name: ".NET Core Attach - AUTO"
        };
    }
    /**
     * Start the timer to scan for attach.
     *
     * @memberof AttachService
     */
    StartTimer() {
        this.timer = timers_1.setInterval(this.ScanToAttach, AttachService.interval);
    }
    /**
     * Stop the timer to scan for attach.
     *
     * @memberof AttachService
     */
    StopTimer() {
        if (this.timer) {
            timers_1.clearInterval(this.timer);
        }
    }
    /**
     * Scan processes if its attachable, then try to attach debugger.
     *
     * @private
     * @memberof AttachService
     */
    ScanToAttach() {
        var processesToScan = new Array();
        var runningTasks = dotNetAutoAttach_1.default.Cache.RunningAutoAttachTasks;
        runningTasks.forEach((k, v) => {
            if (v && v.ProcessId) {
                processesToScan = processesToScan.concat(dotNetAutoAttach_1.default.ProcessService.GetProcesses(v.ProcessId.toString()));
            }
        });
        let matchedProcesses = new Array();
        processesToScan.forEach(p => {
            if ((p.cml.startsWith('"dotnet" exec ') ||
                p.cml.startsWith("dotnet exec ")) &&
                dotNetAutoAttach_1.default.AttachService.CheckForWorkspace(p)) {
                const pathRgx = /^\"?dotnet\"? exec \"?(.+)\"?/;
                let matches = pathRgx.exec(p.cml);
                let path = "";
                if (matches && matches.length === 2) {
                    path = matches[1];
                }
                matchedProcesses.push(p.pid);
                dotNetAutoAttach_1.default.DebugService.AttachDotNetDebugger(p.pid, AttachService.GetDefaultConfig(), path);
            }
        });
        dotNetAutoAttach_1.default.DebugService.DisconnectOldDotNetDebugger(matchedProcesses);
    }
    /**
     * Check the process if it's within the current workspace.
     *
     * @private
     * @static
     * @param {ProcessDetail} process
     * @returns {boolean}
     * @memberof AttachService
     */
    CheckForWorkspace(process) {
        if (vscode.workspace.workspaceFolders) {
            for (var element of vscode.workspace.workspaceFolders) {
                var path = vscode.Uri.file(process.cml
                    .replace("dotnet exec ", "")
                    .replace('"dotnet" exec ', "")
                    .replace('"', ""));
                if (path.fsPath.includes(element.uri.fsPath)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Dispose.
     *
     * @memberof AttachService
     */
    dispose() {
        this.disposables.forEach(k => {
            k.dispose();
        });
        this.StopTimer();
    }
}
exports.default = AttachService;
/**
 * The intervall between the poll.
 *
 * @private
 * @static
 * @type {number}
 * @memberof AttachService
 */
AttachService.interval = 1000;
//# sourceMappingURL=attach-service.js.map