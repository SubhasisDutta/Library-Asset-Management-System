angular.module('app').controller('mvFineListCtrl', function($scope, $location,$resource,mvNotifier) {
  $scope.fines = $resource("/api/fines").query();

  $scope.sortOptions = [{value:"-fine_amount",text: "Sort by Fine Due"},
                        {value:"loan_id",text: "Sort by Loan"},
                        {value:"isbn",text: "Sort by Book ISBN"},
                        {value:"branch_id",text: "Sort by Branch"},
                        {value:"-card_no",text: "Sort by Card No"},
                        {value:"date_out",text: "Sort by Date Taken"},
                        {value:"due_date",text: "Sort by Due Date"},
                        {value:"date_in",text: "Sort by Date Returned"}];
  $scope.sortOrder = $scope.sortOptions[0].value;

  $scope.updateFines = function(){
    var add_borrower = $resource("/api/updateFines");
    var response = add_borrower.save({},function(){
      console.log(response);
      mvNotifier.notify(response.status);
      $location.url('/');
    });
  };
  $scope.goToFinePayment = function(){
    $location.url('/fines/payment');
  };
});