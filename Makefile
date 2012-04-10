REPORTER=spec

default:

all:

test-docs:
	@$(MAKE) test REPORTER=doc \
		| cat docs/head.html - docs/tail.html \
		> docs/test.html
test-md:
	@$(MAKE) test REPORTER=markdown \
		> docs/test.md

test:
	@NODE_PATH=./lib NODE_ENV=test ./node_modules/.bin/mocha \
	--reporter $(REPORTER) \
	--timeout 50000 \
	test/*.js

coverage: lib-cov
	@NODE_PATH=./lib-cov NODE_ENV=test ./node_modules/.bin/mocha \
	--reporter html-cov \
	--timeout 50000 \
	test/*.js > docs/coverage.html

lib-cov:
	@./node_modules/.bin/node-jscoverage lib lib-cov

clean:
	-rm -rf lib-cov
	
.PHONY: test test-doc coverage
