 #!/usr/bin/env bash
../../bin/mysql -e 'DROP TABLE IF EXISTS test.checklist_tags'
../../bin/mysql -e 'CREATE TABLE checklist_tags(
  version VARCHAR(30) NOT NULL,
  tag VARCHAR(30) NOT NULL,
  credits VARCHAR(30) NOT NULL,
  course_num VARCHAR(30) NOT NULL,
  forbidden VARCHAR(513) NOT NULL
  )' test
../../bin/mysqlimport --fields-terminated-by=, --local test data/checklist_tags.csv
../../bin/mysql -e 'SELECT * FROM checklist_tags' test
