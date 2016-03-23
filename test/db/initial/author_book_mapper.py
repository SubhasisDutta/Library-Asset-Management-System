# This file is used to parse the book.csv file and generate the books_new.csv, authors.csv and book_authors.csv
#Author : Subhasis Dutta

import sys
from datetime import datetime
import csv
import re

def main():
    input_file = "books.csv"
    output_books = "books_new.csv"
    output_authors = "authors.csv"
    output_book_author_map = "book_authors.csv"
    count = 0
    authors = {}
    author_count = 0
    parse_firs_line = True
    output_books_stream = csv.writer(open(output_books, 'wb'))
    output_authors_stream = csv.writer(open(output_authors, 'wb'))
    output_book_author_map_stream = csv.writer(open(output_book_author_map, 'wb'))
    with open(input_file) as input_stream:
        for line in input_stream:
            line=line[:-1]
            count += 1
            input_str = line.split("\t")
            book_line = []
            author_line = []
            book_author_map = []
            if parse_firs_line:
                book_line = ['isbn', 'title', 'isbn13', 'cover', 'publisher', 'pages']
                author_line = ['author_id', 'fullname', 'title', 'fname', 'mname', 'lname', 'suffix']
                book_author_map = ["isbn", "author_id"]
                output_books_stream.writerow(book_line)
                output_authors_stream.writerow(author_line)
                output_book_author_map_stream.writerow(book_author_map)
                parse_firs_line = False
            else:
                # parse and add book
                book_line = [input_str[0], input_str[2], input_str[1], input_str[4], input_str[5], input_str[6]]
                if len(book_line)>0:
                    output_books_stream.writerow(book_line)
                # for author check in author map if not present then only add
                book_authors = re.split("&amp;|,", input_str[3])
                tmp_set=set(book_authors)
                book_authors=list(tmp_set)
                for author in book_authors:
                    if author in authors:
                        pass
                    else:
                        author_count += 1
                        author = author.strip()
                        authors[author] = author_count
                        tokens = author.split(' ')
                        if len(tokens) == 1:
                            author_line = [author_count, author, '', '', '', tokens[0], '']
                        elif len(tokens) == 2:
                            author_line = [author_count, author, '', tokens[0], '', tokens[-1], '']
                        elif len(tokens) == 3:
                            author_line = [author_count, author, '', tokens[0], tokens[1], tokens[-1], '']
                        else:
                            author_line = [author_count, author, '', tokens[0], tokens[1]+' '+tokens[2], tokens[-1], '']
                        if len(author_line) > 0:
                            output_authors_stream.writerow(author_line)
                    author_id = authors.get(author)
                    book_author_map = [input_str[0],author_id]
                    if len(book_author_map) > 0:
                        output_book_author_map_stream.writerow(book_author_map)
    print "Processed Records:",count

if __name__ == "__main__":
    print "Starting @ ", str(datetime.now())
    main()
    print "Finished @ ", str(datetime.now())