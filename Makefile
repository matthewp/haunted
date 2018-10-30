COMPILE = node_modules/.bin/compile

all: haunted.js index.js
.PHONY: all

haunted.js: src/*.js
	$(COMPILE) -f es -o $@ -e https://unpkg.com/lit-html/lit-html.js src/haunted.js

index.js: haunted.js
	sed 's/https:\/\/unpkg\.com\/lit-html\/lit-html\.js/\.\.\/\.\.\/node_modules\/lit-html\/lit-html\.js/' $^ > $@

clean:
	@rm haunted.js index.js
.PHONY: clean
