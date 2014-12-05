 #!/usr/bin/env bash
mysql -e 'DROP TABLE IF EXISTS checklistinteractive.checklist_tags'
mysql -e 'CREATE TABLE checklist_tags(
  version VARCHAR(30) NOT NULL,
  tag VARCHAR(30) NOT NULL,
  credits VARCHAR(30) NOT NULL,
  course_num VARCHAR(30) NOT NULL,
  forbidden VARCHAR(513) NOT NULL
  )' -u checklist -pzOPukWdPDt checklistinteractive
mysqlimport --fields-terminated-by=, --local -u checklist -pzOPukWdPDt checklistinteractive data/checklist_tags.csv
mysql -e 'SELECT * FROM checklist_tags' -u checklist -pzOPukWdPDt checklistinteractive
