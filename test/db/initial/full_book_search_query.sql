CREATE VIEW BOOK_SEARCH_VIEW AS
SELECT book_branchView.isbn,book_branchView.title,book_branchView.author_name, book_branchView.branch_id,book_branchView.branch_name, book_branchView.no_of_copies,
		IFNULL(book_branchView.no_of_copies - bookloan.checkin , book_branchView.no_of_copies) as no_of_available_copies
FROM
	(SELECT book_authorview.isbn,book_authorview.title,book_authorview.author_name, lb.branch_id,lb.branch_name, bc.no_of_copies 
	 FROM 
		(SELECT b.isbn,b.title,GROUP_CONCAT(concat(a.title,' ',a.fname,' ',a.mname,' ',a.lname,' ',a.suffix)) as author_name
			FROM BOOK as b,BOOK_AUTHORS as ba, AUTHORS as a
			WHERE b.isbn=ba.isbn AND ba.author_id=a.author_id
			GROUP BY b.isbn) as book_authorview,
		 LIBRARY_BRANCH as lb,BOOK_COPIES as bc 
		 WHERE book_authorview.isbn=bc.book_id AND bc.branch_id = lb.branch_id) as book_branchView 
		LEFT JOIN
        (SELECT isbn, branch_id, COUNT(*) as checkin FROM book_loans 
			WHERE (book_loans.date_in IS NULL OR book_loans.date_in='0000-00-00') 
			GROUP BY book_loans.isbn , book_loans.branch_id) as bookloan 
      ON (book_branchView.isbn = bookloan.isbn AND book_branchView.branch_id = bookloan.branch_id);
#WHERE books.isbn LIKE '%$bookid%' AND books.title LIKE '%$title%' AND books.author_name LIKE '%$author%'
