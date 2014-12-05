 #!/usr/bin/env bash
mysql -e 'DROP TABLE IF EXISTS checklistinteractive.schedule'
mysql -e 'CREATE TABLE schedule(
  netid                 VARCHAR(50) NOT NULL,
  schedule_id           VARCHAR(50) NOT NULL,
  schedule_name         VARCHAR(50) NOT NULL,
  schedule_numSemesters VARCHAR(50) NOT NULL,
  schedule              TEXT        NOT NULL,
  checklist_data        TEXT        NOT NULL
  )' -u checklist -pzOPukWdPDt checklistinteractive