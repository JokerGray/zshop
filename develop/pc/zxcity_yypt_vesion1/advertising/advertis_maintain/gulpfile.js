var gulp=require('gulp');
var sass=require('gulp-sass');
var cssmin=require('gulp-minify-css');
var autoprofixer=require('gulp-autoprefixer');
gulp.task('sass',function(){
    gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(autoprofixer({
        browsers:['last 5 versions','Android>=4.0'],
        cascade:true,
        remove:true
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('css'))
})
gulp.task('default',['sass','watch']);
gulp.task('watch',function(){
    gulp.watch('scss/*.scss',['sass'])
})