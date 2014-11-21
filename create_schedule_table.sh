 #!/usr/bin/env bash
../../bin/mysql -e 'DROP TABLE IF EXISTS test.schedule'
../../bin/mysql -e 'CREATE TABLE schedule(
  netid                 VARCHAR(50) NOT NULL,
  schedule_id           VARCHAR(50) NOT NULL,
  schedule_name         VARCHAR(50) NOT NULL,
  schedule_numSemesters VARCHAR(50) NOT NULL,
  schedule              TEXT        NOT NULL
  )' test