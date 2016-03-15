/**
 * Created by Subhasis on 3/14/2016.
 */
angular.module('app').factory('mvCachedBranches', function(mvBranch) {
    var branchList;

    return {
        query: function() {
            if(!branchList) {
                branchList = mvBranch.query();
            }

            return branchList;
        }
    }
})