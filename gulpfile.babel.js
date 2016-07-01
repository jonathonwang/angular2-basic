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
import notify     from 'gulp-notify';
import tslint     from 'gulp-tslint';
import uglify     from 'gulp-uglify';
import buffer     from 'vinyl-buffer';
import filesize   from 'gulp-filesize';
import sourcemaps from 'gulp-sourcemaps';
import ts         from 'gulp-typescript';
import source     from 'vinyl-source-stream';

// Gulp Config
import config      from './gulp.config.json';

/**
 * Copy Task
 */
gulp.task('copy', () => {
  // Bootstrap
  gulp.src(config.paths.vendor.bootstrap)
    .pipe(gulp.dest(`${config.paths.src.sass}/vendor/bootstrap`))
    .on('error', gutil.log)
    .pipe( notify({
      title: config.name,
      subtitle: 'Gulp',
      message: 'Finished Copy',
      icon: config.icon,
      sound: 'Frog',
      onLast: true
    }));
});

/**
 * Sass Task
 */
gulp.task('sass', () => {
  gulp.src(`${config.paths.src.sass}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .on('error', gutil.log)
    .pipe( notify({
      title: config.name,
      subtitle: 'Gulp',
      message: 'Finished Sass',
      icon: config.icon,
      sound: 'Frog',
      onLast: true
    }));
});

/**
 * Browserify Task
 */
gulp.task('browserify', () => {
  browserify({
    debug: true,
    entries: [`${config.paths.src.ts}/main.ts`],
  })
  .plugin(tsify)
  .transform("babelify")
  .bundle()
  .pipe(source('./js/main.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist'))
  .on('error', gutil.log)
  .pipe( notify({
    title: config.name,
    subtitle: 'Gulp',
    message: 'Finished Browserify',
    icon: config.icon, sound: 'Frog',
    onLast: true
  }));
});

/**
 * Typescript Linter
 */
gulp.task('tslint', () => {
  gulp.src([
    `${config.paths.src.ts}/**/*.ts`
  ])
  .pipe(tslint({
    configuration: './tslint.json'
  }))
  .pipe(tslint.report("verbose"))
  .pipe( notify({
    title: config.name,
    subtitle: 'Gulp',
    message: 'Finished TS-Lint',
    icon: config.icon,
    sound: 'Frog',
    onLast: true
  }));
});


/**
 * Default Task
 */
gulp.task('default', [
  'copy',
  'sass',
  'tslint',
  'browserify'
]);

/**
 * Watch Task
 */
gulp.task('watch', ['copy','sass','browserify'], () => {
  gulp.watch(`${config.paths.src.ts}/*.ts`, ['tslint','browserify']);
  gulp.watch(`${config.paths.src.sass}/*.scss`, ['sass']);
});
