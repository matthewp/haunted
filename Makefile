COMPILE = node_modules/.bin/compile

all: haunted.js web.js
.PHONY: all

haunted.js: src/*.js
	$(COMPILE) -f es -o $@ -e lit-html src/haunted.js
	sed -i.bu 's/lit-html/https:\/\/unpkg\.com\/lit-html@\^1\.0\.0\/lit-html\.js/' $@
	rm -f $@.bu

web.js: haunted.js
	sed 's/https:\/\/unpkg\.com\/lit-html@\^1\.0\.0\/lit-html\.js/\.\.\/lit-html\/lit-html\.js/' $^ > $@

clean:
	@rm -f haunted.js web.js
.PHONY: clean
