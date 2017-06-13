// ============ VARIABLES  ============
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    merge = require('merge-stream'),
    spritesmith = require('gulp.spritesmith'),  
    runSequence = require('run-sequence'), // correct finish of the previous task - to start next
    reload = browserSync.reload;

// ============ PATH  ============

var path = {
    build: { // destination folders of all files
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        icons: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { // source folders of all files
        html: 'src/*.html',
        js: 'src/js/main.js', // we use only 1 file to control sequence of all scripts in main.js
        style: 'src/style/main.scss', // we use only 1 file to control sequence of all styles in main.scss
        img: 'src/img/**/*.*',
        icons: 'src/icons/**.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { // where are we should watch for changings
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        icons: 'src/icons/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

// ============ OPTIONS  ============

var browserSyncOptions = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 3001,
    logPrefix: "Browser-sync"
};
var autoPrefixerOptions = {
    cascade: false
};
var sassOptions = {
    errLogToConsole: true
};
var spriteOptions = {
    imgName: 'sprite.png',
    imgPath: '../img/sprite.png',
    cssName: '_sprite.scss',
    padding: 2
};
var imageMinOptions = {
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()],
    interlaced: true
};

// ============ WEBSERVER  ============

gulp.task('webserver', function () {
    browserSync(browserSyncOptions);
});

// ============ TASKS  ============

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});
gulp.task('js:build', function () {
    gulp.src(path.src.js) //get only main.js
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});
gulp.task('style:build', function () {
    gulp.src(path.src.style) // get only main.scss (all scss files included from partials there)
        .pipe(sass(sassOptions)) //compile sass to css
        .pipe(prefixer(autoPrefixerOptions)) //add prefixes
        .pipe(cssnano()) // minify
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});
gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin(imageMinOptions)) //optimise images
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts)) // simple copy
});
gulp.task('sprite:generate', function () {    
    var spriteData = gulp.src(path.src.icons)
    .pipe(spritesmith(spriteOptions)); // Generate our spritesheet 
    var imgStream = spriteData.img
    .pipe(gulp.dest('src/img/')); // destination - to source files, because other task will do optimise process
    var cssStream = spriteData.css
    .pipe(gulp.dest('src/style/partials/')); // other task will compile, concat, and minify this sassFile with others
    return merge(imgStream, cssStream); // Return a merged stream to handle both `end` events 
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('build', function(cb) {
    runSequence('clean', //clean build folder !!!first
    'sprite:generate', //generate sprite-image and sass-code for icons !!!second
    ['image:build', 'html:build', 'js:build', 'style:build', 'fonts:build'], //simultaneously
    cb);
});

// ============ WATCHING  ============

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.icons], function(event, cb) {
        gulp.start('sprite:generate');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

// ============ bash: gulp  ============

gulp.task('default', function(cb) {
    runSequence('build', 'webserver', 'watch', cb);
});