var auth = require('./auth'),
  users = require('../controllers/users'),
  courses = require('../controllers/courses'),
    branches = require('../controllers/branches'),
    search_book = require('../controllers/searchBook'),
    borrowers = require('../controllers/borrowers'),
    loans=require('../controllers/searchLoan'),
    fines=require('../controllers/fines'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function(app) {

  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  app.post('/api/users', users.createUser);
  app.put('/api/users', users.updateUser);

  app.get('/api/courses', courses.getCourses);
  app.get('/api/courses/:id', courses.getCourseById);

  app.get('/api/branches',branches.getBranches);

  app.get('/api/search',search_book.getBookSearch);
  app.get('/api/book/:id', search_book.getBookById);
  app.get('/api/book/available/:id/:branchId',search_book.getBookByIdBranchID);
  app.post('/api/book/checkout',borrowers.checkoutBook);

  app.get('/api/loan',loans.getLoanSearch);
  app.get('/api/loan/available/:isbn/:branch_id/:card_no',loans.getLoanById);
  app.post('/api/loan/checkin',loans.checkInBook);

  app.get('/api/borrower/names', borrowers.getBorrowerList);
  app.get('/api/borrower/top/:no', borrowers.getTopBorrowerList);
  app.post('/api/borrower', borrowers.createBorrower);

  app.post('/api/updateFines',fines.updateFines);
  app.get('/api/fines',fines.getFines);

  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/' + req.params[0]);
  });

  app.post('/login', auth.authenticate);

  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });

  app.all('/api/*', function(req, res) {
    res.send(404);
  });

  app.get('*', function(req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
};