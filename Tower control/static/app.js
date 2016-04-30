var app = angular.module('myApp', ['ngTable']);
(function() {
  app.controller("demoController", demoController);
  demoController.$inject = ["NgTableParams", '$http', '$scope'];


  function demoController(NgTableParams, $http, $scope)
  {

    $scope.refreshRunways = function()
    {
      $http.get("/api/listRunways")
    		.success(function(data, status, headers, config)
    		{
    	       		console.log ("data:", data);

                $scope.runways = data;

    			      reloadTableRunways($scope.runways);
    		})
    		.error(function(data, status, headers, config)
    		{
    			console.log ("error:", data);
    		});
    }

    $scope.refreshRunways ();

    var reloadTableRunways = function (data)
    {
        $scope.tableParamsRunways = new NgTableParams({}, { dataset: data});
    }


    $scope.deleteRunway = function (id)
    {
      swal(
      {
          title: "Delete runway?",
          text: "Do you want to continue?",
          type: "info",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
        function()
        {
          $http.get("/api/deleteRunway/" + id)
            .success(function(data, status, headers, config)
            {
                    $scope.runways = $scope.runways.filter(function (row)
                    {
                        return row.id != id;
                    });

                    reloadTableRunways ($scope.runways);
                    $scope.tableParamsRunways.reload();
                    swal("Deleted!");
            })
            .error(function(data, status, headers, config)
            {
              console.log ("error:", data);
            });
        });
    }

    $scope.truncateRunways = function ()
    {
      swal(
      {
          title: "Truncate runway?",
          text: "Do you want to continue?",
          type: "info",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
        function()
        {

          $http.get("/api/truncateRunways")
            .success(function(data, status, headers, config)
            {
                    swal("Truncated!");
            })
            .error(function(data, status, headers, config)
            {
              console.log ("errorrr:", data);
            });

        });
    }

    $scope.truncateParkings = function ()
    {
      swal(
      {
          title: "Truncate parkings?",
          text: "Do you want to continue?",
          type: "info",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
        function()
        {

          $http.get("/api/truncateParkings")
            .success(function(data, status, headers, config)
            {
                    swal("Truncated!");
            })
            .error(function(data, status, headers, config)
            {
              console.log ("errorrr:", data);
            });

        });
    }

    $scope.holdRunway = function(runwayID)
    {
      swal({
           title: "Input plane id!",
           text: null,
           type: "input",
           showCancelButton: true,
           closeOnConfirm: false,
           animation: "slide-from-top",
           inputPlaceholder: "Write something"
         },
         function(planeID)
         {
              if (planeID === false)
              {
                return false;
              }
              if (planeID === "")
              {
                swal.showInputError("You need to write something!");
                return false
              }

              planeID = parseInt(planeID);

              if (!Number.isInteger(planeID))
              {
                swal.showInputError("You need to write number!");
                return false
              }

              // do work
              $http.get("/api/holdRunway/" + runwayID + "/" + planeID);

              for(var i in $scope.runways)
              {
                if ($scope.runways[i]['id'] == runwayID)
                {
                  $scope.runways[i]['plane_id'] = planeID;
                }
              }

              reloadTableRunways ($scope.runways);

              $scope.tableParamsRunways.reload();

              swal("Nice!", null, "success");
          });
    }

    $scope.realizeRunway = function (runwayID)
    {
      swal(
      {
          title: "Realize runway?",
          text: "Do you want to continue?",
          type: "info",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
        function()
        {

          $http.get("/api/realizeRunway/" + runwayID)
            .success(function(data, status, headers, config)
            {
                    for(var i in $scope.runways)
                    {
                      if ($scope.runways[i]['id'] == runwayID)
                      {
                        $scope.runways[i]['plane_id'] = null;
                      }
                    }

                    reloadTableRunways ($scope.runways);
                    $scope.tableParamsRunways.reload();
                    swal("Deleted!");
            })
            .error(function(data, status, headers, config)
            {
              console.log ("errorrr:", data);
            });

        });
    }


    // parkings

      $scope.refreshParkings = function()
      {
        $http.get("/api/listParkings")
      		.success(function(data, status, headers, config)
      		{
      	       		console.log ("data:", data);

                  $scope.parkings = data;

      			      reloadTableParkings($scope.parkings);
      		})
      		.error(function(data, status, headers, config)
      		{
      			console.log ("error:", data);
      		});
      }

    $scope.refreshParkings();

    $scope.refreshInfo = function ()
    {
      $scope.refreshParkings();
      $scope.refreshRunways();
    }

    var reloadTableParkings = function (data)
    {
        $scope.tableParamsParkings = new NgTableParams({}, { dataset: data});
    }


    $scope.deleteParking = function (id)
    {
      swal(
      {
          title: "Delete parking?",
          text: "Do you want to continue?",
          type: "info",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
        function()
        {
          $http.get("/api/deleteParking/" + id)
            .success(function(data, status, headers, config)
            {
                    $scope.parkings = $scope.parkings.filter(function (row)
                    {
                        return row.id != id;
                    });

                    reloadTableParkings ($scope.parkings);
                    $scope.tableParamsParkings.reload();
                    swal("Deleted!");
            })
            .error(function(data, status, headers, config)
            {
              console.log ("error:", data);
            });
        });
    }

    $scope.holdParking = function(parkingID)
    {
      swal({
           title: "Input plane id!",
           text: null,
           type: "input",
           showCancelButton: true,
           closeOnConfirm: false,
           animation: "slide-from-top",
           inputPlaceholder: "Write something"
         },
         function(planeID)
         {
              if (planeID === false)
              {
                return false;
              }
              if (planeID === "")
              {
                swal.showInputError("You need to write something!");
                return false
              }

              planeID = parseInt(planeID);

              if (!Number.isInteger(planeID))
              {
                swal.showInputError("You need to write number!");
                return false
              }

              // do work
              $http.get("/api/holdParking/" + parkingID + "/" + planeID);

              for(var i in $scope.parkings)
              {
                if ($scope.parkings[i]['id'] == parkingID)
                {
                  $scope.parkings[i]['plane_id'] = planeID;
                }
              }

              reloadTableParkings ($scope.parkings);

              $scope.tableParamsParkings.reload();

              swal("Nice!", null, "success");
          });
    }


    $scope.realizeParking = function (parkingID)
    {
      swal(
      {
          title: "Realize parking?",
          text: "Do you want to continue?",
          type: "info",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
        function()
        {

          $http.get("/api/realizeParking/" + parkingID)
            .success(function(data, status, headers, config)
            {
                    for(var i in $scope.parkings)
                    {
                      if ($scope.parkings[i]['id'] == parkingID)
                      {
                        $scope.parkings[i]['plane_id'] = null;
                      }
                    }

                    reloadTableParkings ($scope.parkings);
                    $scope.tableParamsParkings.reload();
                    swal("Deleted!");
            })
            .error(function(data, status, headers, config)
            {
              console.log ("errorrr:", data);
            });

        });
    }
 }
})();
