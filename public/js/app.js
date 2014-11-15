var dash = angular.module('dash',['ngRoute']);

dash.controller('UserCtrl',function($scope,$http){
	$scope.formData = {};
	$scope.sendUser = function(){
		console.log($scope.formData);
		var user = $scope.formData.email;
		$http.post('/api/setuser',$scope.formData)
			.success(function(data){
				console.log('success');
				window.location.replace('/dash');
			})
			.error(function(data){
				console.log("ERROR: "+ data);
			});
	}
	
});

dash.controller('DashCtrl',function($scope,$http){


});

/*
dash.controller('GymCtrl',function($scope,$http){
	$scope.formData = {};
	var get_url = '/api/gym'+ gym;
	$http.get(get_url)
		.success(function(data){
			$scope.gymData = data;
			console.log(data);
		})
		.error(function(data){
			console.log("ERROR: "+ data);
		});


});

dash.controller('AskCtrl',function($scope,$http){
	$scope.formData = {};
	$scope.askQuestion = function(){
		$http.post('/api/ask',$scope.formData)
			.success(function(data){
				window.location.replace("/questions");
				console.log(data);
			})
			.error(function(){
				console.log("ERROR: " + data);
			});
	};

});

dash.controller('QuesCtrl',function($scope,$http){
	var get_url = '/api/questions';
	$scope.formData = {};
	$http.get(get_url)
		.success(function(data){
			$scope.questions = data;
		})
		.error(function(data){
			console.log("ERROR: "+ data);
		});
	$scope.getQuestion = function(id){
		$scope.q_id = id;
		window.location.replace("/answer");
	}
	$scope.addAnswer = function(){
		$http.post('/api/answer',$scope.formData)
			.success(function(data){
				console.log(data);
			})
			.error(function(){
				console.log("ERROR: " + data);
			});
	}
});
*/
