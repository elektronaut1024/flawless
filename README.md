flawless
========

A callback factory which splits away handling errors into a separate flow and thus requiring less boilerplate code.

naming
------
The name might sound a little arrogant but it's actually quite fitting in a literal sense.
Less flaws or errors (in the code) being the primary target of this module.

reason
------
Because of its asynchronous interface node uses a callback concept where every function-call, triggers the given callback when finished or when it fails.

An example:
```javascript
db.insert({'name':'foo'},function(err,result){
  if ( err ) {
    //handle the error
  } else {
    //proceed
  }
});
```

I don't like boilerplate-style code and *promises* are a little magicky. So I made up this error-handling module.

usage
-----

```javascript
//To use the module simply import it into your code:
var then = require('flawless').then;

db.insert({'name':'foo'},
  then(function(result){
    //proceed
  })
  .or(function(err){
    //handle the error
  })
);
```

So. ```then().or()``` is actually a callback factory which (obviously, being a callback factory) returns a callback.
It does not look like much but this way the error is always treated in some way, thus eliminating the possibility of omitting proper-error handling.

It's concise
```javascript
function stop(err){
  throw err;
}

function log(err){
  console.error(err);
}

db.insert({'name':'foo'},
  then(function(result){
    db.query({},then(function(result){
      //proceed
    }).or(log));
  }).or(stop);
);
```

You could extend the concept with your own factories:
```javascript
function exceptional(continuation){
	return then(continuation).or(function(err){ throw err });
}

db.insert({'name':'foo'},exceptional(function(result){
  
}));
```

To debug asynchronous code I always found logging (instead of stepping through the code interactively) the only way to go.
Using *flawless* you can simply enable the debugging mode after which the module will log every call to the console.

```javascript
var then = require('flawless').debug(true).then;
```

example
-------
```javascript
var then = require('flawless').debug(true).then;

function exceptional(continuation){
    return then(continuation).or(function(err){ throw err });
}

var Datastore = require('nedb');
var db = new Datastore({filename:'contacts.nedb', nodeWebkitAppName:'contacts'});

var domain = require('domain').create();
domain.on('error',function(err){
	console.log('domain error',err);
});

domain.run(function(){
  db.loadDatabase(exceptional(function loadedDatabase(){
  	var index = {
  		fieldName: 'name',
  		unique: true
  	};
  	
  	db.ensureIndex(index,exceptional(function ensuredIndex(){
  		var name = prompt('your name?');
  		
  		db.insert({'name':name},exceptional(function inserted(newDoc){
  			db.find({},
  				then(function found(docs){
  					console.log(docs);
  				})
  				.or(function notFound(err){
  					console.log(err);
  				})
  			);
  		}));
  	}));
  }));
});
```
