"use strict";
/*
 * @file Contains the DotNetAutoAttachTask class.
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-15 14:34:31
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2019-01-26 12:18:51
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The DotNetAutoAttachTask, represents a running AutoAttachTask
 *
 * @export
 * @class DotNetAutoAttachTask
 */
class DotNetAutoAttachTask {
    /**
     * Creates an instance of DotNetAutoAttachTask.
     * @param {TaskExecution} taskExec
     * @memberof DotNetAutoAttachTask
     */
    constructor(taskExec) {
        /**
         * The ProjectPath
         *
         * @private
         * @type {string}
         * @memberof DotNetAutoAttachTask
         */
        this._projectPath = "";
        /**
         * The ProjectFolderPath
         *
         * @private
         * @type {string}
         * @memberof DotNetAutoAttachTask
         */
        this._projectFolderPath = "";
        /**
         * The Project
         *
         * @private
         * @type {string}
         * @memberof DotNetAutoAttachTask
         */
        this._project = "";
        this._id = DotNetAutoAttachTask.GetIdFromTask(taskExec.task);
        this._workSpace = taskExec.task.scope;
        this._taskExec = taskExec;
        this._processId = undefined;
        this._projectPath = this._taskExec.task
            .execution.args[2];
        const name_regex = /(^.+)(\\|\/)(.+.csproj)/;
        let matches = name_regex.exec(this._projectPath);
        if (matches && matches.length === 4) {
            this._project = matches[3];
            this._projectFolderPath = matches[1] + matches[2];
        }
    }
    /**
     * Get the Task ID.
     *
     * @readonly
     * @type {string}
     * @memberof DotNetAutoAttachTask
     */
    get Id() {
        return this._id;
    }
    /**
     * Get the Workspace.
     *
     * @readonly
     * @type {WorkspaceFolder}
     * @memberof DotNetAutoAttachTask
     */
    get Workspace() {
        return this._workSpace;
    }
    /**
     * Gets the ProjectPath.
     *
     * @readonly
     * @type {string}
     * @memberof DotNetAutoAttachTask
     */
    get ProjectPath() {
        return this._projectPath;
    }
    /**
     * Gets the ProjectFolderPath.
     *
     * @readonly
     * @type {string}
     * @memberof DotNetAutoAttachTask
     */
    get ProjectFolderPath() {
        return this._projectFolderPath;
    }
    /**
     * Gets the Project
     *
     * @readonly
     * @type {string}
     * @memberof DotNetAutoAttachTask
     */
    get Project() {
        return this._project;
    }
    /**
     * Gets the ProcessId.
     *
     * @type {(number | undefined)}
     * @memberof DotNetAutoAttachTask
     */
    get ProcessId() {
        return this._processId;
    }
    /**
     * Sets the ProcessId.
     *
     * @memberof DotNetAutoAttachTask
     */
    set ProcessId(num) {
        this._processId = num;
    }
    /**
     * Generates the TaskID from a task.
     *
     * @static
     * @param {Task} task
     * @returns {string}
     * @memberof DotNetAutoAttachTask
     */
    static GetIdFromTask(task) {
        if (task.scope) {
            if (task.scope.name) {
                return task.source + task.name + task.scope.name;
            }
        }
        return "";
    }
    /**
     * Terminates the execution.
     *
     * @memberof DotNetAutoAttachTask
     */
    Terminate() {
        this._taskExec.terminate();
    }
}
exports.default = DotNetAutoAttachTask;
//# sourceMappingURL=DotNetAutoAttachTask.js.map