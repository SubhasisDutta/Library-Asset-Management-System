#This is required for seaching books - this needs to be run as a part of Initial Script Run
CREATE VIEW book_authorview AS
SELECT b.isbn,b.title,GROUP_CONCAT(concat(a.title,' ',a.fname,' ',a.mname,' ',a.lname,' ',a.suffix)) as author_name
FROM BOOK as b,BOOK_AUTHORS as ba, AUTHORS as a
WHERE b.isbn=ba.isbn AND ba.author_id=a.author_id
GROUP BY b.isbn;

CREATE VIEW book_branchView AS
SELECT book_authorview.isbn,book_authorview.title,book_authorview.author_name, lb.branch_id,lb.branch_name, bc.no_of_copies 
FROM book_authorview,LIBRARY_BRANCH as lb,BOOK_COPIES as bc 
WHERE book_authorview.isbn=bc.book_id AND bc.branch_id = lb.branch_id;

CREATE VIEW book_loanview AS 
SELECT isbn, branch_id, COUNT(*) as checkin FROM book_loans 
WHERE (book_loans.date_in IS NULL OR book_loans.date_in='0000-00-00') 
GROUP BY book_loans.isbn , book_loans.branch_id;

CREATE VIEW BOOK_SEARCH_VIEW AS
SELECT book_branchView.isbn,book_branchView.title,book_branchView.author_name, book_branchView.branch_id,book_branchView.branch_name, book_branchView.no_of_copies,
		IFNULL(book_branchView.no_of_copies - book_loanview.checkin , book_branchView.no_of_copies) as no_of_available_copies
FROM book_branchView LEFT JOIN book_loanview
ON (book_branchView.isbn = book_loanview.isbn AND book_branchView.branch_id = book_loanview.branch_id);

CREATE VIEW BOOK_LOAN_SEARCH_VIEW AS
SELECT CONCAT(bor.fname,' ',bor.lname) as name,bl.isbn,bl.card_no,bl.branch_id,bl.date_out,bl.due_date 
FROM book_loans bl INNER JOIN borrower bor ON bl.card_no=bor.card_no 
WHERE (bl.date_in='0000-00-00' or bl.date_in is null) ORDER BY bor.fname;