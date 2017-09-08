//导入插件
var gulp = require('gulp'), //导入插件
    scss = require('gulp-scss'), //导入scss编译
    sass = require('gulp-sass'), //导入scss编译
    autoprefixer = require('gulp-autoprefixer'), //根据设置浏览器版本自动处理浏览器前缀
    cleanCss = require('gulp-clean-css'), //压缩css
    uglify = require('gulp-uglify'), //压缩js
    rename = require('gulp-rename'), //修改文件名
    notify = require('gulp-notify'), //控制台中加入文字描述
    combiner = require('stream-combiner2'), //监听错误信息
    changed = require('gulp-changed'), //只编译改动过的文件
    rev = require('gulp-rev'), //版本控制
    revCollector = require('gulp-rev-collector'),
    babel = require('gulp-babel'), //用于编译es6
    clean = require('gulp-clean'), //清理
    stripDebug = require('gulp-strip-debug'), //删除console
    imagemin = require('gulp-imagemin'), //图片压缩
    livereload = require('gulp-livereload'); //浏览器自动刷新页面
var browserSync = require('browser-sync').create();

var devPort = 8888;
var distPort = 9999;

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());
});

// webserver 启动本地服务器(开发环境)
gulp.task('devServer', function() {
    browserSync.init({
        port: devPort,
        server: {
            baseDir: ["./src"],
            index: "login.html",
        },
    });
});

// webserver 启动本地服务器（生产环境）
gulp.task('distServer', function() {
    browserSync.init({
        port: distPort,
        server: {
            baseDir: ["./dist"],
            index: "login.html",
        },
    });
});

gulp.task('css', function() {
    var _DEST = "src/statics/css";
    gulp.src(["src/statics/css/*.scss", "!src/statics/css/_ignore/**/*.css"])
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(gulp.dest(_DEST)); //css压缩后存放路径
});

//css压缩+rev
gulp.task('cssMin', function() {
    var _DEST = "dist/statics/css";
    gulp.src(["src/statics/css/**/*.scss", "!src/statics/css/_ignore/**/*.css"])
        .pipe(changed(_DEST))
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(rev()) //Hash改名
        .pipe(gulp.dest(_DEST)) //css压缩后存放路径
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/css')); //输出改名前后的对应关系
});

//js 编译+rev
gulp.task('jsMin', function() {
    var _DEST = "dist/statics/js";
    var combined = combiner.obj([
        gulp.src(["src/statics/js/**/*.js", "!src/statics/js/common/**/*.js"]),
        changed(_DEST),
        babel({
            "presets": ["es2015", "stage-0"]
        }),
        stripDebug(),
        uglify(),
        rev(), //Hash改名
        gulp.dest(_DEST),
        rev.manifest(),
        gulp.dest('src/rev/js'), //输出改名前后的对应关系
        notify({
            message: 'jsMin task complete'
        })
    ]);
    combined.on('error', console.error.bind(console));
    return combined;
});

gulp.task('commonJsMin', function() {
    var _DEST = "dist/statics/js/common";
    var combined = combiner.obj([
        gulp.src("src/statics/js/common/**/*.js"),
        changed(_DEST),
        babel({
            "presets": ["es2015", "stage-0"]
        }),
        stripDebug(),
        uglify(),
        gulp.dest(_DEST),
    ]);
    combined.on('error', console.error.bind(console));
    return combined;
});
//图片压缩
gulp.task('imageMin', function() {
        return gulp.src('src/statics/img/*')
            .pipe(imagemin())
            .pipe(gulp.dest('dist/statics/img'));
    })
    //复制插件
gulp.task('copyPlugins', function() {
    return gulp.src('src/statics/plugins/**/*')
        .pipe(gulp.dest('dist/statics/plugins/'));
});
//复制模拟数据
gulp.task('copyMock', function() {
    return gulp.src('src/statics/mock/**/*')
        .pipe(gulp.dest('dist/statics/mock/'));
});

// html 版本缓存管理
gulp.task('dist', ['jsMin', 'commonJsMin', 'cssMin', 'copyMock', 'copyPlugins', 'imageMin'], function() {
    //复制icon
    gulp.src('src/*.ico')
        .pipe(gulp.dest('dist'));
    //复制iconfont
    gulp.src('src/statics/iconfont/*')
        .pipe(gulp.dest('dist/statics/iconfont'));

    var src = [
        'src/rev/**/*.json', //上述输出的改名前后的对应关系
        'src/**/*.html'
    ]
    return gulp.src(src)
        .pipe(revCollector()) //根据对应关系进行替换
        .pipe(gulp.dest('dist')); //输出替换后的问题
});

//动态监听css文件改动
gulp.task("cssWatch", function() {
    gulp.watch(["src/statics/css/**/*.scss"], ["css"], function() {

    });
});

//任务
gulp.task("default", function() {
    console.log("请输入具体任务名称");
    console.log("css压缩：gulp cssMin");
    console.log("js压缩：gulp jsMin");
    console.log("图片压缩：gulp imageMin");
    console.log("复制插件：gulp copyPlugins");
    console.log("复制模拟数据：gulp copyMock");
    console.log("css监听并压缩：gulp cssWatch");
    console.log("版本缓存管理：gulp dist");
    console.log("开发环境：gulp devServer css cssWatch");
    console.log("生产打包：npm run build");
});