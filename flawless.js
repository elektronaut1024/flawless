function then(continuation){
	function callback(err){
		if ( err ) {
			if ( callback.abortion ) {
				callback.abortion(err);
			}
		} else if ( continuation ) {
			continuation.apply(callback,Array.prototype.slice.call(arguments,1));
		}
	}
	
	callback.or = function(abortion){
		callback.abortion = abortion;
		
		return callback;
	};
	
	return callback;
}

module.exports = {
	'then': then
};