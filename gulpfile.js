// Gulp
import gulp from "gulp";

// html
import pug from "gulp-pug";
import htmlmin from "gulp-htmlmin";

// css
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

import autoprefixer from "gulp-autoprefixer";

// Utilities
import sourcemap from "gulp-sourcemaps";
import plummer from "gulp-plumber";
import rename from "gulp-rename";
import inject from "gulp-inject-string";
import imagemin from "gulp-imagemin";
import { deleteSync } from "del";

// BrowserSync
import { create as bsCreate } from "browser-sync";
const browserSync = bsCreate();

// spawn
import spawn from "child_process"

const paths = {
  style: {
    src: "./src/style/main.scss",
    dest: "./dist/style/",
  },
  html: {
    src: "./src/*.pug",
    dest: "./dist/",
  },
  image: {
    src: "./src/img/**/*",
    dest: "./dist/img/",
  },
  font: {
    src: "./src/style/font/**/*",
    dest: "./dist/style/font/",
  },
};

// deplyment server
function browseSyncDep() {
  browserSync.init({
    server: {
      baseDir: paths.html.dest,
    },
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function clean(done) {
  deleteSync("./dist");
  console.log("cleaned");
  done();
}

function html(done) {
  // get current timestamp
  const ts = Math.round(new Date().getTime() / 1000);
  return gulp.src(paths.html.src)
    .pipe(plummer())
    .pipe(pug({ pretty: false }))
    .pipe(
      inject.replace(
        "lastupdatesticker",
        `img src="https://img.shields.io/date/${ts}?color=green&label=last%20update" alt="last update"`
      )
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function style(done) {
  return gulp.src(paths.style.src)
    .pipe(plummer())
    .pipe(sourcemap.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: "compressed",
      })
    )
    .on("error", console.error.bind(console))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(paths.style.dest))
    .pipe(browserSync.stream());
}

function image(done) {
  return gulp.src(paths.image.src)
    .pipe(plummer())
    .pipe(imagemin())
    .pipe(gulp.dest(paths.image.dest))
    .pipe(browserSync.stream());
}

function copyFonts(done) {
  return gulp.src(paths.font.src)
    .pipe(gulp.dest(paths.font.dest))
    .pipe(browserSync.stream());
}

function watch() {
  gulp.watch("./src/includes/*.pug", gulp.series(html, reload));
  gulp.watch(paths.html.src, gulp.series(html, reload));
  gulp.watch(paths.style.src, gulp.series(style, reload));
  gulp.watch("./src/style/**/*.scss", gulp.series(style, reload));
  gulp.watch(paths.image.src, gulp.series(image, reload));
  gulp.watch(paths.font.src, gulp.series(copyFonts, reload));
}

function deploy_stage(done) {
  return spawn.spawn('rsync',
              ['-rv', '--checksum',
               '-e ssh -p12321 -i ~/.ssh/id_ed25519',
               '-e ssh -p12321 -i ~/.ssh/id_ed25519.a3-web-deployment',
               'dist/', 'web-deploy@stage.a3-audio.com:'],
              {stdio: 'inherit'});
}

function deploy_production(done) {
  return spawn.spawn('rsync',
              ['-rv', '--checksum',
               '-e ssh -i ~/.ssh/id_ed25519.a3-web-deployment',
               'dist/', 'web-deploy@a3-audio.com@a3-audio.com:'],
              {stdio: 'inherit'});
}

gulp.task('build', gulp.series(clean, html, style, image, copyFonts));
gulp.task(
  'default',
  gulp.series(
    'build',
    gulp.parallel(browseSyncDep, watch)
  ));
gulp.task('stage', gulp.series('build', deploy_stage));
gulp.task('deploy', gulp.series('build', deploy_production));
