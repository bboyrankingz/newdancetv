var app = angular.module("newdancetv", ['ngRoute', 'infinite-scroll']);

app.controller("Videos", function($scope, $http, requester) {

  var channels = ["ProDance TV", "TVlilou", "OckeFilms", "The Legits", "stance"];
  var token = "";
  $scope.tv = {}
  load_users_videos();

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

  $scope.login = function(){
      $http({
          url: 'http://bboyrankingz.com/api-token-auth/',
          data:  {'username': $scope.username_modal, "password": $scope.password_modal},
          method: 'POST'
        }).
        success(function(data) {
            $http.defaults.headers.common['Authorization'] = 'Token ' + data["token"];
            $('#login-modal').modal('hide');
        }).
        error(function(data) {
          alert("error... This message will be better later")
        });

  };

  $scope.push = function(){
      $http({
          url: 'http://bboyrankingz.com/footage/list/.json',
          data:  {'url': $scope.form_url, "referrer": "newdance.tv"},
          method: 'POST'
        }).
        success(function(data) {
          load_users_videos();
        }).
        error(function(data) {
          //error but works ... use jsonp
          load_users_videos();
        });

  };

  function load_users_videos()
  {
    $http.get('http://bboyrankingz.com/footage/list/.json?submitted_by__groups__name=newdancetv&referrer=newdance.tv').
      success(function(data, status, headers, config) {
        $scope.tv["NewDanceTV Choices"] = data.results;
      });

    $http.get('http://bboyrankingz.com/footage/list/.json?submitted_by__groups__name=none&referrer=newdance.tv').
      success(function(data, status, headers, config) {
        $scope.tv["User videos"] = data.results;
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





