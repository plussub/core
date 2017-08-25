/**
 * Created by sonste on 03.10.2015.
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var babel = require('babel-core/register');
var bower = require('gulp-bower');
var runSequence = require('run-sequence');
var del = require('del');


gulp.task('build', function(callback) {
    runSequence(
        'bower',
        'mocha_unit',
        'mocha_integration',
        callback);
});

gulp.task('bower',function(){
    return bower({cmd: 'update'})
});

gulp.task('mocha_unit', function() {
    return gulp.src(['**/test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});


gulp.task('mocha_integration', function() {
    return gulp.src(['**/integration_test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});