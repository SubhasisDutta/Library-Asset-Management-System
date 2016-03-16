angular.module('app').controller('mvLoanSearchListCtrl', function($scope,$http,$location,mvNotifier) {
  //$scope.bookSarch = [];

  $scope.searchLoans = function(){
    var seachParams={
      search:$scope.search_string,
      option:$scope.search_option
    };
    var config = {
      params: seachParams,
      headers : {'Accept' : 'application/json'}
    };
    $http.get("/api/loan/",config).then(function(response) {
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
                        {value: "card_no",text: "Sort by Borrower Card No"},
                        {value: "name",text: "Sort by Borrower Name"}];
  $scope.search_option = $scope.searchOptions[0].value;


  $scope.goToCheckIn = function(isbn,card_no,branch_id){
    $location.url('/loan/checkin/'+isbn+'/'+branch_id+'/'+card_no);
  };
});