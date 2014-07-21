// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function () {
    return gulp.src(['js/*.js', '!./js/debug/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('bower', function () {
    return bower()
      .pipe(gulp.dest('dist/'))
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src(['js/*.js', '!./js/debug/*.js'])
        //.pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('js/*.js', ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['bower', 'scripts', 'watch']);