/*
 * @file Contains the vscode extension.
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-13 20:32:01
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2018-09-03 11:45:37
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotNetAutoAttach_1 = require("./dotNetAutoAttach");
/**
 * This method is called when your extension is activated.
 * Your extension is activated the very first time the command is executed.
 *
 * @export
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    dotNetAutoAttach_1.default.Start();
}
exports.activate = activate;
/**
 * This method is called when your extension is deactivated.
 *
 * @export
 */
function deactivate() {
    dotNetAutoAttach_1.default.Stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map