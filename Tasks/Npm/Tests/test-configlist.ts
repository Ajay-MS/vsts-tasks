import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import util = require('./NpmMockHelper');

let taskPath = path.join(__dirname, '..', 'npmtask.js');
let taskMockRunner = new tmrm.TaskMockRunner(taskPath);
let npmMockHelper = new util.NpmMockHelper(taskMockRunner, "config", "list");
process.env['HOMEDRIVE'] = 'C:\\';
process.env['HOMEPATH'] = 'Users\\none';

if (process.argv.length == 3) {
    if (process.argv[2] === "useDeprecated") {
        npmMockHelper.useDeprecatedTask();
    }
} 

npmMockHelper.setDebugState(true);
npmMockHelper.mockAuthHelper();
npmMockHelper.mockNpmConfigList();

var execResult: ma.TaskLibAnswerExecResult = {
    code: 0,
    stdout: "; cli configs",
    stderr: ""
};

npmMockHelper.run(execResult);
