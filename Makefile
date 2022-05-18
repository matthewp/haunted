TRANSPILE = node_modules/.bin/tsc
COMPILE = node_modules/.bin/compile

all: haunted.js web.js
.PHONY: all

lib/*.js: src/*.ts
	$(TRANSPILE)
	# Add ".js" extension to module imports
	./sed.sh -i -E "s/from '.\/(.*?)'/from '.\/\1.js'/" lib/*.js

haunted.js: lib/*.js
	$(COMPILE) -f es -o $@ -e lit-html lib/haunted.js
	./sed.sh -i.bu 's/lit/https:\/\/unpkg\.com\/lit\?module/' $@
	rm -f $@.bu

web.js: haunted.js
	./sed.sh 's/https:\/\/unpkg\.com\/lit\?module/\.\.\/lit\/index.js/' $^ > $@

clean:
	@rm -rf lib haunted.js web.js
.PHONY: clean
