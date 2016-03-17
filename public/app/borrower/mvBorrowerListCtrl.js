angular.module('app').controller('mvBorrowerListCtrl', function($scope, $resource) {

  var borrowers = $resource("/api/borrower/top/:no");
  $scope.borrowers  = borrowers.query({no: 25});


});