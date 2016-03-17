angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: {auth: function(mvAuth) {
      return mvAuth.authorizeCurrentUserForRoute('admin')
    }},
    user: {auth: function(mvAuth) {
      return mvAuth.authorizeAuthenticatedUserForRoute()
    }}
  }

  $locationProvider.html5Mode(true);
  $routeProvider
      .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})
      .when('/admin/users', { templateUrl: '/partials/admin/user-list',
        controller: 'mvUserListCtrl', resolve: routeRoleChecks.admin
      })
      .when('/signup', { templateUrl: '/partials/account/signup',
        controller: 'mvSignupCtrl'
      })
      .when('/profile', { templateUrl: '/partials/account/profile',
        controller: 'mvProfileCtrl', resolve: routeRoleChecks.user
      })
      .when('/search', { templateUrl: '/partials/book/book-search-list',
          controller: 'mvBookSearchListCtrl'
      })
      .when('/book/:id', { templateUrl: '/partials/book/book-details',
          controller: 'mvBookDetailCtrl'
      })
      .when('/book/checkout/:isbn/:branch_id', { templateUrl: '/partials/book/checkout',
          controller: 'mvBookCheckoutCtrl'
      })
      .when('/loan', { templateUrl: '/partials/loan/loan-search-list',
          controller: 'mvLoanSearchListCtrl'
      })
      .when('/loan/checkin/:isbn/:branch_id/:card_no', { templateUrl: '/partials/loan/checkin',
          controller: 'mvLoanCheckinCtrl'
      })
      .when('/borrower', { templateUrl: '/partials/borrower/borrower-list',
          controller: 'mvBorrowerListCtrl'
      })
      .when('/borrower/create', { templateUrl: '/partials/borrower/borrower-create',
          controller: 'mvSignupBorrowerCtrl'
      })
      .when('/fines', { templateUrl: '/partials/courses/course-list',
          controller: 'mvCourseListCtrl'
      })
      .when('/courses', { templateUrl: '/partials/courses/course-list',
        controller: 'mvCourseListCtrl'
      })
      .when('/courses/:id', { templateUrl: '/partials/courses/course-details',
        controller: 'mvCourseDetailCtrl'
      })

});

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  })
})
