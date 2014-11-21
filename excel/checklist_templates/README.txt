ALL FILES IN THIS FOLDER MUST END WITH THE EXTENSION:
          
                  '.xls'

Also, the name of the file must match the version
of the checklist that is defined in data/checklist_rules.csv

e.g. The version is "2012" so the corresponding checklist template
should be "2012.xls"

You will also want to properly set read access for these checklists.

1. Open Terminal
2. `cd` into the 'excel' directory
3. run `chmod -r 644 checklist_templates`

This will allow our software to properly read the template files.
