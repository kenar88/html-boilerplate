// подключаем модули
var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var clean = require('gulp-clean-css');
var browserSync = require('browser-sync').create();

// таск для обработки стилей
gulp.task('styles', function() {
	// берем основной файл стилей, в который импортятся все остальные
    gulp.src(['src/less/general.less'])
    	// превращаем less в чистый css
        .pipe(less())
        // меняем имя
        .pipe(rename('dist/css/bundle.css'))
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
});

// дефолтный таск
gulp.task('default', ['styles', 'html'], function() {
	// следим за изменениями в файлах стилей и запускаем таск обработки
    gulp.watch('src/less/**/*.less', ['styles']);
	// то же самое для html
	gulp.watch('src/**/*.html', ['html']);

	// сервер для разработки
	browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});