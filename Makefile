TRANSPILE = node_modules/.bin/tsc
COMPILE = node_modules/.bin/compile

all: haunted.js web.js
.PHONY: all

lib/*.js: src/*.ts
	$(TRANSPILE)
	# Add ".js" extension to module imports
	sed -i -E "s/from '.\/(.*?)'/from '.\/\1.js'/" lib/*.js

haunted.js: lib/*.js
	$(COMPILE) -f es -o $@ -e lit-html lib/haunted.js
	sed -i.bu 's/lit-html/https:\/\/unpkg\.com\/lit-html@\^1\.0\.0\/lit-html\.js/' $@
	rm -f $@.bu

web.js: haunted.js
	sed 's/https:\/\/unpkg\.com\/lit-html@\^1\.0\.0\/lit-html\.js/\.\.\/lit-html\/lit-html\.js/' $^ > $@

clean:
	@rm -rf lib haunted.js web.js
.PHONY: clean
