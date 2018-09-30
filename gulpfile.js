
var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    sourceMaps   = require('gulp-sourcemaps'),
    uglify       = require('gulp-uglifyjs'),
    concat       = require('gulp-concat'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    del          = require('del');


var path = {
    app: {
        html: 'app/**/*.html',
        minJs: ['app/js/**/*.js', '!app/js/main.js', '!app/js/libs.min.js'],
        minJsDist: ['app/js/libs.min.js', 'app/js/main.js'],
        minCss: ['app/css/libs.css', 'app/css/main.css'],
        minCssDist: ['app/css/libs.min.css', 'app/css/main.min.css'],
        scss: 'app/scss/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/scss/**/*.scss',
        img: 'app/img/**/*.*'
    },
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        appJs: 'app/js/',
        css: 'dist/css/',
        appCss: 'app/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    clean: 'dist',
    baseDir: 'app'
};


gulp.task('sass', function() {
    return gulp.src(path.app.scss)
        .pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(path.dist.appCss))
        .pipe(browserSync.reload({stream: true}))

});

gulp.task('browser-sync', function() {
    browserSync({
        server: {baseDir: path.baseDir},
        notify: false
    });
});

gulp.task('css', ['sass'], function() {
    return gulp.src(path.app.minCss)
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.dist.appCss));
});

gulp.task('script', function () {
    return gulp.src(path.app.minJs)
    .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.appJs));
});


gulp.task('watch', ['browser-sync', 'css', 'script'], function() {
    gulp.watch(path.watch.scss, ['sass']);
    gulp.watch(path.watch.html, browserSync.reload);
    gulp.watch(path.watch.js, browserSync.reload);
});


gulp.task('clean', function() {
    return del.sync(path.clean);
});

gulp.task('img', function() {
    return gulp.src(path.app.img)
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.dist.img));
});

gulp.task('build', ['clean', 'img', 'sass', 'script'], function() {

    gulp.src(path.app.minCssDist)
        .pipe(gulp.dest(path.dist.css));

    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts));

    gulp.src(path.app.minJsDist)
        .pipe(gulp.dest(path.dist.js));

    gulp.src(path.app.html)
        .pipe( rigger() )
        .pipe(gulp.dest(path.dist.html));
});


