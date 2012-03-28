default:

all:

test:
	NODE_PATH=./lib expresso -s test/serial*.js

coverage:
	-rm -rf lib-cov
	node-jscoverage lib lib-cov
	NODE_PATH=./lib-cov expresso -s -I lib --cov test/serial*.js
	
clean:
	-rm -rf lib-cov
	
.PHONY: test
