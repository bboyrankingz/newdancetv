var app = angular.module("newdancetv", ['ngRoute', 'infinite-scroll']);

app.controller("Videos", function($scope, $http, requester) {

  var i = 0;
  var k=0;
  var channels = ["ProDance TV", "TVlilou", "OckeFilms", "The Legits", "stance"];
  $scope.tv = {}
  $scope.loadMore = function() {
     if(channels.length >0)
     {
        channel = channels.shift()
        requester.getData('http://bboyrankingz.com/footage/list/.json?channel_title=' + channel, channel)
        .then(function(result) {  // this is only run after $http completes
          $scope.tv[result[1]] = result[0];
        });
     }
  }
});

app.factory('requester', function($http) {

    var getData = function($url, $title) {

        return $http({method:"GET", url:$url}).then(function(result){
            return [result.data.results, $title];
        });
    };
    return { getData: getData };
});


app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/home', {
    templateUrl: 'home.html',
    controller: 'Videos'
  })
  .when('/about', {
    templateUrl: 'about.html',
    controller: 'Videos'
  })
  .otherwise({redirectTo: '/home'});
});





