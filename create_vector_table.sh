 #!/usr/bin/env bash
../../mysql/bin/mysql -e 'DROP TABLE IF EXISTS test.checklist_vectors'
../../mysql/bin/mysql -e 'CREATE TABLE checklist_vectors(
  version VARCHAR(30) NOT NULL,
  title VARCHAR(128) NOT NULL,
  slot_count VARCHAR(30) NOT NULL,
  allowed TEXT NOT NULL,
  forbidden TEXT NOT NULL
  )' test
../../mysql/bin/mysqlimport --fields-terminated-by=, --local test data/checklist_vectors.csv
../../mysql/bin/mysql -e 'SELECT * FROM checklist_vectors' test