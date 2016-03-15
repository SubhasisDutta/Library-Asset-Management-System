angular.module('app').controller('mvBookDetailCtrl', function($scope,$routeParams,$resource) {
  var books = $resource("/api/book/:_id");
  $scope.book = books.get({_id: $routeParams.id});
});