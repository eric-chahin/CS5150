from bs4 import BeautifulSoup
from unidecode import unidecode
import requests
import pdb
import traceback
import sys

COURSE_ROSTER_API_CLASSES = 'https://classes.cornell.edu/api/2.0/search/classes.xml?roster='
COURSE_ROSTER_API_SUBJECT = 'https://classes.cornell.edu/api/2.0/config/subjects.xml?roster='

COURSE_DICT = {} # key -> Course object


def getSubjects(roster_semester):
  url = COURSE_ROSTER_API_SUBJECT + roster_semester
  soup = BeautifulSoup(requests.get(url).text)
  subject_lst = []
  for soup_v in soup.find_all('value'):
    subject_lst.append(soup_v.text)
  return subject_lst

def getCourseInformation(roster_semester):
  subjects = getSubjects(roster_semester)

  for s in subjects:
    getIndividualSubject(roster_semester,s)


def getIndividualSubject(roster_semester,subject):
  url = COURSE_ROSTER_API_CLASSES + roster_semester + '&subject=' + subject
  soup = BeautifulSoup(requests.get(url).text)

  classes = soup.find_all('class')
  for c in classes:
    listing = subject + c.find('catalognbr').text
    if listing not in COURSE_DICT:
      name = unidecode(c.find('titlelong').text.replace('\n', ' '))
      units_min = c.find('unitsminimum').text
      units_max = c.find('unitsmaximum').text
      if units_min == units_max:
        credits = units_min
      else:
        credits = units_min + "-" + units_max
      course_obj = Course(listing,name,credits)
      course_obj.description   = unidecode(c.find('description').text.replace('\n', ' '))
      course_obj.offered       = unidecode(c.find('catalogwhenoffered').text.replace('\n', ' '))
      course_obj.prerequisites = unidecode(c.find('catalogprereqcoreq').text.replace('\n', ' '))
      course_obj.arts_tags     = unidecode(c.find('catalogdistr').text.replace('\n', ' '))
      crosslists = []
      for combination in c.find_all('combination'):
        crosslists.append(combination.find('subject').text + combination.find('catalognbr').text)
      course_obj.crosslisted_classes = ";".join(crosslists)
      COURSE_DICT[listing] = course_obj
      print str(course_obj)
      print '-' * 50


def main(sem1, sem2):
  #Go through new and old
  getCourseInformation(sem1) 
  getCourseInformation(sem2) 
  course_lst = []
  for k in COURSE_DICT:
    course_lst.append(str(COURSE_DICT[k]) + '\n')
  course_lst.sort()
  printer = open("data/courses.csv",'w')
  for e in course_lst:
    printer.write(e)
  printer.close()


class Course(object):
  def __init__(self,course_listing, name, credits):
      self.offered = "" # list of semesters it was offered 
      self.arts_tags = "" # list of tags if liberal stuides
      self.description = "" # String of description
      #TODO self.vectors_required = None # list of vectors for which this is a required course
      #TODO self.vectors_satify = None # list of vectors that this course satisfies
      self.crosslisted_classes = ""
      self.prerequisites = "" 
      self.course_listing = course_listing
      self.name = name
      self.credits = credits #String
  def __str__(self):
    return ";;;".join([self.course_listing,self.name,self.credits,self.offered,self.arts_tags,self.prerequisites,self.crosslisted_classes,self.description])

if __name__ == '__main__':
  warn = len(sys.argv) != 3
  if not warn:
    if sys.argv[1].find('FA') == -1 and sys.argv[1].find('SP') == -1:
      warn = True
    if sys.argv[2].find('FA') == -1 and sys.argv[2].find('SP') == -1:
      warn = True
    try:
      int(sys.argv[1][2:])
      int(sys.argv[2][2:])
    except:
      warn = True

  if warn:
    print "CHECKLIST INTERACTIVE ADMIN: "
    print 'Please supply the correct arguments.'
    print 'The arguments should be the current semester and the upcoming semester.'
    print 'For example, if it is Fall 2014, run `python parse_data.py FA14 SP15`'
    print 'This will take care of Fall 2014 and Spring 2015, which is the most current set of courses.'
    print 'For a sanity check, make sure that "classes.cornell.edu/browse/roster/FA14" works in your web browser where'
    print '   you should substitue "FA14" for the semesters you are trying to grab.'
    raise Exception()

  main(sys.argv[1], sys.argv[2])
