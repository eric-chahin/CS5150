 #!/usr/bin/env bash
mysql -e 'DROP TABLE IF EXISTS checklistinteractive.courses'
mysql -e 'CREATE TABLE courses(
  course_listing VARCHAR(30) PRIMARY KEY,
  title          VARCHAR(255)   NOT NULL,
  credits        VARCHAR(30)    NOT NULL,
  seasons        VARCHAR(127)   NOT NULL,
  arts_tags      VARCHAR(127)   NOT NULL,
  prerequisites  TEXT           NOT NULL,
  crosslists     VARCHAR(255)   NOT NULL,
  description    TEXT           NOT NULL
  )' -u checklist -pzOPukWdPDt checklistinteractive
mysqlimport --fields-terminated-by=\;\;\; --local -u checklist -pzOPukWdPDt checklistinteractive data/courses.csv
mysql -e 'SELECT * FROM courses' -u checklist -pzOPukWdPDt checklistinteractive