"use strict";
/*
 * @file Contains the ProjectQuickPickItem
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-15 16:42:53
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2018-06-15 16:43:29
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The ProjectQuickPickItem. Represents Project that can be selected from
 * a list of projects.
 *
 * @export
 * @class ProjectQuickPickItem
 * @implements {QuickPickItem}
 */
class ProjectQuickPickItem {
    /**
     * Creates an instance of ProjectQuickPickItem.
     * @param {Uri} uri
     * @memberof ProjectQuickPickItem
     */
    constructor(uri) {
        /**
         * A human readable string which is rendered prominent.
         */
        this.label = "";
        const name_regex = /^.+(\/|\\)(.+).csproj/;
        let matches = name_regex.exec(uri.fsPath);
        if (matches && matches.length === 3) {
            this.label = matches[2];
        }
        this.detail = uri.fsPath;
        this.uri = uri;
    }
}
exports.default = ProjectQuickPickItem;
//# sourceMappingURL=ProjectQuickPickItem.js.map