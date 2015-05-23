/**
 * Gruntfile for configuring and building polyfill scripts.
 */
module.exports = function(grunt) {

  var PKG = grunt.file.readJSON('package.json');

  // Grunt's initConfig: Run all our tasks.
  grunt.initConfig({

    // Our package.json file.
    pkg: PKG,

    // First, let's blow away everything in /dist.
    clean: ['dist/*'],

    concat: {
      ie8: {
        src: [
          'src/lib/html5shiv/3.7.2/html5shiv.js',
          'src/lib/es5-shim-sham/2.1.0/es5-shim.js',
          'src/lib/es5-shim-sham/2.1.0/es5-sham.js',
          'src/dom/dom-events-polyfill.js',
          'src/dom/dom-traversal-polyfill.js',
          'src/dom/dom-matches-polyfill.js',
          'src/dom/dom-closest-polyfill.js',
          'src/dom/dom-classlist-polyfill.js',
          'src/dom/dom-customevent-polyfill.js'
        ],
        dest: 'dist/ie8-polyfill.js'
      },

      ie9: {
        src: [
          'src/lib/html5shiv/3.7.2/html5shiv.js',
          'src/dom/dom-matches-polyfill.js',
          'src/dom/dom-closest-polyfill.js',
          'src/dom/dom-classlist-polyfill.js',
          'src/dom/dom-customevent-polyfill.js'
        ],
        dest: 'dist/ie9-polyfill.js'
      },

      other: {
        src: [
          'src/dom/dom-matches-polyfill.js',
          'src/dom/dom-closest-polyfill.js',
          'src/dom/dom-customevent-polyfill.js'
        ],
        dest: 'dist/polyfill.js'
      }
    },

    uglify: {
      all: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: '**/*.js',
          dest: 'dist/min',
          ext: '.min.js'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [
    'clean',
    'concat',
    'uglify'
  ]);
};
