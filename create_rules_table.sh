 #!/usr/bin/env bash
../../mysql/bin/mysql -e 'DROP TABLE IF EXISTS test.checklist_rules'
../../mysql/bin/mysql -e 'CREATE TABLE checklist_rules(
  version VARCHAR(30) NOT NULL,
  header VARCHAR(128) NOT NULL,
  excel_cell VARCHAR(10) NOT NULL,
  slot_count VARCHAR(30) NOT NULL,
  title VARCHAR(127) NOT NULL,
  tag VARCHAR(255) NOT NULL
  )' test
../../mysql/bin/mysqlimport --fields-terminated-by=, --local test data/checklist_rules.csv
../../mysql/bin/mysql -e 'SELECT * FROM checklist_rules' test
