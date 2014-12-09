 #!/usr/bin/env bash
../../bin/mysql -e 'DROP TABLE IF EXISTS test.schedule'
../../bin/mysql -e 'CREATE TABLE schedule(
  netid                 VARCHAR(50) NOT NULL,
  schedule_id           VARCHAR(50) NOT NULL,
  schedule_name         VARCHAR(50) NOT NULL,
  schedule              TEXT        NOT NULL,
  checklist_data        TEXT        NOT NULL,
  potential_courses     TEXT        NOT NULL
  )' test