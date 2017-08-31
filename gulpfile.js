var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    notify  = require('gulp-notify'),
    util    = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    uglify  = require('gulp-uglify'),
    useref  = require('gulp-useref'),
    cssnano = require('gulp-cssnano'),
    gulpIf  = require('gulp-if'),
    runSequence  = require('run-sequence'),
    del     = require('del'),
    imgMin  = require('gulp-imagemin'),
    cache   = require('gulp-cache'),
    postcss = require('gulp-postcss'),
    source  = require('gulp-sourcemaps'),
    autoprefixer = require ('gulp-autoprefixer');

    // I changed the path of the functions to just listen to main.css, main.scss, and index.html since this is a landing page...

    /* All tasks:

    sass: compiles sass into css
    imagemin: minifies all images and sends them to dist folder
    fonts: moves all fonts into dist
    clean:dist: deletes dist folder
    cache:clear: clears the cache
    useref: moves all html, css, and js files into dist and minifies the last two
    browserSync: creates a local server and launches index page

    watch: calls build, browserSync
    & watches over any changes made in html, css, and js files
    build: calls imagemin, sass, fonts and useref
    drop: calls clean:dist, cache:clear
    default: calls watch

    */

gulp.task('sass', function() {
  return gulp.src('app/scss/main.scss')
         .pipe(customPlumber('Sass Error:'))
         .pipe(sass())
         .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
          }))
         .pipe(gulp.dest('app/css'));
});

gulp.task('css', function() {
  return gulp.src('app/css/main.css')
         .pipe(customPlumber('Autoprefixer Error:'))
         .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'));
});

// gulp.task('imagemin', function() {
//   return gulp.src('app/images/**/*.+(jpg|jpeg|png|gif|svg|tif)')
//          .pipe(customPlumber('Imagemin Error:'))
//          .pipe(cache(imgMin({
//            interlaced: true
//          })))
//          .pipe(gulp.dest('dist/images'));
// });

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
         .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('cache:clear', function() {
  return cache.clearAll();
});

gulp.task('useref', function() {
  return gulp.src('app/*.+(html|php)')
             .pipe(useref())
             .pipe(customPlumber('Uglify Error:'))
             .pipe(gulpIf('*.js', uglify()))
             .pipe(customPlumber('Cssnano Error:'))
             .pipe(gulpIf('*.css', cssnano()))
             .pipe(gulp.dest('dist'))
             .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    }
  });
});

function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      title: errTitle || "Error running Gulp",
      message: "Error:<%= error.message %>",
      sound: "Glass"

    })
  });
}

gulp.task('drop', function() {
  return runSequence(['cache:clear', 'clean:dist']);
});

gulp.task('default', function() {
  return runSequence('watch');
});

gulp.task('build', function() {
  // return runSequence(['imagemin', 'sass', 'fonts'], 'useref');
  return runSequence(['sass', 'fonts'], 'useref');
});

gulp.task('watch', function() {
  runSequence('build', 'browserSync');
  // gulp.watch('app/images/**/*.+(jpg|jpeg|png|gif|svg)', ['imagemin']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/scss/main.scss', ['sass']);
  gulp.watch('app/*.+(html|php)', ['useref']);
  gulp.watch('app/**/*.+(js|css)', ['useref']);
});
