COMPILE = node_modules/.bin/compile

all: haunted.js
.PHONY: all

haunted.js: src/*.js
	$(COMPILE) -f es -o $@ -e lit-html src/haunted.js
	sed -i.bu 's/lit-html/https:\/\/unpkg\.com\/lit-html@\^1\.0\.0\/lit-html\.js/' $@
	rm -f $@.bu

clean:
	@rm -f haunted.js
.PHONY: clean
