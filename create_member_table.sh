 #!/usr/bin/env bash
../../mysql/bin/mysql -e 'DROP TABLE IF EXISTS test.member'
../../mysql/bin/mysql -e 'CREATE TABLE member(
  netid               VARCHAR(30) NOT NULL,
  name                VARCHAR(30) NOT NULL,
  next_schedule_num   VARCHAR(30) NOT NULL,
  current_schedule_id TEXT        NOT NULL,
  schedules           TEXT        NOT NULL
  )' test