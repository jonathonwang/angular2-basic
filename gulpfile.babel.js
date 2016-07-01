/**
 * Gulp Dependencies
 */
import gulp       from 'gulp';
import tsify      from "tsify";
import watchify   from 'watchify';
import sass       from 'gulp-sass';
import gutil      from "gulp-util";
import browserify from 'browserify';
import shell      from 'gulp-shell';
import watch      from 'gulp-watch';
import concat     from 'gulp-concat';
import tslint     from 'gulp-tslint';
import uglify     from 'gulp-uglify';
import buffer     from 'vinyl-buffer';
import filesize   from 'gulp-filesize';
import sourcemaps from 'gulp-sourcemaps';
import ts         from 'gulp-typescript';
import source     from 'vinyl-source-stream';
// Gulp Config
import paths      from './gulp.config.json';

/**
 * Copy Task
 */
gulp.task('copy', () => {
  // Bootstrap
  gulp.src(paths.vendor.bootstrap)
    .pipe(gulp.dest(`${paths.src.sass}/vendor/bootstrap`))
    .on('error', gutil.log);
});

/**
 * Sass Task
 */
gulp.task('sass', () => {
  gulp.src(`${paths.src.sass}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .on('error', gutil.log);
});

/**
 * Browserify Task
 */
gulp.task('browserify', () => {
  browserify({
    debug: true,
    entries: [`${paths.src.ts}/main.ts`],
  })
  .plugin(tsify)
  .transform("babelify")
  .bundle()
  .pipe(source('./js/main.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist'))
  .on('error', gutil.log);
});

/**
 * Typescript Linter
 */
gulp.task('tslint', () => {
  gulp.src([
    `${paths.src.ts}/**/*.ts`
  ])
  .pipe(tslint())
  .pipe(tslint.report("verbose"))
});


/**
 * Default Task
 */
gulp.task('default', ['copy', 'sass', 'browserify'] );

/**
 * Watch Task
 */
gulp.task('watch', ['copy','sass','browserify'], () => {
  gulp.watch(`${paths.src.ts}/*.ts`, ['tslint','browserify']);
  gulp.watch(`${paths.src.sass}/*.scss`, ['sass']);
});
