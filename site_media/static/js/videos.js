var app = angular.module("newdancetv", ['ngRoute', 'infinite-scroll', 'ngCookies']);

app.controller("Videos", function($scope, $http, $cookies, requester, Reddit) {

  var channels = ["ProDance TV", "TVlilou", "OckeFilms", "The Legits", "stance", "allthatbreak"];
  var token = "";
  $scope.username = $cookies.get('username')
  $scope.tv = {}
  load_users_videos();

  $scope.loadMore = function() {
     if(channels.length >0)
     {
        channel = channels.shift()
        requester.getData('https://bboyrankingz.com/footage/list/.json?channel_title=' + channel, channel)
        .then(function(result) {  // this is only run after $http completes
          $scope.tv[result[1]] = result[0];
        });
     }
  };

  $scope.login = function(){
      $http({
          url: 'https://bboyrankingz.com/api-token-auth/',
          data:  {'username': $scope.username_modal, "password": $scope.password_modal},
          method: 'POST'
        }).
        success(function(data) {
            $cookies.put('Token', 'Token ' + data["token"]);
            $cookies.put('username', $scope.username_modal);
            $scope.username = $scope.username_modal;
            $('#login-modal').modal('hide');
        }).
        error(function(data) {
          alert("error... This message will be better later")
        });

  };

  $scope.logout = function(){
    $cookies.remove('Token');
    $cookies.remove('username');
    $scope.username = ""
  };

  $scope.push = function(){
      $http.defaults.headers.common['Authorization'] = $cookies.get("Token");
      $http({
          url: 'https://bboyrankingz.com/footage/list/.json',
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

  $scope.remove = function(id){
      $http.defaults.headers.common['Authorization'] = $cookies.get("Token");
      $http({
          url: 'https://bboyrankingz.com/footage/' + id + '/',
          method: 'DELETE'
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
    $http.get('https://bboyrankingz.com/footage/list/.json?submitted_by__groups__name=newdancetv&referrer=newdance.tv').
      success(function(data, status, headers, config) {
        $scope.tv["NewDanceTV Choices"] = data.results;
      });

    // $http.get('http://bboyrankingz.com/footage/list/.json?submitted_by__groups__name=none&referrer=newdance.tv').
    //   success(function(data, status, headers, config) {
    //     $scope.tv["User videos"] = data.results;
    //   });

    $scope.reddit = new Reddit('https://bboyrankingz.com/footage/list/.json?submitted_by__groups__name=newdancetv&referrer=newdance.tv');
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

// Reddit constructor function to encapsulate HTTP and pagination logic
app.factory('Reddit', function($http) {
  var Reddit = function($url) {
    this.items = [];
    this.busy = false;
    this.after = $url;
  };

  Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    if (this.after == null) return;
    this.busy = true;

    var url = this.after;
      $http.get(url).success(function(data) {
        var items = data.results;
        for (var i = 0; i < items.length; i++) {
          this.items.push(items[i]);
        }
        this.after = data.next;
        this.busy = false;
      }.bind(this));
    
  };

  return Reddit;
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
  .when('/manage', {
    templateUrl: 'manage.html',
    controller: 'Videos'
  })
  .otherwise({redirectTo: '/home'});
});





