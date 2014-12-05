 #!/usr/bin/env bash
mysql -e 'DROP TABLE IF EXISTS checklistinteractive.checklist_vectors'
mysql -e 'CREATE TABLE checklist_vectors(
  version VARCHAR(30) NOT NULL,
  title VARCHAR(128) NOT NULL,
  slot_count VARCHAR(30) NOT NULL,
  allowed TEXT NOT NULL,
  forbidden TEXT NOT NULL
  )' -u checklist -pzOPukWdPDt checklistinteractive
../../mysql/bin/mysqlimport --fields-terminated-by=, --local -u checklist -pzOPukWdPDt checklistinteractive data/checklist_vectors.csv
../../mysql/bin/mysql -e 'SELECT * FROM checklist_vectors' -u checklist -pzOPukWdPDt checklistinteractive