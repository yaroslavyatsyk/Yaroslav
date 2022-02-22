"use strict";
/*
 * @file Contains the ProcessService.
 * @Author: Dennis Jung
 * @Author: Konrad Müller
 * @Date: 2018-06-13 20:34:03
 * @Last Modified by: Dennis Jung
 * @Last Modified time: 2018-06-16 15:09:08
 */
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const ProcessDetail_1 = require("../models/ProcessDetail");
/**
 * The ProcessService. Provides functionality to scan and parse processes running.
 *
 * @export
 * @class ProcessService
 */
class ProcessService {
    /**
     * Dispose
     *
     * @memberof ProcessService
     */
    dispose() { }
    /**
     * Gets all Processes, with ppid filter if set.
     *
     * @param {string} [ppid=""]
     * @returns {Array<ProcessDetail>}
     * @memberof ProcessService
     */
    GetProcesses(ppid = "") {
        if (process.platform === "win32") {
            return this.getProcessDetailsFromWindows(ppid);
        }
        else { // unix
            return this.getProcessDetailsFromUnix(ppid);
        }
    }
    /**
     * Get all ProcessDetails on unix, with ppid filter if set.
     *
     * @private
     * @param {string} [ppid=""]
     * @returns {Array<ProcessDetail>}
     * @memberof ProcessService
     */
    getProcessDetailsFromUnix(ppid = "") {
        const cmlPattern = /^([0-9]+)\s+([0-9]+)\s(.+$)/;
        // build and execute command line tool "ps" to get details of all running processes
        let args = ["-o pid, ppid, command"];
        var tmp = child_process.execFileSync("ps", args, {
            encoding: "utf8"
        });
        // split process informations results for each process
        var processLines = tmp
            .split("\n")
            .map(str => {
            return str.trim();
        })
            .filter(str => cmlPattern.test(str));
        // parse output to a ProcessDetail list
        var processDetails = new Array();
        processLines.forEach(str => {
            let s = cmlPattern.exec(str);
            if (s && s.length === 4 && // validate regex result
                (ppid === "" || s[2] === ppid)) { // apply parent process filter
                processDetails.push(new ProcessDetail_1.default(s[1], s[2], s[3]));
            }
        });
        //Find nested child processes
        if (processDetails.length !== 0 && ppid !== "") {
            let childs = new Array();
            processDetails.forEach(k => {
                let tmp = this.getProcessDetailsFromUnix(k.pid.toString());
                tmp.forEach(l => childs.push(l));
            });
            return processDetails.concat(childs);
        }
        return processDetails;
    }
    /**
     * Get all ProcessDetails on windows, with ppid filter if set.
     *
     * @private
     * @param {string} [ppid=""]
     * @returns {Array<ProcessDetail>}
     * @memberof ProcessService
     */
    getProcessDetailsFromWindows(ppid = "") {
        const cmlPattern = /^(.+)\s+([0-9]+)\s+([0-9]+)$/;
        let args = ["process", "get", "ProcessId,ParentProcessId,CommandLine"];
        if (ppid !== "") {
            args = [
                "process",
                "where",
                `parentProcessId=${ppid}`,
                "get",
                "ProcessId,ParentProcessId,CommandLine"
            ];
        }
        var tmp = child_process.execFileSync("wmic.exe", args, {
            encoding: "utf8"
        });
        var processLines = tmp
            .split("\r\n")
            .map(str => {
            return str.trim();
        })
            .filter(str => cmlPattern.test(str));
        var processDetails = new Array();
        processLines.forEach(str => {
            let s = cmlPattern.exec(str);
            if (s && s.length === 4) {
                processDetails.push(new ProcessDetail_1.default(s[3], s[2], s[1]));
            }
        });
        if (processDetails.length !== 0 && ppid !== "") {
            let childs = new Array();
            processDetails.forEach(k => {
                let tmp = this.getProcessDetailsFromWindows(k.pid.toString());
                tmp.forEach(l => childs.push(l));
            });
            return processDetails.concat(childs);
        }
        return processDetails;
    }
}
exports.default = ProcessService;
//# sourceMappingURL=process-service.js.map