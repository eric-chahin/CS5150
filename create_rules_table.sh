 #!/usr/bin/env bash
../../bin/mysql -e 'DROP TABLE IF EXISTS test.checklist_rules'
../../bin/mysql -e 'CREATE TABLE checklist_rules(
  version VARCHAR(30) NOT NULL,
  slot_count VARCHAR(30) NOT NULL,
  title VARCHAR(127) NOT NULL,
  tag VARCHAR(255) NOT NULL
  )' test
../../bin/mysqlimport --fields-terminated-by=, --local test data/checklist_rules.csv
../../bin/mysql -e 'SELECT * FROM checklist_rules' test
