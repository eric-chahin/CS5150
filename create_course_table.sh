 #!/usr/bin/env bash
../../bin/mysql -e 'DROP TABLE IF EXISTS test.courses'
../../bin/mysql -e 'CREATE TABLE courses(
  course_listing VARCHAR(30) PRIMARY KEY,
  title          VARCHAR(255)   NOT NULL,
  credits        VARCHAR(30)    NOT NULL,
  seasons        VARCHAR(127)   NOT NULL,
  arts_tags      VARCHAR(127)   NOT NULL,
  prerequisites  TEXT           NOT NULL,
  description    TEXT           NOT NULL
  )' test
../../bin/mysqlimport --fields-terminated-by=\;\;\; --local test data/courses.csv
../../bin/mysql -e 'SELECT * FROM courses' test