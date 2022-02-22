"use strict";
/*
 * @file Contains the TaskService.
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-15 14:31:53
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2019-02-23 15:41:13
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const dotNetAutoAttach_1 = require("../dotNetAutoAttach");
const DotNetAutoAttachTask_1 = require("../models/DotNetAutoAttachTask");
/**
 * The TaskService, provides functions to manage tasks.
 *
 * @export
 * @class TaskService
 */
class TaskService {
    /**
     * Creates an instance of TaskService.
     * @memberof TaskService
     */
    constructor() {
        this.disposables = new Set();
        this.disposables.add(vscode_1.tasks.onDidEndTask(TaskService.TryToRemoveEndedTask));
        this.disposables.add(vscode_1.tasks.onDidStartTaskProcess(TaskService.IsWatcherStartedSetProcessId));
    }
    /**
     * Try's to remove the Task of the TaskEndEvent from cache.
     *
     * @private
     * @static
     * @param {TaskEndEvent} event
     * @memberof TaskService
     */
    static TryToRemoveEndedTask(event) {
        var taskId = DotNetAutoAttachTask_1.default.GetIdFromTask(event.execution.task);
        if (taskId && taskId !== "") {
            dotNetAutoAttach_1.default.Cache.RunningAutoAttachTasks.remove(taskId);
        }
    }
    /**
     * Check if the started process task is a watcher task, Sets it process id.
     *
     * @private
     * @static
     * @param {TaskProcessStartEvent} event
     * @memberof TaskService
     */
    static IsWatcherStartedSetProcessId(event) {
        let taskId = DotNetAutoAttachTask_1.default.GetIdFromTask(event.execution.task);
        if (dotNetAutoAttach_1.default.Cache.RunningAutoAttachTasks.containsKey(taskId)) {
            let task = dotNetAutoAttach_1.default.Cache.RunningAutoAttachTasks.getValue(taskId);
            task.ProcessId = event.processId;
            dotNetAutoAttach_1.default.Cache.RunningAutoAttachTasks.setValue(taskId, task);
        }
    }
    /**
     * Start a task.
     *
     * @private
     * @static
     * @param {Task} task
     * @memberof TaskService
     */
    static StartTask(task) {
        if (!dotNetAutoAttach_1.default.Cache.RunningAutoAttachTasks.containsKey(DotNetAutoAttachTask_1.default.GetIdFromTask(task))) {
            let tmp = vscode_1.tasks.executeTask(task);
            tmp.then((k) => {
                let autoTask = new DotNetAutoAttachTask_1.default(k);
                dotNetAutoAttach_1.default.Cache.RunningAutoAttachTasks.setValue(autoTask.Id, autoTask);
            });
        }
        else {
            dotNetAutoAttach_1.default.UiService.TaskAlreadyStartedInformationMessage(task.definition.type.replace("Watch ", ""));
        }
    }
    /**
     * Generates a Tak out of a AutoAttachDebugConfiguration and a project uri path.
     *
     * @private
     * @static
     * @param {DotNetAutoAttachDebugConfiguration} config
     * @param {string} [project=""]
     * @returns {Task}
     * @memberof TaskService
     */
    static GenerateTask(config, projectUri) {
        let projectName = "";
        const name_regex = /^.+(\/|\\)(.+).csproj/;
        let matches = name_regex.exec(projectUri.fsPath);
        if (matches && matches.length === 3) {
            projectName = matches[2];
        }
        let task = new vscode_1.Task({ type: "Watch " + projectName }, config.workspace, "Watch" + " " + projectName, "DotNet Auto Attach", new vscode_1.ProcessExecution("dotnet", ["watch", "--project", projectUri.fsPath, "run"].concat(config.args), { cwd: config.workspace.uri.fsPath, env: config.env }), "$mscompile");
        return task;
    }
    /**
     * Checks the files which where found.
     *
     * @private
     * @param {Array<Uri>} filesFound
     * @returns {(Uri | undefined)}
     * @memberof TaskService
     */
    CheckFilesFound(filesFound) {
        filesFound.sort((a, b) => a.toString().length - b.toString().length);
        if (filesFound.length === 0 || filesFound.length > 1) {
            return undefined;
        }
        else {
            return filesFound[0];
        }
    }
    /**
     * Checks the Project config.
     *
     * @private
     * @param {string} project
     * @returns {(Thenable<Uri | undefined>)}
     * @memberof TaskService
     */
    CheckProjectConfig(project) {
        let projectFile = vscode_1.Uri.parse(project);
        let isCsproj = project.endsWith(".csproj");
        // if it is a full path to a .csproj file
        if (projectFile.scheme === "file" && isCsproj) {
            return Promise.resolve(projectFile);
        }
        // if it is not a full path but only a name of a .csproj file
        else if (isCsproj) {
            return vscode_1.workspace.findFiles("**/" + project).then(this.CheckFilesFound);
        }
        // if it is not a full path but only a folder name.
        else {
            return vscode_1.workspace.findFiles(project + "/**/*.csproj").then(this.CheckFilesFound);
        }
    }
    /**
     * Start DotNetWatchTask when no project is configured.
     *
     * @private
     * @param {DotNetAutoAttachDebugConfiguration} config
     * @memberof TaskService
     */
    StartDotNetWatchTaskNoProjectConfig(config) {
        vscode_1.workspace.findFiles("**/*.csproj").then(k => {
            var tmp = k.filter(m => m.toString().startsWith(config.workspace.uri.toString()));
            if (tmp.length > 1) {
                dotNetAutoAttach_1.default.UiService.OpenProjectQuickPick(tmp)
                    .then(s => {
                    if (s) {
                        TaskService.StartTask(TaskService.GenerateTask(config, s.uri));
                    }
                });
            }
            else {
                TaskService.StartTask(TaskService.GenerateTask(config, tmp[0]));
            }
        });
    }
    /**
     * Start DotNetWatchTask when projcet is configured.
     *
     * @private
     * @param {DotNetAutoAttachDebugConfiguration} config
     * @memberof TaskService
     */
    StartDotNetWatchTaskWithProjectConfig(config) {
        this.CheckProjectConfig(config.project).then(projectUri => {
            if (projectUri) {
                TaskService.StartTask(TaskService.GenerateTask(config, projectUri));
            }
            // if no project not found or it isn't unique show error message.
            else {
                dotNetAutoAttach_1.default.UiService.ProjectDoesNotExistErrorMessage(config).then(open => {
                    if (open) {
                        vscode_1.workspace.findFiles("**/launch.json").then(files => {
                            if (files && files.length > 0) {
                                vscode_1.workspace.openTextDocument(files[0]).then(doc => vscode_1.window.showTextDocument(doc));
                            }
                        });
                    }
                });
            }
        });
    }
    /**
     * Start a new DotNet Watch Task
     *
     * @param {DotNetAutoAttachDebugConfiguration} config
     * @memberof TaskService
     */
    StartDotNetWatchTask(config) {
        // Check if there is a no project configured
        if (!config.project || 0 === config.project.length) {
            this.StartDotNetWatchTaskNoProjectConfig(config);
        }
        else {
            this.StartDotNetWatchTaskWithProjectConfig(config);
        }
    }
    /**
     * Dispose.
     *
     * @memberof TaskService
     */
    dispose() {
        this.disposables.forEach(k => {
            k.dispose();
        });
        this.disposables.clear();
    }
}
exports.default = TaskService;
//# sourceMappingURL=task-service.js.map