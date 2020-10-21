/*jshint esversion: 6 */
const dotenv = require('dotenv');
const gulp = require('gulp');
const gulpMocha = require('gulp-mocha');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const log = require('fancy-log');
const merge = require('merge2');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const tslint = require('gulp-tslint');

dotenv.config({ path: '.env' });
const tsProject = ts.createProject('tsconfig.json');

const paths = {
  images: {
    src: 'src/public/assets/images/**/*',
    dest: 'dist/public/assets/images/'
  },
  fonts: {
    src: 'src/public/assets/fonts/**/*',
    dest: 'dist/public/assets/css/fonts/'
  },
  favicon: {
    src: 'src/public/assets/favicon.ico',
    dest: 'dist/public/assets/'
  },
  headroom: {
    src: 'node_modules/headroom.js/dist/headroom.min.js',
    dest: 'dist/public/assets/js/'
  },
  jquery: {
    src: 'node_modules/jquery/dist/jquery.slim.min.js',
    dest: 'dist/public/assets/js/'
  },
  moment: {
    src: 'node_modules/moment/min/moment.min.js',
    dest: 'dist/public/assets/js/'
  },
  main: {
    src: 'src/public/assets/js/main.js',
    dest: 'dist/public/assets/js/'
  },
  pikaday: {
    src: 'node_modules/pikaday/pikaday.js',
    dest: 'dist/public/assets/js/'
  },
  ejs: {
    src: 'src/views/**/*.ejs',
    dest: 'dist/views/'
  },
  sass: {
    src: 'src/scss/default.scss',
    dest: 'dist/public/assets/css/'
  },
  typescript: {
    src: 'src/**/*.ts',
    dest: 'dist'
  },
  tests: {
    src: 'test/**/*.test.ts',
    dest: 'test/**/*.test.ts'
  }
};

function javascript() {
  return gulp.src([paths.main.src, paths.pikaday.src])
    .pipe(minify({ ext: '.min.js', noSource: true }))
    .pipe(gulp.dest(paths.main.dest));
}

function scss() {
  return gulp.src(paths.sass.src)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    })).on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.sass.dest));
}

function typescript() {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.typescript.dest));
}

function assets() {
  return merge(
    gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest)),
    gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest)),
    gulp.src(paths.favicon.src).pipe(gulp.dest(paths.favicon.dest)),
    gulp.src(paths.headroom.src).pipe(gulp.dest(paths.headroom.dest)),
    gulp.src(paths.jquery.src).pipe(gulp.dest(paths.jquery.dest)),
    gulp.src(paths.moment.src).pipe(gulp.dest(paths.moment.dest))
  );
}

function ejs() {
  return gulp.src(paths.ejs.src).pipe(gulp.dest(paths.ejs.dest));
}

function serve(done) {
  var started = false;
  log('Node Environment:', process.env.PORT, process.env.NODE_ENV);

  return nodemon({
      script: 'dist/app.js',
      delay: '1000',
      watch: ['dist'],
      env: {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT
      }
  }).on('start', () => {
      if (!started) {
          started = true;
          done();
      }
  });
}

function test() {
  return gulp.src(paths.tests.src)
  .pipe(gulpMocha({
    bail: false,
    reporter: 'spec',
    compilers: 'ts:ts-node/register'
    }).on('error', console.error));
}

function lint() {
  return gulp.src(paths.typescript.src)
    .pipe(tslint({ formatter: 'verbose' }))
    .pipe(tslint.report());
}

function watch(done) {
  gulp.watch(paths.images.src, assets);
  gulp.watch(paths.fonts.src, assets);
  gulp.watch(paths.ejs.src, gulp.series(ejs, lint, typescript));
  gulp.watch(paths.typescript.src, gulp.series(lint, typescript));
  gulp.watch(paths.sass.src, scss);
  gulp.watch(paths.main.src, javascript);
  gulp.watch('src/scss/**/*.scss', scss);
  done();
}

function testing(done) {
  gulp.watch(paths.tests.src, mocha);
  done();
}

var build = gulp.series(lint, typescript, ejs, javascript, scss, assets);
var serve = gulp.series(serve, watch);
var test = gulp.series(test, testing);

gulp.task('build', build);
gulp.task('serve', serve);
gulp.task('test', test);
gulp.task('test-once', test);
gulp.task('default', build);
