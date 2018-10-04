var gulp=require('gulp');
var sass=require('gulp-sass');
var cssmin=require('gulp-minify-css');
var autoprofixer=require('gulp-autoprefixer');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var rename=require('gulp-rename');
gulp.task('sass',function(){
    gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(autoprofixer({
        browsers:['last 5 versions','Android>=4.0'],
        cascade:true,
        remove:true
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('qmx/css'))
});
gulp.task('scripts', function() {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('qmx/js'));
});
gulp.task('copy',function(){
    gulp.src(['src/*.html','src/img/*'],{base:'src'})
        .pipe(gulp.dest('qmx'))
})
gulp.task('default',['sass','scripts','copy','watch']);
gulp.task('watch',function(){
    gulp.watch('src/scss/*.scss',['sass']);
    gulp.watch('src/js/*.js',['scripts']);
})

