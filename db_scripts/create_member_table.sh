 #!/usr/bin/env bash
mysql -e 'DROP TABLE IF EXISTS checklistinteractive.member'
mysql -e 'CREATE TABLE member(
  netid               VARCHAR(30) NOT NULL,
  name                VARCHAR(30) NOT NULL,
  version			  VARCHAR(30) NOT NULL,
  start_year          VARCHAR(30) NOT NULL,
  next_schedule_num   VARCHAR(30) NOT NULL,
  current_schedule_id TEXT        NOT NULL
  )' -u checklist -pzOPukWdPDt checklistinteractive