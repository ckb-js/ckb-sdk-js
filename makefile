ci-install:
	npm install -g codecov;
	npm install;
	lerna bootstrap --hoist --mutex file:/tmp/.yarn-mutex --concurrency=1;
