angular.module('app').factory('mvBranch', function($resource) {
    var BranchResource = $resource('/api/branches/:_id', {_id: "@id"}, {
        update: {method:'PUT', isArray:false}
    });

    return BranchResource;
});