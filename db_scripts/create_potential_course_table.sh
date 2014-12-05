 #!/usr/bin/env bash
mysql -e 'DROP TABLE IF EXISTS checklistinteractive.potential_courses'
mysql -e 'CREATE TABLE potential_courses(
  course_listing VARCHAR(30) PRIMARY KEY
  )' -u checklist -pzOPukWdPDt checklistinteractive
mysqlimport --fields-terminated-by=, --local -u checklist -pzOPukWdPDt checklistinteractive data/potential_courses.csv
mysql -e 'SELECT * FROM potential_courses' -u checklist -pzOPukWdPDt checklistinteractive