 #!/usr/bin/env bash
../../mysql/bin/mysql -e 'DROP TABLE IF EXISTS test.checklist_tags'
../../mysql/bin/mysql -e 'CREATE TABLE checklist_tags(
  version VARCHAR(30) NOT NULL,
  tag VARCHAR(30) NOT NULL,
  credits VARCHAR(30) NOT NULL,
  course_num VARCHAR(30) NOT NULL,
  forbidden VARCHAR(513) NOT NULL
  )' test
../../mysql/bin/mysqlimport --fields-terminated-by=, --local test data/checklist_tags.csv
../../mysql/bin/mysql -e 'SELECT * FROM checklist_tags' test
