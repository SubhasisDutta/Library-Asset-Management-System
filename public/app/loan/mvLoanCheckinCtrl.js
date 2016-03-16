angular.module('app').controller('mvLoanCheckinCtrl', function($scope,$routeParams,$resource,$location,mvNotifier) {
  var books = $resource("/api/book/:_id");
  $scope.book = books.get({_id: $routeParams.isbn});
  var loan = $resource("/api/loan/available/:isbn/:branch_id/:card_no");
  $scope.available_loan=loan.get({isbn:$routeParams.isbn,branch_id:$routeParams.branch_id,card_no:$routeParams.card_no});
  var dateObj=new Date();
  $scope.date_in= dateObj.getFullYear()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate();

  $scope.checkInBook = function(date_in){
      //console.log($scope.date_in);
      //console.log(date_in);
      var check_out_res = $resource("/api/loan/checkin");
      var response = check_out_res.save({isbn:$routeParams.isbn,branch_id:$routeParams.branch_id,card_no:$routeParams.card_no,date_in:date_in,loan_id:$scope.available_loan.loan_id},function(){
          console.log(response);
          mvNotifier.notify(response.status);
          $scope.available_loan=loan.get({isbn:$routeParams.isbn,branch_id:$routeParams.branch_id,card_no:$routeParams.card_no});

      });
  };


});