var app = angular.module('myApp', ['ngTable']);
(function() {
  app.controller("demoController", demoController);
  demoController.$inject = ["NgTableParams", '$http', '$scope'];
  

  function demoController(NgTableParams, $http, $scope)
  {
  
  $http.get("http://185.81.113.164:9999/api/list")
		.success(function(data, status, headers, config)
		{
	       		//console.log ("data:", data);
	       		//console.log ("$scope:", $scope);
	       		
	       		$scope.tableParams = new NgTableParams({
			      page: 1, // show first page
			      count: 10, // count per page
			      sorting: {'id': "desc"}
			    },
			    {
			      filterDelay: 0,
			      data: data
			    });
			    
			    $scope.tableParams.reload();
			    
			    //console.log ("$scope.tableParams", $scope.tableParams);
		})
		.error(function(data, status, headers, config)
		{
			console.log ("error:", data);
		});
		
  
  $scope.reloadData = function ()
  {
  	   //console.log ("reload data");
  	   
	   $http.get("http://185.81.113.164:9999/api/list")
		.success(function(data, status, headers, config)
		{
	       		//console.log ("data:", data);
	       		//console.log ("$scope:", $scope);
	       		
	       		var page = $scope.tableParams.page ();
	       		var count = $scope.tableParams.count ();
	       		var filter = $scope.tableParams.filter ();
	       		var sorting = $scope.tableParams.sorting ();
	       		
	       		
	       		$scope.tableParams = new NgTableParams({
			      page: page,
			      count: count,
			      filter: filter,
			      sorting: sorting
			    },
			    {
			      filterDelay: 0,
			      data: data
			    });
		})
		.error(function(data, status, headers, config)
		{
			console.log ("error:", data);
		});
   }
   
   window.setInterval($scope.reloadData, 5*1000);
        
   //$scope.reloadData();
    
  }
})();
