"use strict";
/*
 * @file Contains the UiService.
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2019-02-02 10:33:23
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2019-02-23 14:54:41
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const DebugDisconnectedEnum_1 = require("../enums/DebugDisconnectedEnum");
const ProjectQuickPickItem_1 = require("../models/ProjectQuickPickItem");
/**
 * The UiService, proviedes functions for ui actions.
 *
 * @export
 * @class UiService
 */
class UiService {
    /**
     * Opens a Project Quick Pick.
     *
     * @private
     * @param {Uri[]} uris
     * @returns {(Thenable<ProjectQuickPickItem | undefined>)}
     * @memberof TaskService
     */
    OpenProjectQuickPick(uris) {
        let quickPickOptions = {
            canPickMany: false,
            placeHolder: "Select the project to launch the DotNet Watch task for.",
            matchOnDescription: true,
            matchOnDetail: true
        };
        return vscode_1.window
            .showQuickPick(uris.map(k => new ProjectQuickPickItem_1.default(k)), quickPickOptions);
    }
    /**
     * Opens a MultiSelectProject QuickPick.
     *
     * @param {Array<Uri>} uris
     * @returns {(Thenable<Array<ProjectQuickPickItem>| undefined>)}
     * @memberof UiService
     */
    OpenMultiSelectProjectQuickPick(uris) {
        return vscode_1.window.showQuickPick(uris.map(k => new ProjectQuickPickItem_1.default(k)), {
            canPickMany: true,
            placeHolder: "Select the projects you want to add to launch.json.",
            matchOnDescription: true,
            matchOnDetail: true
        });
    }
    /**
     * Opens a Debug Disconnected Information Message.
     *
     * @param {string} projectName
     * @param {number} processId
     * @returns {(Thenable<string | undefined>)}
     * @memberof UiService
     */
    DebugDisconnectedInformationMessage(projectName, processId) {
        return vscode_1.window
            .showInformationMessage(`Debug disconnected. Reattach to ${projectName} (${processId}) ?`, "Yes", "No", "Stop watch task").then(ret => {
            switch (ret) {
                case "Yes":
                    return DebugDisconnectedEnum_1.DebugDisconnectedEnum.Yes;
                    break;
                case "Stop watch task":
                    return DebugDisconnectedEnum_1.DebugDisconnectedEnum.Stop;
                    break;
                default:
                    return DebugDisconnectedEnum_1.DebugDisconnectedEnum.No;
                    break;
            }
        });
    }
    /**
     * Opens a Task already started Information Message.
     *
     * @param {string} projectName
     * @returns {(Thenable<string | undefined>)}
     * @memberof UiService
     */
    TaskAlreadyStartedInformationMessage(projectName) {
        return vscode_1.window.showInformationMessage(`.NET Watch Task already started for the project  ${projectName}.`);
    }
    /**
     * Opens a ProjectDoesNotExist Error Message.
     *
     * @param {string} project
     * @returns {(Thenable<string | undefined>)}
     * @memberof UiService
     */
    ProjectDoesNotExistErrorMessage(debugConfig) {
        return vscode_1.window.showErrorMessage(`The debug configuration '${debugConfig.name}' within the launch.json references a project that cannot be found or is not unique (${debugConfig.project}).`, "Open launch.json").then(value => {
            if (value && value === "Open launch.json") {
                return true;
            }
            else {
                return false;
            }
        });
    }
    /**
     * Dispose.
     *
     * @memberof UiService
     */
    dispose() {
    }
}
exports.default = UiService;
//# sourceMappingURL=ui-service.js.map