// Gulp Config
import config      from './gulp/gulp.config.json';
// Gulp Classes
import gulp   from './gulp/gulpclass.js';

gulp.Copy('copy', [
  { src: config.paths.vendor.bootstrap, dest: `${config.paths.src.sass}/vendor/bootstrap` }
]);

gulp.Sass('sass', `${config.paths.src.sass}/**/*.scss`, './dist/css');

gulp.Browserify('browserify', `${config.paths.src.ts}/main.ts`, './js/main.js', './dist');

gulp.Tslint('tslint', `${config.paths.src.ts}/**/*.ts`, './tslint.json');

gulp.Default(['copy', 'sass', 'tslint', 'browserify']);

gulp.Watch(['copy','sass','browserify'],
  [
    { path: `${config.paths.src.ts}/*.ts`, tasks: ['tslint','browserify'] },
    { path: `${config.paths.src.sass}/*.scss`, tasks: ['sass'] }
  ]
);
