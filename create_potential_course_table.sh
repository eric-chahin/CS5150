 #!/usr/bin/env bash
../../bin/mysql -e 'DROP TABLE IF EXISTS test.potential_courses'
../../bin/mysql -e 'CREATE TABLE potential_courses(
  course_listing VARCHAR(30) PRIMARY KEY
  )' test
../../bin/mysqlimport --fields-terminated-by=, --local test data/potential_courses.csv
../../bin/mysql -e 'SELECT * FROM potential_courses' test