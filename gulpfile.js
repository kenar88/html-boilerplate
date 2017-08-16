// подключаем модули
var gulp =          require('gulp');
var less =          require('gulp-less');
var rename =        require('gulp-rename');
var clean =         require('gulp-clean-css');
var browserSync =   require('browser-sync').create();
var imagemin =      require('gulp-imagemin');
var autoprefixer =  require('gulp-autoprefixer');
var del =           require('del');
var notify =        require('gulp-notify');


// таск для обработки стилей
gulp.task('styles', function() {
	// берем основной файл стилей, в который импортятся все остальные
  gulp.src(['src/less/general.less'])
  	// превращаем less в чистый css
    .pipe(less())
    // добавляем сообщение об ошибке
    .on("error", notify.onError())
    // меняем имя
    .pipe(rename('dist/css/bundle.css'))
    // добавляем вендорные префиксы
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    // сжимаем стили, чистим от комментариев
    .pipe(clean())
    // записываем изменения в папку dist
    .pipe(gulp.dest('./', { overwrite: true }))
    // перезагружаем страницу в браузере
    .pipe(browserSync.stream());
});

// таск для обработки разметки
// сейчас он просто переносит файлы из src в dist
gulp.task('html', function() {
	gulp.src(['src/**/*.html'])
		.pipe(gulp.dest('dist/'));
  browserSync.reload();
});

// таск для сжатия изображений
gulp.task('images', function() {
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
  browserSync.reload();
});

// таск для скриптов. пока что ничего с ними не делает
gulp.task('scripts', () => {
	gulp.src('src/js/*.js')
    .pipe(gulp.dest('dist/js'));
  browserSync.reload();
})


// дефолтный таск
gulp.task('default', ['styles', 'html', 'images', 'scripts'], function() {
	// следим за изменениями в файлах стилей и запускаем таск обработки
  gulp.watch('src/less/**/*.less', ['styles']);
	// то же самое для html
	gulp.watch('src/**/*.html', ['html']);
	// изображения
	gulp.watch('src/images/*', ['images']);
  // скрипты
  gulp.watch('src/js/*.js', ['scripts']);

	// сервер для разработки
	browserSync.init({
    server: {
        baseDir: "./dist"
    }
  });
});