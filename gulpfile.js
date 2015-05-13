var 
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  cached = require('gulp-cached'),
  autoprefixer = require('gulp-autoprefixer'),
  minify = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  rename = require('gulp-rename'),
  webpack = require('gulp-webpack'),
  webpackServer = require('./webpack-server');

var cssPath = "lib/css/**/*.scss";
var cssOutPath = "public/assets/css";
var jsPath = "lib/entry.js";
var jsOutName = "dataloader.min.js";
var jsOutPath = "dist";
var jsPublicPath = "public/assets/js";

gulp.task('webpack-hot', webpackServer); 

gulp.task('browsersync', function() {
  browserSync.init({
    proxy: '0.0.0.0:8081',
    port: 8083
  });
  gulp.watch(cssPath, ['browsersync-build']);
  gulp.watch('public/**/*.html', reload);
});

gulp.task('browsersync-build', function() {
  return gulp.src(cssPath)
            .pipe(sass({errLogToConsole: true }))
            .pipe(cached('styles'))
            .pipe(autoprefixer({ browsers: ['last 2 versions']}))
            .pipe(gulp.dest(cssOutPath))
            .pipe(reload({stream: true}));
});

gulp.task('build_styles', function() {
  return gulp.src(cssPath)
            .pipe(sass({errLogToConsole: true }))
            .pipe(autoprefixer({ browsers: ['last 2 versions']}))
            .pipe(minify({compatibility: 'ie9'}))
            .pipe(gulp.dest(cssOutPath));
});

gulp.task('build_js', function() {
  return gulp.src(jsPath)
          .pipe(webpack(require('./webpack.config.js')))
          .pipe(rename(jsOutName))
          .pipe(gulp.dest(jsOutPath))
          .pipe(gulp.dest(jsPublicPath));
});

gulp.task('dev', ['browsersync', 'webpack-hot']); 

gulp.task('default', ['build_js', 'build_styles']);
