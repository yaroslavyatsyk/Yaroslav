/*
 * @file Contains the DebuggerService.
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-13 20:33:10
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2019-02-23 16:09:44
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
const dotNetAutoAttach_1 = require("../dotNetAutoAttach");
const DebugDisconnectedEnum_1 = require("../enums/DebugDisconnectedEnum");
/**
 * The DebuggerService. Provide functionality for starting, and manageing debug sessions.
 *
 * @export
 * @class DebuggerService
 */
class DebuggerService {
    /**
     * Creates an instance of DebuggerService.
     * @memberof DebuggerService
     */
    constructor() {
        this.disposables = new Set();
        this.disposables.add(vscode_1.debug.onDidTerminateDebugSession(DebuggerService.TryToRemoveDisconnectedDebugSession));
        this.disposables.add(vscode_1.debug.onDidStartDebugSession(DebuggerService.AddDebugSession));
    }
    /**
     * Adds real active debug session in cache when it starts
     *
     * @private
     * @static
     * @param {vscode.DebugSession} session
     * @memberof DebuggerService
     */
    static AddDebugSession(session) {
        dotNetAutoAttach_1.default.Cache.RunningDebugs.forEach((k, v) => {
            if (v.name === session.name) {
                dotNetAutoAttach_1.default.Cache.RunningDebugs.setValue(k, session);
            }
        });
    }
    /**
     * Try's to remove deconnected debugging sessions.
     *
     * @private
     * @static
     * @param {vscode.DebugSession} session
     * @memberof DebuggerService
     */
    static TryToRemoveDisconnectedDebugSession(session) {
        dotNetAutoAttach_1.default.Cache.RunningDebugs.forEach((k, v) => {
            if (v.name === session.name) {
                setTimeout(() => {
                    dotNetAutoAttach_1.default.Cache.RunningDebugs.remove(k);
                    dotNetAutoAttach_1.default.Cache.DisconnectedDebugs.add(k);
                }, 2000);
            }
        });
    }
    /**
     * Disconnects the running debug session with the given id.
     *
     * @private
     * @param {number} debugSessionId
     * @memberof DebuggerService
     */
    DisconnectDebugger(debugSessionId) {
        // Disconnect old debug
        let debugSession = dotNetAutoAttach_1.default.Cache.RunningDebugs.getValue(debugSessionId);
        if (debugSession) {
            debugSession.customRequest("disconnect");
        }
    }
    /**
     * Search for old debug session without runned processes.
     * It happens when debugger stops on breakpoint and code changes with watch restart
     *
     * @param {Array<number>} matchedPids
     * @memberof DebuggerService
     */
    DisconnectOldDotNetDebugger(matchedPids) {
        // If matched processes does not have running debugs then we need to kill this debug
        dotNetAutoAttach_1.default.Cache.RunningDebugs.keys()
            .forEach(runningDebug => {
            if (matchedPids.indexOf(runningDebug) < 0) {
                this.DisconnectDebugger(runningDebug);
            }
        });
    }
    /**
     * Attaches the dotnet debugger to a specific process.
     *
     * @param {number} pid
     * @param {vscode.DebugConfiguration} baseConfig
     * @memberof DebuggerService
     */
    AttachDotNetDebugger(pid, baseConfig, path) {
        let task = dotNetAutoAttach_1.default.Cache.RunningAutoAttachTasks.values().find(t => path.startsWith(t.ProjectFolderPath));
        if (!dotNetAutoAttach_1.default.Cache.RunningDebugs.containsKey(pid) &&
            !dotNetAutoAttach_1.default.Cache.DisconnectedDebugs.has(pid) &&
            task) {
            baseConfig.processId = String(pid);
            baseConfig.name = task.Project + " - " + baseConfig.name + " - " + baseConfig.processId;
            dotNetAutoAttach_1.default.Cache.RunningDebugs.setValue(pid, { name: baseConfig.name });
            vscode.debug.startDebugging(undefined, baseConfig);
        }
        else if (dotNetAutoAttach_1.default.Cache.DisconnectedDebugs.has(pid) && task) {
            dotNetAutoAttach_1.default.Cache.RunningDebugs.setValue(pid, { name: "" });
            dotNetAutoAttach_1.default.Cache.DisconnectedDebugs.delete(pid);
            dotNetAutoAttach_1.default.UiService.DebugDisconnectedInformationMessage(task.Project, pid).then(k => {
                if (k) {
                    if (k === DebugDisconnectedEnum_1.DebugDisconnectedEnum.Yes) {
                        baseConfig.processId = String(pid);
                        if (task) {
                            baseConfig.name = task.Project + " - " + baseConfig.name + " - " + baseConfig.processId;
                        }
                        else {
                            baseConfig.name += " - " + baseConfig.processId;
                        }
                        dotNetAutoAttach_1.default.Cache.RunningDebugs.setValue(pid, { name: baseConfig.name });
                        vscode.debug.startDebugging(undefined, baseConfig);
                    }
                    else if (k === DebugDisconnectedEnum_1.DebugDisconnectedEnum.Stop && task) {
                        task.Terminate();
                        setTimeout(() => {
                            dotNetAutoAttach_1.default.Cache.DisconnectedDebugs.delete(pid);
                            dotNetAutoAttach_1.default.Cache.RunningDebugs.remove(pid);
                        }, 2000);
                    }
                }
                else {
                    setTimeout(() => {
                        dotNetAutoAttach_1.default.Cache.RunningDebugs.remove(pid);
                        dotNetAutoAttach_1.default.Cache.DisconnectedDebugs.add(pid);
                    }, 60000);
                }
            });
        }
    }
    /**
     * Dispose
     *
     * @memberof DebuggerService
     */
    dispose() {
        this.disposables.forEach(k => {
            k.dispose();
        });
        this.disposables.clear();
    }
}
exports.default = DebuggerService;
//# sourceMappingURL=debugger-service.js.map