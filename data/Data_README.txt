#  checklist_rules.csv
#  
#  This document attempts to define the individual slots on the checklist.
#  NOTE: Any lines that begin with a '#' are treated as comments and are not parsed.
#  
#  The first value in the CSV format is the version id
#  The second value in the CSV format is how many checkboxes does this rule take
#  The third value is the official name for the checklist slot.
#  The fourth value is the list of classes that are acceptable (separated with ';'):
#      There are special tags in place of classes that will require additional logic
#      These tags all start with '$' and their logic is defined below:
#         $FWS                 will count all classes that have the first four characters in their title as "FWS:"
#         $LiberalStudies      will count all classes that have liberal studies tags
#         $CSElective          defined in checklist_tags.csv
#         $Technical           defined in checklist_tags.csv
#         $Specialization      defined in checklist_tags.csv
#         $MajorElective       defined in checklist_tags.csv
#         $AdvisorElec         defined in checklist_tags.csv
#
#   An asterisk (*) after any department listing will gather all those courses in the department.
#   A sole asterisk allows for any classes to be put in!
#   
#   TODO: perhaps we need to also put in the XSLX cell locations that these belong to.
#
