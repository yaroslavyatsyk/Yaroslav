"use strict";
/*
 * @file Contains the ProcessDetail
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-15 19:42:32
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2018-06-15 19:42:32
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The ProcessDetail class. Represent detail infromation about a process
 *
 * @class ProcessDetail
 */
class ProcessDetail {
    /**
     * Creates an instance of ProcessDetail.
     * @param {(number | string)} pid The ProcessId.
     * @param {(number | string)} ppid The ParentProcessId.
     * @param {string} cml The CommandLine.
     * @memberof ProcessDetail
     */
    constructor(pid, ppid, cml) {
        if (typeof pid === "string") {
            this.pid = Number(pid);
        }
        else {
            this.pid = pid;
        }
        if (typeof ppid === "string") {
            this.ppid = Number(ppid);
        }
        else {
            this.ppid = ppid;
        }
        this.cml = cml;
    }
}
exports.default = ProcessDetail;
//# sourceMappingURL=ProcessDetail.js.map