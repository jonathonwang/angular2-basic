/**
 * Dependency Imports
 */
import gulp   from './src/gulp/gulp.classes.js';
import config from './src/gulp/gulp.config.json';

// Copy Folders / Files
gulp.Copy('copy', [
  { src: config.paths.vendor.bootstrap, dest: `${config.paths.src.sass}/vendor/bootstrap` },
  { src: config.paths.vendor.zone, dest: config.paths.dist.js }
]);

// Compile Sass
gulp.Sass('sass', `${config.paths.src.sass}/**/*.scss`, './dist/css');

// Complile Typescript
gulp.Browserify('browserify', `${config.paths.src.ts}/main.ts`, './js/main.js', './dist');

// Lint Typescript
gulp.Tslint('tslint', `${config.paths.src.ts}/**/*.ts`, './tslint.json');

// Default Task
gulp.Default(['copy', 'sass', 'tslint', 'browserify']);

// Watch Task
gulp.Watch(['copy','sass','browserify'],
  [
    { path: `${config.paths.src.ts}/*.ts`, tasks: ['tslint','browserify'] },
    { path: `${config.paths.src.sass}/*.scss`, tasks: ['sass'] }
  ]
);
