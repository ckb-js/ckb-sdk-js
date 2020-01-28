ci-install:
	npm install -g codecov;
	npm install;
	lerna bootstrap --mutex file:/tmp/.yarn-mutex --concurrency=1;
