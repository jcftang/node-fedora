default:

all:

test:
	NODE_PATH=./lib expresso test/*

coverage:
	-rm -rf lib-cov
	node-jscoverage lib lib-cov
	NODE_PATH=./lib-cov expresso -I lib --cov test/*

clean:
	-rm -rf lib-cov
	
.PHONY: test
