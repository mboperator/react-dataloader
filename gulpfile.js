var
  gulp = require('gulp'),
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

gulp.task('build_js', function() {
  return gulp.src(jsPath)
          .pipe(webpack(require('./webpack.config.js')))
          .pipe(rename(jsOutName))
          .pipe(gulp.dest(jsOutPath))
          .pipe(gulp.dest(jsPublicPath));
});

gulp.task('watch', ['build_js'], function() {
  gulp.watch('./lib/**/*.js', ['build_js']);
});

gulp.task('dev', ['browsersync', 'webpack-hot']);

gulp.task('default', ['build_js']);
