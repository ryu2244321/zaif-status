var gulp=require("gulp");
var runSequence = require('run-sequence');
var browser = require("browser-sync").create();
var webpack = require("webpack-stream");
var wpConf = require("./zaif/webpack.config");
var plumber = require("gulp-plumber");
var eslint = require('gulp-eslint');

gulp.task("browserSync", function() {
  browser.init({
    proxy:"localhost:4545",
    open:false
  });
});
gulp.task("reload",function(){
  browser.reload()
})

gulp.task("lint",function(){
  gulp.src(["zaif/component/*.js","js/*.js"])
    .pipe(plumber({
      // エラーをハンドル
      errorHandler: function(error) {
        var taskName = 'eslint';
        var title = '[task]' + taskName + ' ' + error.plugin;
        var errorMsg = 'error: ' + error.message;
        // ターミナルにエラーを出力
        console.error(title + '\n' + errorMsg);
       
      }
    }))
    .pipe(eslint({ useEslintrc: true })) // .eslintrc を参照
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(plumber.stop());
})
gulp.task('webpack', function(){
  return gulp.src('zaif/js/main.js')
    .pipe(webpack(wpConf))
    .pipe(gulp.dest('./zaif/'))
    .pipe(browser.stream());
});
gulp.task("watch", function() {
  gulp.watch("zaif/dist/dist.js", ["reload"]);
  gulp.watch("zaif/index.html",["reload"]);
  gulp.watch(["zaif/component/*.js","js/*.js"],["lint"]);
});
gulp.task("default", function(cb) {
  return runSequence(
    ['browserSync',"lint","webpack","watch"],
    cb
  );
});
