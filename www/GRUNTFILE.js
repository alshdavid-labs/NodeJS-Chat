/*
    Terminal Usage:
    
    'grunt' - minifies and compiles TypeScript and JavaScript and launches browserSync
    'grunt watch' - minifies and compiles TypeScript and JavaScript
    'grunt browserSync' - watches changes to the public directory and syncs it with the browser

*/
/****************************************
    0. Grunt Variables
****************************************/
var projectDir = '';
var privateDir = projectDir + 'private'
var publicDir = projectDir + 'public'

var privateStyle = privateDir + '/styles'
var privateJS = privateDir + '/scripts'

var publicStyle = publicDir + '/styles'
var publicJS = publicDir + '/scripts'

/****************************************
    1. Define Grunt Tasks
****************************************/
module.exports = function (grunt) {
      
    // S: Grunt Initiliaze Config
    grunt.initConfig({

/****************************************
    2. Watch Folders Tasks
****************************************/

    watch: {
        options: {
            spawn: false
        },
        watch_sass: {
            files: [privateStyle + "/**/*.scss", publicStyle + "/style.css"],
            tasks: ['sass', 'autoprefixer']
        },
        watch_javascript: {
            files: privateJS + "/**/*.js",
            tasks: ['copy']
        },
        //watch_typescript: {
        //    files: privateJS + "/**/*.ts",
        //    tasks: ['ts']
        //},
       watch_home: {
          files: privateDir + '/*.*',
          tasks: ['copy']
       },
       watch_prefix: {
          files: publicStyle + "/style.css",
          tasks: ['autoprefixer']
       }
    },

/****************************************
    3. Uglify JS  
****************************************/    

    uglify: {
        
        options:{
            sourceMap: false
        },
        javascript: {
            files: [{
                expand: true,
                cwd: privateJS,
                src: ['**/*.js'],
                dest: publicJS
            }]
        }
        
    },	

    //ts: {
    //  default : {
    //    src: ["**/*.ts", "!node_modules/**"],
    //    dest: publicJS
    //  }
    //},			
	
/****************************************
    4. Convert SCSS to CSS
****************************************/    
    
    sass: {
          global: {
            options: {
              sourceMap: false,
              outputStyle: 'compressed'
            },
            files: [{
                expand: true,
                cwd: privateStyle,
                src: ['style.scss'],
                dest: publicStyle,
                ext: '.css'
            },],
          }
        },

        autoprefixer: {
            options: {
                browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
            },
            dist: {
                src: publicStyle + '/style.css',
                dest: publicStyle + '/style.css'
            }
        },
    
 /****************************************
    5. Copy site content to public folder
****************************************/   

    copy: {
        main: {
            expand: true,
            cwd: privateDir,
            src: ['**', '!**/styles/**'],
            dest: publicDir + '/',
        },
    },  


/****************************************
    6. Refresh Browser on changes
****************************************/

    browserSync: {
        bsFiles: {
            src : [publicDir]
        },
        options: {
            server: {
                baseDir: [publicDir]            
            },
            notify:{
                styles: {
                    top: 'auto',
                    bottom: '0',
                    height: 'auto',
                    opacity: '0.2',
                    "border-radius" : "0px"
                }
            }
        }
    },  
    

    concurrent: {
        target: ['watch', 'browserSync']
    }

    

});

/****************************************
    7. Load Grunt Tasks
****************************************/

	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-autoprefixer');
    //grunt.loadNpmTasks("grunt-ts");
    require('load-grunt-tasks')(grunt);

/****************************************
    8. Register Default Task
****************************************/
    grunt.registerTask('default', ['concurrent:target']);

};
