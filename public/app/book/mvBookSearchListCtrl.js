angular.module('app').controller('mvBookSearchListCtrl', function($scope,$http,mvNotifier) {
  $scope.bookSarch = [];

  $scope.searchBook = function(){
    var seachParams={
      search:$scope.search_string,
      option:$scope.search_option
    };
    var config = {
      params: seachParams,
      headers : {'Accept' : 'application/json'}
    };
    $http.get("/api/search/",config).then(function(response) {
      $scope.bookSarch = response.data;
      if($scope.bookSarch.length == 0){
        mvNotifier.notify("No Search result was found for the Query.");
      }else{
        mvNotifier.notify($scope.bookSarch.length+" search results found");
      }
    });


  };

  $scope.searchOptions = [{value:"all",text: "Search By All"},
                        {value: "isbn",text: "Sort by Book ISBN"},
                        {value: "booktitle",text: "Sort by Book Title"},
                        {value: "author",text: "Sort by Author Name"}];
  $scope.search_option = $scope.searchOptions[0].value;
});