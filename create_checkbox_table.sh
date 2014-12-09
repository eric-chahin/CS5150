 #!/usr/bin/env bash
../../bin/mysql -e 'DROP TABLE IF EXISTS test.checkboxes'
../../bin/mysql -e 'CREATE TABLE checkboxes(
  version        VARCHAR(30)    NOT NULL,
  title          VARCHAR(255)   NOT NULL,
  excel_cell     VARCHAR(30)    NOT NULL
  )' test
../../bin/mysqlimport --fields-terminated-by=, --local test data/checkboxes.csv
../../bin/mysql -e 'SELECT * FROM checkboxes' test
