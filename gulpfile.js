const gulp = require("gulp")
const ts = require("gulp-typescript")
const clean = require('gulp-clean')
const tsProject = ts.createProject("tsconfig.json")

const browserify = require('browserify')
const tsify = require('tsify')

const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')

gulp.task('clean', function () {
    return gulp
    .src('dist', { read: false, allowEmpty: true })
    .pipe(clean('dist'));
})

gulp.task('index', () => {
    return gulp
    .src(['./*.ts', './!(node_modules)/*.ts'])
    .pipe(ts({
        // 这里对应参数 
        // { "declaration": true }
        // /* Generates corresponding '.d.ts' file. */
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'node',
        declaration: true
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('tsc', () => {
    return gulp
    .src(['./src/**/*.ts'])
    .pipe(ts({
        // 这里对应参数 
        // { "declaration": true }
        // /* Generates corresponding '.d.ts' file. */
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'node',
        declaration: true
    }))
    .pipe(gulp.dest('dist/src'))
})

gulp.task('clean-js', function () {
    return gulp
    .src('dist/**/*.js', { read: false })
    .pipe(clean('*.js'))
})

gulp.task('build', () => {
    return tsProject.src()
    .pipe(ts({
        target: 'es2018',
        moduleResolution: 'node',
        declaration: true
    }))
    .js.pipe(gulp.dest("dist"))
})

gulp.task("default",
    gulp.series(
        gulp.parallel('clean'),
        gulp.parallel('tsc'),
        gulp.parallel('index'),
        gulp.parallel('clean-js'),
        gulp.parallel('build')
    )
)
