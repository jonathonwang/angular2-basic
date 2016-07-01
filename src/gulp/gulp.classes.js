/**
 * NPM Dependencies
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

import config     from './gulp.config.json';

/**
 * Copy Task
 * @param taskName : string
 * @param copyTasks: Array<Object> = { src: string, dest: string }
 */
export const Copy = (taskName, copyTasks) => {
  gulp.task(taskName, () => {
    for(let copyTask of copyTasks){
      gulp.src(copyTask.src)
        .pipe(gulp.dest(copyTask.dest))
        .on('error', gutil.log)
        .pipe( notify({
          title: config.name,
          subtitle: 'Gulp',
          message: `Finished ${taskName}`,
          icon: config.icon,
          sound: false,
          onLast: true
        }));
    }
  });
}

/**
 * Sass Task
 * @param taskName: string
 * @param src     : string
 * @param dest    : string
 */
export const Sass = (taskName, src, dest) => {
  gulp.task(taskName, () => {
    gulp.src(src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest))
    .on('error', gutil.log)
    .pipe( notify({
      title: config.name,
      subtitle: 'Gulp',
      message: `Finished ${taskName}`,
      icon: config.icon,
      sound: false,
      onLast: true
    }));
  });
}

/**
 * Browserify Task
 * @param taskName: string
 * @param src     : Array<string> | string
 * @param dest    : string
 * @param dist    : string
 */
export const Browserify = (taskName, src, dest, dist ) => {
  gulp.task(taskName, () => {
    browserify({
      debug: true,
      entries: src, // string or Array
    })
    .plugin(tsify)
    .transform("babelify")
    .bundle()
    .pipe(source(dest))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist))
    .on('error', gutil.log)
    .pipe( notify({
      title: config.name,
      subtitle: 'Gulp',
      message: `Finished ${taskName}`,
      icon: config.icon,
      sound: false,
      onLast: true
    }));
  });
}

/**
 * Typescript Linter
 * @param taskName : string
 * @param src      : string
 * @param configSrc: string
 */
export const Tslint = (taskName, src, configSrc) => {
  gulp.task(taskName, () => {
    gulp.src([
      src // string or Array
    ])
    .pipe(tslint({
      configuration: configSrc
    }))
    .pipe(tslint.report("verbose"))
    .pipe( notify({
      title: config.name,
      subtitle: 'Gulp',
      message: `Finished ${taskName}`,
      icon: config.icon,
      sound: false,
      onLast: true
    }));
  });
}

/**
 * Watch Task
 * @param tasksToRun  : Array<string>
 * @param tasksToWatch: Array<Object> = { path: string, tasks: Array<string> }
 */
export const Watch = (tasksToRun, tasksToWatch) => {
  gulp.task('watch', tasksToRun, () => {
    for(let task of tasksToWatch){
      gulp.watch(task.path, task.tasks);
    }
  });
}

/**
 * Default Task
 * @param taskNames: Array<string>
 */
export const Default = (taskNames) => {
  gulp.task('default', taskNames);
}


export default {
  Copy,
  Sass,
  Watch,
  Tslint,
  Default,
  Browserify
}
