import mysql.connector
from datetime import datetime
import csv

class MySqlManager(object):
    '''
    This class takes care of writing the results into a mysql table.
    '''
    def __init__(self,config_dict):
        '''
        Constructor
        '''
        self.username="root"
        self.password="root"
        self.schema=config_dict["output_schema"]
        self.resultTable = config_dict["output_table"]
        self.batchSize = config_dict["batch_size"]
        self.cluster = ["localhost"]
        self.connection = mysql.connector.connect(host=self.cluster[0],
                        user = self.username,
                        passwd = self.password,
                        db = self.schema)
        self.dbColumnList = config_dict["column_name"].split(',')
        self.insertPoints = self.getInsertPointString()
        self.insertBatch = []
        self.batchCount = 0
        columnstr = ','.join(self.dbColumnList)
        self.insertQuery='INSERT INTO '+self.resultTable+' ('+columnstr+') VALUES ('+self.insertPoints+')'

    def getInsertPointString(self):
        insertPoints=''
        for i in range(len(self.dbColumnList)):
            insertPoints += "%s,"
        return insertPoints[:-1]

    def push(self, dataList, writeType='ab'):
        return self.batchQuery(self.insertQuery, dataList)

    def batchQuery(self, statement, dataList):
        if self.batchCount < self.batchSize:
            self.insertBatch.append(tuple(dataList))
            self.batchCount += 1
        else:
            self.insertBatch.append(tuple(dataList))
            cursor=self.connection.cursor()
            cursor.executemany(self.insertQuery,self.insertBatch)
            self.batchCount = 0
            self.connection.commit()
            self.insertBatch = []
        return True

    def flushBatch(self):
        cursor=self.connection.cursor()
        cursor.executemany(self.insertQuery,self.insertBatch)
        self.batchCount =0
        self.connection.commit()
        self.insertBatch= []
        return True

def insert_books():
    input_file = "books_new.csv"
    parse_first_line = True
    config_dict={"output_table": "book",
                 "batch_size": 1000,
                 "output_schema": "library",
                 "column_name": "isbn,title,isbn13,cover,publisher,pages"
                 }
    manager = MySqlManager(config_dict)
    count = 0
    with open(input_file, 'rb') as csvfile:
        data_reader = csv.reader(csvfile, delimiter=',')
        for row in data_reader:
            if parse_first_line:
                parse_first_line= False
            else:
                row[-1] = int(row[-1])
                manager.push(row)
                count += 1
        manager.flushBatch()
    print "Inserted Records INTO BOOK : ", count


def inset_authors():
    input_file = "authors.csv"
    parse_first_line = True
    config_dict={"output_table": "authors",
                 "batch_size": 1000,
                 "output_schema": "library",
                 "column_name": "author_id,title,fname,mname,lname,suffix"
                 }
    manager = MySqlManager(config_dict)
    count = 0
    with open(input_file, 'rb') as csvfile:
        data_reader = csv.reader(csvfile, delimiter=',')
        for row in data_reader:
            if parse_first_line:
                parse_first_line= False
            else:
                row[0] = int(row[0])
                manager.push(row)
                count += 1
        manager.flushBatch()
    print "Inserted Records INTO AUTHORS : ", count

def inset_authors_book_map():
    input_file = "book_authors.csv"
    parse_first_line = True
    config_dict={"output_table": "book_authors",
                 "batch_size": 2000,
                 "output_schema": "library",
                 "column_name": "isbn,author_id"
                 }
    manager = MySqlManager(config_dict)
    count = 0
    with open(input_file, 'rb') as csvfile:
        data_reader = csv.reader(csvfile, delimiter=',')
        for row in data_reader:
            if parse_first_line:
                parse_first_line= False
            else:
                row[1] = int(row[1])
                manager.push(row)
                count += 1
        manager.flushBatch()
    print "Inserted Records INTO BOOK_AUTHORS : ", count

def inset_library_branch():
    input_file = "library_branch.csv"
    parse_first_line = True
    config_dict={"output_table": "library_branch",
                 "batch_size": 5,
                 "output_schema": "library",
                 "column_name": "branch_id,branch_name,address"
                 }
    manager = MySqlManager(config_dict)
    count = 0
    with open(input_file, 'rb') as csvfile:
        data_reader = csv.reader(csvfile, delimiter='\t')
        for row in data_reader:
            if parse_first_line:
                parse_first_line= False
            else:
                row[0] = int(row[0])
                manager.push(row)
                count += 1
        manager.flushBatch()
    print "Inserted Records INTO LIBRARY BRANCH : ", count

def inset_book_copies():
    input_file = "book_copies.csv"
    parse_first_line = True
    config_dict={"output_table": "book_copies",
                 "batch_size": 2000,
                 "output_schema": "library",
                 "column_name": "book_id,branch_id,no_of_copies"
                 }
    manager = MySqlManager(config_dict)
    count = 0
    with open(input_file, 'rb') as csvfile:
        data_reader = csv.reader(csvfile, delimiter='\t')
        for row in data_reader:
            if parse_first_line:
                parse_first_line= False
            else:
                row[1] = int(row[1])
                row[2] = int(row[2])
                manager.push(row)
                count += 1
        manager.flushBatch()
    print "Inserted Records INTO BOOK COPIES : ", count

def inset_borrower():
    input_file = "borrowers.csv"
    parse_first_line = True
    config_dict={"output_table": "borrower",
                 "batch_size": 200,
                 "output_schema": "library",
                 "column_name": "card_no,ssn,fname,lname,email,address,city,state,phone"
                 }
    manager = MySqlManager(config_dict)
    count = 0
    with open(input_file, 'rb') as csvfile:
        data_reader = csv.reader(csvfile, delimiter=',')
        for row in data_reader:
            if parse_first_line:
                parse_first_line= False
            else:
                manager.push(row)
                count += 1
        manager.flushBatch()
    print "Inserted Records INTO BORROWER : ", count



def inset_book_loans():
    input_file = "book_loans.csv"
    config_dict={"output_table": "book_loans",
                 "batch_size": 200,
                 "output_schema": "library",
                 "column_name": "loan_id,isbn,branch_id,card_no,date_out,due_date,date_in"
                 }
    manager = MySqlManager(config_dict)
    count = 0
    with open(input_file, 'rb') as csvfile:
        data_reader = csv.reader(csvfile, delimiter='\t')
        for row in data_reader:
           row[0] = int(row[0])
           row[2] = int(row[2])
           row[4] = datetime.strptime(row[4], "%Y-%m-%d").date()
           row[5] = datetime.strptime(row[5], "%Y-%m-%d").date()
           row[6] = datetime.strptime(row[6], "%Y-%m-%d").date()
           manager.push(row)
           count += 1
        manager.flushBatch()
    print "Inserted Records INTO BOOK LOANS : ", count

if __name__ == "__main__":
    print "Starting @ ", str(datetime.now())
    insert_books()
    inset_authors()
    inset_authors_book_map()
    inset_library_branch()
    inset_book_copies()
    inset_borrower()
    inset_book_loans()
    print "Finished @ ", str(datetime.now())
