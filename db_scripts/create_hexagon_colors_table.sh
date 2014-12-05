 #!/usr/bin/env bash
mysql -e 'DROP TABLE IF EXISTS checklistinteractive.hexagon_colors'
mysql -e 'CREATE TABLE hexagon_colors(
  color VARCHAR(30) NOT NULL,
  courses TEXT NOT NULL
  )' -u checklist -pzOPukWdPDt checklistinteractive
mysqlimport --fields-terminated-by=, --local -u checklist -pzOPukWdPDt checklistinteractive data/hexagon_colors.csv
mysql -e 'SELECT * FROM hexagon_colors' -u checklist -pzOPukWdPDt checklistinteractive
