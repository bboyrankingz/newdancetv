var app = angular.module("newdancetv", ['ngRoute', 'infinite-scroll']);

app.controller("Videos", function($scope, $http, requester) {

  var i = 0;
  var k=0;
  var channels = ["ProDance TV", "TVlilou", "OckeFilms", "The Legits", "stance"];
  $scope.tv = {}

  $http.get('http://bboyrankingz.com/footage/list/.json?submitted_by__groups__name=newdancetv&referrer=newdance.tv').
    success(function(data, status, headers, config) {
      $scope.tv["NewDanceTV Choices"] = data.results;
    });

  $http.get('http://bboyrankingz.com/footage/list/.json?submitted_by__groups__name=n&referrer=newdance.tv').
    success(function(data, status, headers, config) {
      $scope.tv["User videos"] = data.results;
    });

  $scope.loadMore = function() {
     if(channels.length >0)
     {
        channel = channels.shift()
        requester.getData('http://bboyrankingz.com/footage/list/.json?channel_title=' + channel, channel)
        .then(function(result) {  // this is only run after $http completes
          $scope.tv[result[1]] = result[0];
        });
     }
  };

  $scope.push = function(){
      $http.defaults.xsrfCookieName = 'csrftoken';
      $http.defaults.xsrfHeaderName = 'X-CSRFToken';

      console.log($http.defaults.xsrfCookieName);

      $http({
          url: 'http://bboyrankingz.com/footage/list/.json',
          data:  {'url': $scope.form_url, "referrer": "newdance.tv"},
          method: 'POST'
        }).
        success(function(data) {
            console.log(data);
            window.location.href = '/footage/' + data["results"][0]["id"];
        }).
        error(function(data) {
        });

  };


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





