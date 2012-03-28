default:

all:

test:
	NODE_PATH=./lib expresso test/*
	
testSerial:
	NODE_PATH=./lib expresso -s test/*

coverage:
	-rm -rf lib-cov
	node-jscoverage lib lib-cov
	NODE_PATH=./lib-cov expresso -I lib --cov test/*
	
coverageSerial:
	-rm -rf lib-cov
	node-jscoverage lib lib-cov
	NODE_PATH=./lib-cov expresso -s -I lib --cov test/*

clean:
	-rm -rf lib-cov
	
.PHONY: test
