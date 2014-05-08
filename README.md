fbapi
=====

my javascript facebook api library

## start
```
var fbapp;
fbapp = new fbapi({
	debug: true,
	appid: 'YOUR_FB_APP_ID',
	scope: 'user_about_me'
}, function() {
	return console.log('FB app is ready');
});
```

## login and authorization app
```
fbapp.login(function(r) {
	console.log('login');
	return console.log(r);
}, function(r) {
	return console.log('break off');
});
```

## get me
```
fbapp.me(function(r) {
	console.log('get user data...');
	return console.log(r);
}, function(r) {
	return console.log('break off');
});
```

## call FB.ui
```
fbapp.ui({
	method: 'feed',
	name: 'title name',
	caption: 'caption',
	description: "A small JavaScript library that allows you to harness\nthe power of Facebook, bringing the user\'s identity,\nsocial graph and distribution power to your site.",
	link: 'http://example.com/',
	picture: 'http://example.com/dialog_image.png?470x246'
}, function(r) {
	console.log('post to facebook');
	return console.log(r);
}, function(r) {
	return console.log('break off');
});
```
