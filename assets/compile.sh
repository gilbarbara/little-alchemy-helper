#!/bin/bash
arr[0]='lib.js'
arr[1]='app.js'

java -jar /Users/gilbarbara/local/lib/node_modules/closure-compiler/lib/vendor/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js `printf "%s " "${arr[@]}"` --js_output_file compiled.min.js
