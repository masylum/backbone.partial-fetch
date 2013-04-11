MOCHA = ./node_modules/.bin/mocha --reporter spec
NODE = node

test:
	@${MOCHA} test/specs.js

.PHONY: test
