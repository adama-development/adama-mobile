var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var prettify = require('gulp-jsbeautifier');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var templateCache = require('gulp-angular-templatecache');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var replace = require('gulp-replace');

require('gulp-release-tasks')(gulp);

var config = {
	mainPath : './src/',
	targetPath : './dist/'
};

var onError = function(err) {
	plugins.notify.onError({
		title : 'Gulp',
		subtitle : 'Failure!',
		message : 'Error: <%= error.message %>',
		sound : 'Pop'
	})(err);
	this.emit('end');
};

gulp.task('clean', function() {
	return gulp.src(config.targetPath, {
		read : false
	}).pipe(clean());
});

gulp.task('js', function() {
	var jsPipe = gulp.src([ config.mainPath + 'js/app.js', config.mainPath + 'js/**/*.js' ]) //
	.pipe(plugins.plumber({
		errorHandler : onError
	})) //
	.pipe(jshint()) //
	.pipe(jshint.reporter('jshint-stylish')) //
	.pipe(jscs()) //
	.pipe(jscs.reporter()) //
	.pipe(browserSync.stream()); //
	if (gutil.env.type === 'production') {
		jsPipe = jsPipe.pipe(prettify()) //
		.pipe(gulp.dest(config.mainPath + 'js')) //
		// angular annotation
		.pipe(ngAnnotate());

		// Concat version
		jsPipe.pipe(sourcemaps.init()) //
		.pipe(concat('adama-mobile.js')) //
		.pipe(sourcemaps.write('./')) //
		.pipe(gulp.dest(config.targetPath));

		// Concat and minified version
		jsPipe.pipe(sourcemaps.init()) //
		.pipe(concat('adama-mobile-min.js')) //
		.pipe(uglify()) //
		.pipe(sourcemaps.write('./')) //
		.pipe(gulp.dest(config.targetPath));

		// export template
		gulp.src(config.mainPath + 'js/**/*.html') //
		.pipe(templateCache('adama-mobile-templates.js', {
			root : 'adama-mobile/',
			module : 'adama-mobile'
		})) //
		.pipe(gulp.dest(config.targetPath));
	}
	return jsPipe;
});

gulp.task('css', function() {
	var cssPipe = gulp.src([ config.mainPath + 'scss/main.scss' ]) //
	.pipe(plugins.plumber({
		errorHandler : onError
	})) //
	.pipe(sassLint()) //
	.pipe(sassLint.format()) //
	.pipe(sass()) //
	.pipe(autoprefixer({
		browsers : [ 'last 2 versions', 'safari > 5' ]
	})) //
	.pipe(gulp.dest(config.targetPath)) //
	.pipe(browserSync.stream()); //
	if (gutil.env.type === 'production') {
		cssPipe.pipe(sourcemaps.init()) //
		.pipe(cssnano()) //
		.pipe(rename({
			suffix : '.min'
		})) //
		.pipe(sourcemaps.write('./')) //
		.pipe(gulp.dest(config.targetPath));
	}
	return cssPipe;
});

gulp.task('ionic.io', function() {
	var start = '"IONIC_SETTINGS_STRING_START";var settings =';
	var ioconfig = 'IONIC_IO_SETTINGS';
	var end =  '; return { get: function(setting) { if (settings[setting]) { return settings[setting]; } return null; } };"IONIC_SETTINGS_STRING_END"';
	var replaceBy = start + ioconfig + end;
	var pathToIonicIo = 'bower_components/ionic-platform-web-client/dist/';
	var cssPipe = gulp.src([ pathToIonicIo + '*.js' ]) //
	.pipe(replace(/"IONIC_SETTINGS_STRING_START.*IONIC_SETTINGS_STRING_END"/, replaceBy))
	.pipe(gulp.dest('.tmp/'));
});

gulp.task('serve', [ 'ionic.io', 'js', 'css' ], function() {
	var demoFolder = 'demo-simple';
	if (gutil.env.demo) {
		demoFolder = 'demo-' + gutil.env.demo;
	}
	browserSync.init({
		server : {
			baseDir : [ demoFolder, '.tmp' ],
			routes : {
				'/adama-mobile' : config.mainPath + 'js/',
				'/dist' : 'dist',
				'/mocks' : 'mocks',
				'/node_modules' : 'node_modules',
				'/bower_components' : 'bower_components'
			}
		},
		open : false
	});

	gulp.watch('demo*/**').on('change', browserSync.reload);
	gulp.watch('mocks/**').on('change', browserSync.reload);
	gulp.watch(config.mainPath + 'js/**/*.html').on('change', browserSync.reload);
	gulp.watch([ config.mainPath + 'js/**/*.js' ], [ 'js' ]);
	gulp.watch([ config.mainPath + 'scss/**/*.scss' ], [ 'css' ]);
});

gulp.task('default', [ 'serve' ]);

gulp.task('build', [ 'js', 'css' ]);
