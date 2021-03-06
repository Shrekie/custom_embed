app.factory('embedAPI', function($http, $q) {

	var generateEmbed = function(url){
		var deferred = $q.defer();
		$http({
			url: 'generateEmbed',
			method: "POST",
			data: { YTURL : url }
		}).then(function (success) {
			deferred.resolve(success.data);
		}, function (error) {
			deferred.reject(error);
		});
      	return deferred.promise;
	}
	
	var getUserEmbeds = function(){
		var deferred = $q.defer();
		$http({
			url: 'getUserEmbeds',
			method: "GET",
		}).then(function (success) {
			deferred.resolve(success.data);
		}, function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	var editUserEmbed = function(videoID, configOptions){
		var deferred = $q.defer();
		$http({
			url: 'changeConfig',
			method: "POST",
			data: { 
				id:videoID,
				configOptions:configOptions
			}
		}).then(function (success) {
			deferred.resolve(success.data);
		}, function (error) {
			deferred.reject(error);
		});
      	return deferred.promise;
	}

	var deleteUserEmbed = function(videoID){
		var deferred = $q.defer();
		$http({
			url: 'deleteEmbed',
			method: "POST",
			data: { id : videoID }
		}).then(function (success) {
			deferred.resolve(success.data);
		}, function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	}

    return{
		generateEmbed, getUserEmbeds, deleteUserEmbed, editUserEmbed
	}

});