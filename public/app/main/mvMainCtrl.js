angular.module('app').controller('mvMainCtrl', function($scope, mvCachedBranches) {
  //$scope.courses = mvCachedCourses.query();
  $scope.branches =mvCachedBranches.query();
});