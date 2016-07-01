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
 */
export const Sass = (taskName, sourcePath, destPath) => {
  gulp.task(taskName, () => {
    gulp.src(sourcePath)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(destPath))
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
 */
export const Browserify = (taskName, sourceEntries, outputPath, distPath ) => {
  gulp.task(taskName, () => {
    browserify({
      debug: true,
      entries: sourceEntries, // string or Array
    })
    .plugin(tsify)
    .transform("babelify")
    .bundle()
    .pipe(source(outputPath))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(distPath))
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
 */
export const Tslint = (taskName, sourcePath, lintConfigPath) => {
  gulp.task(taskName, () => {
    gulp.src([
      sourcePath // string or Array
    ])
    .pipe(tslint({
      configuration: lintConfigPath
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
