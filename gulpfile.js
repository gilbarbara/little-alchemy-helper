var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    bowerFiles = require('main-bower-files'),
    browserify = require('browserify'),
    browserSync = require('browser-sync'),
    buffer = require('vinyl-buffer'),
    del = require('del'),
    historyApiFallback = require('connect-history-api-fallback'),
    merge = require('merge-stream'),
    path = require('path'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    wiredep = require('wiredep').stream,
    AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

var middleware = historyApiFallback({});

var isProduction = function () {
        return process.env.NODE_ENV === 'production';
    },
    config = {
        dest: function () {
            return (isProduction() ? 'dist' : '.tmp');
        }
    };

// Functions

function watchifyTask(options) {
    var bundler, rebundle, iteration = 0;
    bundler = browserify({
        entries: path.join(__dirname, '/app/scripts/main.js'),
        basedir: __dirname,
        insertGlobals: true,
        cache: {}, // required for watchify
        debug: options.watch,
        packageCache: {}, // required for watchify
        fullPaths: options.watch, // required to be true only for watchify
        transform: [
            ['babelify', {ignore: /bower_components/}]
        ],
        extensions: ['.jsx']
    });

    if (options.watch) {
        bundler = watchify(bundler);
    }

    rebundle = function () {
        var stream = bundler.bundle();

        if (options.watch) {
            stream.on('error', $.util.log);
            $.util.log($.util.colors.cyan('watchifyTask'), $.util.colors.magenta(iteration));
        }

        stream
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe($.if(!options.watch, $.uglify()))
            .pipe(gulp.dest(config.dest() + '/scripts'))
            .pipe($.tap(function () {
                if (iteration === 0 && options.cb) {
                    options.cb();
                }
                iteration++;
            }));
    };

    bundler.on('update', rebundle);
    return rebundle();
}

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.changed('styles', {
            extension: '.scss'
        }))
        .pipe($.sass.sync({
            includePaths: ['bower_components'],
            precision: 10
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest(config.dest() + '/styles'))
        .pipe($.size({
            title: 'Styles'
        }));
});

gulp.task('scripts', function (cb) {
    return watchifyTask({
        watch: !isProduction(),
        cb: cb
    });
});

gulp.task('lint', function () {
    return gulp.src('app/scripts/**/*')
        .pipe($.eslint({
            plugins: ['react']
        }))
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError());
});

gulp.task('media', function () {
    return gulp.src('app/media/**/*')
        .pipe($.cache($.imagemin({
            verbose: true
        }, {
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(config.dest() + '/media'))
        .pipe($.size({
            title: 'Media'
        }));
});

gulp.task('fonts', function () {

    return gulp.src(bowerFiles({}).concat('app/fonts/**/*'))
        .pipe($.filter(['**/*.{eot,svg,ttf,woff,woff2}', '!**/*glyphicons*']))
        .pipe($.flatten())
        .pipe(gulp.dest(config.dest() + '/styles/fonts'))
        .pipe($.size({
            title: 'Fonts'
        }));
});

gulp.task('bundle', function () {
    var html,
        vendor,
        files,
        assets = $.useref.assets({
            searchPath: ['.tmp', 'app', '.']
        });

    html = gulp.src('app/*.html')
        .pipe(assets)
        .pipe($.if('*.css', $.cssmin()))
        .pipe($.if('*.js', $.uglify()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'Bundle:html'
        }));

    vendor = gulp.src('bower_components/modernizr/modernizr.js')
        .pipe($.uglify());

    files = gulp.src([
        'app/*.*',
        '!app/*.html',
        'app/api/**'
    ], {dot: true, base: 'app/'})
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'Bundle:copy'
        }));

    return merge(html, vendor, files);
});

gulp.task('wiredep', function () {
    return gulp.src('app/index.html')
        .pipe(wiredep({exclude: ['bootstrap-sass']}))
        .pipe(gulp.dest('app'))
        .pipe($.size({
            title: 'wiredep'
        }));
});

gulp.task('assets', function (cb) {
    runSequence(['styles', 'scripts', 'wiredep', 'media', 'fonts'], cb);
});

gulp.task('mocha', function () {
    return gulp.src('app/scripts/**/__tests__/*.js', {
        read: false
    })
        .pipe($.mocha({
            reporter: 'nyan'
        }));
});

gulp.task('clean', del.bind(null, [config.dest() + '/*']));

gulp.task('sizer', function () {
    return gulp.src(config.dest() + '/**/*')
        .pipe($.size({
            title: 'Size',
            gzip: true
        }));
});

gulp.task('sync', function () {
    return gulp.src('', {read: false})
        .pipe($.shell([
            'rsync -rvpa --progress --delete --exclude=.DS_Store -e "ssh -q -t" dist/ lahelper@littlealchemyhelper.com:/home/lahelper/public_html/beta'
        ])
    );
});

gulp.task('serve', ['assets'], function () {
    browserSync({
        notify: true,
        logPrefix: 'l.a.h',
        files: ['app/*.html', '.tmp/scripts/**/*.js', '.tmp/styles/**/*.css', 'app/images/**/*'],
        server: {
            baseDir: [config.dest(), 'app'],
            routes: {
                '/bower_components': 'bower_components'
            },
            middleware: [middleware]
        }
    });
    gulp.watch('app/styles/**/*.scss', function (e) {
        if (e.type === 'changed') {
            gulp.start('styles');
        }
    });
    gulp.watch('bower.json', ['wiredep', browserSync.reload]);
});

gulp.task('build', ['clean'], function (callback) {
    process.env.NODE_ENV = 'production';
    runSequence('lint', ['assets', 'bundle'], 'sizer', callback);
});

gulp.task('deploy', function (callback) {
    process.env.NODE_ENV = 'production';
    runSequence('build', 'sync', callback);
});

gulp.task('default', ['serve']);
