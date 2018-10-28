COMPILE = node_modules/.bin/compile

haunted.js: src/*.js
	$(COMPILE) -f es -o $@ -e https://unpkg.com/lit-html/lit-html.js src/haunted.js