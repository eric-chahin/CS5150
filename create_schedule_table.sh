 #!/usr/bin/env bash
../../mysql/bin/mysql -e 'DROP TABLE IF EXISTS test.schedule'
../../mysql/bin/mysql -e 'CREATE TABLE schedule(
  netid            VARCHAR(50) NOT NULL,
  schedule_id      VARCHAR(50) NOT NULL,
  schedule_name    VARCHAR(50) NOT NULL,
  schedule         TEXT        NOT NULL
  )' test