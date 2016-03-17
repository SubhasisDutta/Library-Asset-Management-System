angular.module('app').controller('mvFinePaymentListCtrl', function($scope, $location,$resource) {
  $scope.fines = $resource("/api/fine/borrowers").query();

  $scope.sortOptions = [{value:"-total_fine",text: "Sort by Fine Due"},
                        {value:"card_no",text: "Sort by Card No"},
                        {value:"name",text: "Sort by Borrower Name"}];
  $scope.sortOrder = $scope.sortOptions[0].value;

  $scope.goToFines = function(){
    $location.url('/fines');
  };
});