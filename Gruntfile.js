module.exports = function (grunt) {

    var appResourceSassDir;

    var bowerCssFiles, bowerJsFiles;

    appResourceSassDir = {
        'scss': 'app/Resources/assets/scss/**/*.scss'
    };

    bowerCssFiles = {
        'css/plugins/bootstrap.css': 'bootstrap/dist/css/bootstrap.css',
        'css/plugins/font-awesome.css': 'font-awesome/css/font-awesome.css',
        'css/plugins/jquery.gridster.css': 'gridster/dist/jquery.gridster.css'
    };

    bowerJsFiles = {
        'js/plugins/jquery.js': 'jquery/dist/jquery.js',
        'js/plugins/bootstrap.js': 'bootstrap/dist/js/bootstrap.js',
        'js/plugins/jquery.gridster.js': 'gridster/dist/jquery.gridster.js',
        'js/plugins/jQuery.fastClick.js': 'jquery-fast-click/jQuery.fastClick.js',
        'js/plugins/Chart.js': 'Chart.js/Chart.js',
        'js/plugins/jquery.flip.js': 'flip/dist/jquery.flip.js'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: {
                src: [ 'web/css','web/js','web/fonts','web/images' ]
            }
        },
        bowercopy: {
            options: {
                srcPrefix: 'bower_components',
                destPrefix: 'web'
            },
            scripts: {
                files: bowerJsFiles
            },
            stylesheets: {
                files: bowerCssFiles
            },
            fonts: {
                files: {
                    'fonts': 'font-awesome/fonts'
                }
            }
        },
        copy: {
            images: {
                expand: true,
                cwd: 'app/Resources/assets/images',
                src: '*',
                dest: 'web/images/'
            },
            fonts: {
                expand: true,
                cwd: 'app/Resources/assets/fonts',
                src: '*',
                dest: 'web/fonts/'
            },
            dashboardjs: {
                expand: true,
                cwd: 'app/Resources/js/app/dashboard',
                src: '*.js',
                dest: 'web/js/app/dashboard'
            },
            statsjs: {
                expand: true,
                cwd: 'app/Resources/js/app/stats',
                src: '*.js',
                dest: 'web/js/app/stats'
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/Resources/assets/scss',
                    src: ['*.scss'],
                    dest: 'app/Resources/assets/css',
                    ext: '.css'
                }]
            }
        },
        concat: {
            options: {
                stripBanners: true
            },
            plugins_css: {
                src: [
                    'web/css/plugins/*.css'
                ],
                dest: 'web/css/plugins.css'
            },
            app_css: {
                src: [
                    'app/Resources/assets/css/*.css'
                ],
                dest: 'web/css/app.css'
            },
            js: {
                src: [
                    'web/js/plugins/jquery.js',
                    'web/js/plugins/bootstrap.js',
                    'web/js/plugins/jquery.gridster.js',
                    'web/js/plugins/jQuery.fastClick.js',
                    'web/js/plugins/Chart.js',
                    'web/js/plugins/jquery.flip.js'
                ],
                dest: 'web/js/plugins/plugins.js'
            },
            app_js: {
                src: [
                    'app/Resources/assets/js/app/*.js'
                ],
                dest: 'web/js/app.js'
            },
            stats_js : {
                src : [
                    'app/Resources/assets/js/app/stats/*.js'
                ],
                dest: 'web/js/app.stats.js'
            },
            dashboard_js: {
                src: [
                    'app/Resources/assets/js/app/dashboard/*.js'
                ],
                dest: 'web/js/app.dashboard.js'
            }
        },
        cssmin : {
            bundled:{
                src: ['web/css/plugins.css','web/css/app.css'],
                dest: 'web/css/app.min.css'
            }
        },
        uglify : {
            js: {
                files: {
                    'web/js/plugins.min.js': 'web/js/plugins/plugins.js',
                    'web/js/app.min.js': 'web/js/app.js',
                    'web/js/app.dashboard.min.js': 'web/js/app.dashboard.js',
                    'web/js/app.stats.min.js': 'web/js/app.stats.js'
                }
            }
        },
        watch: {
            appResourceScss: {
                files: appResourceSassDir.scss,
                tasks: 'sass'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('dist', ['clean','bowercopy','copy', 'sass', 'concat', 'cssmin', 'uglify']);
};