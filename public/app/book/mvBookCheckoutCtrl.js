angular.module('app').controller('mvBookCheckoutCtrl', function($scope,$routeParams,$resource,$location,mvNotifier) {
  var books = $resource("/api/book/:_id");
  $scope.book = books.get({_id: $routeParams.isbn});
  var available_books = $resource("/api/book/available/:_id/:_branchId");
  $scope.available_book=available_books.get({_id:$routeParams.isbn,_branchId:$routeParams.branch_id});
  var borrowers = $resource("/api/borrower/names");
  $scope.borrowers = borrowers.query();

  $scope.checkOutBook = function(){
        if($scope.borrower_option == undefined){
            mvNotifier.notify("Please Select a Borrower before Check-Out.")
        }else{
            console.log($scope.borrower_option, $routeParams.isbn,$routeParams.branch_id);
            var check_out_res = $resource("/api/book/checkout");
            var response = check_out_res.save({isbn:$routeParams.isbn,branch_id:$routeParams.branch_id,card_no:$scope.borrower_option},function(){
                console.log(response);
                mvNotifier.notify(response.status);
                $scope.available_book=available_books.get({_id:$routeParams.isbn,_branchId:$routeParams.branch_id});
            });
        }
  };


});