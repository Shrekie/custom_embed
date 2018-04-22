app.factory('embedStream', function($http, $q) {

	var generateEmbed = function(url){
		var deferred = $q.defer();
        $http({
			url: 'generateEmbed',
			method: "POST",
			data: { YTURL : url }
		}).then(function (success) {
            console.log(success);
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

    return{
		generateEmbed, getUserEmbeds
	}

});