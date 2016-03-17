angular.module('app').controller('mvSignupBorrowerCtrl', function($scope, $resource,mvNotifier, $location) {

  $scope.signup = function() {
    var add_borrower = $resource("/api/borrower");
    var response = add_borrower.save({borrower:$scope.borrower},function(){
      console.log(response);
      mvNotifier.notify(response.status);
      $location.url('/borrower');
    });
  }
})