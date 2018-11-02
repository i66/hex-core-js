var gulp = require('gulp');
var path = require('path');

var fs = require('fs');
var argv = require('yargs').argv;

var isDebug = argv.debug !== undefined;
var isWin = process.platform === 'win32';
var buildMode = isDebug ? 'Debug' : 'Release';

// Variables
// --------------------------------------------------------------
const APP_JS = 'app.js';
const PATH_UNIT_JS = './tests/unit/**/*.js';
const PATH_UNIT_MATCH = './tests/unit/**/*{0}*.js';

// Compile and Dev
// ---------------------------------------------
gulp.task('run', function(done) {
  var command = null;
  var argList = [APP_JS];
  if (isDebug) {
    argList.unshift('--inspect-brk');
    console.log('Debug: Open Chrome with Inspector');
    console.log('Then click the Node.JS Icon to open the DevTool');
  }
  execProcess('node', argList);
  done();
});

gulp.task('unit', function(done) {
  var command = null;
  var argList = [PATH_UNIT_JS];
  if (argv.m) {
    argList = [PATH_UNIT_MATCH.replace('{0}', argv.m)];
  }
  execProcess('mocha', argList);
  done();
});

// Internal Functions
// ---------------------------------------------
function execProcess(cmd, argList, directory) {
  if (!directory) {
    directory = '.';
  }
  var spawn = require('child_process').spawnSync;
  if (isWin) {
    argList.unshift('/c', cmd);
    return spawn('cmd.exe', argList, {
      stdio: 'inherit',
      cwd: directory
    });
  } else {
    return spawn(cmd, argList, {
      stdio: 'inherit',
      cwd: directory
    });
  }

}

gulp.task('default', function(done) {
  console.log('\n');

  console.log('\nTesting');
  console.log('-----------------------');
  console.log('Unit Test App  > gulp unit [-m pattern]');

  console.log('\n');
  done();
});
