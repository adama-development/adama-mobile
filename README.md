# Adama-mobile

## Prerequisite

This project requires Node, Gulp
Gulp is a Node application that requires a global insstall :

	npm install gulp bower -g



## Getting Started

You have to retrieve the project dependencies in order to make it work :

	git clone git@bitbucket.org:adama/adama_mobile.git
	cd adama_mobile
	npm install
	bower install

Then, you'll need to trigger the development workflow :

	gulp serve

Application is available on http://localhost:3000.

Multiple demo are available :

	gulp serve --demo=simple (same as 'gulp serve')
	gulp serve --demo=with-menu



## How to release

Before release, don't forget to do a full build in order to validate all code base !

	gulp clean build --type production

The release process tag the source control and update project version :

	gulp tag

The project use [gulp-release-tasks](https://www.npmjs.com/package/gulp-release-tasks) for its versionning an tag process.

Don't forget to push the release :

	git push
	git push --tags
