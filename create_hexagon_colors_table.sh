 #!/usr/bin/env bash
../../bin/mysql -e 'DROP TABLE IF EXISTS test.hexagon_colors'
../../bin/mysql -e 'CREATE TABLE hexagon_colors(
  color VARCHAR(30) NOT NULL,
  courses TEXT NOT NULL
  )' test
../../bin/mysqlimport --fields-terminated-by=, --local test data/hexagon_colors.csv
../../bin/mysql -e 'SELECT * FROM hexagon_colors' test
