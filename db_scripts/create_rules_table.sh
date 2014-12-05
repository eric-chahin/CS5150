 #!/usr/bin/env bash
mysql -e 'DROP TABLE IF EXISTS checklistinteractive.checklist_rules'
mysql -e 'CREATE TABLE checklist_rules(
  version VARCHAR(30) NOT NULL,
  header VARCHAR(128) NOT NULL,
  excel_cell VARCHAR(10) NOT NULL,
  slot_count VARCHAR(30) NOT NULL,
  title VARCHAR(127) NOT NULL,
  tag VARCHAR(255) NOT NULL
  )' -u checklist -pzOPukWdPDt checklistinteractive
../../mysql/bin/mysqlimport --fields-terminated-by=, --local -u checklist -pzOPukWdPDt checklistinteractive data/checklist_rules.csv
../../mysql/bin/mysql -e 'SELECT * FROM checklist_rules' -u checklist -pzOPukWdPDt checklistinteractive
