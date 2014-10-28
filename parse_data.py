from bs4 import BeautifulSoup
from unidecode import unidecode
import requests
import pdb
import traceback

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
      name = unidecode(c.find('titlelong').text)
      units_min = c.find('unitsminimum').text
      units_max = c.find('unitsmaximum').text
      if units_min == units_max:
        credits = units_min
      else:
        credits = units_min + "-" + units_max
      course_obj = Course(listing,name,credits)
      course_obj.description   = unidecode(c.find('description').text)
      course_obj.offered       = unidecode(c.find('catalogwhenoffered').text)
      course_obj.prerequisites = unidecode(c.find('catalogprereqcoreq').text)
      course_obj.arts_tags     = unidecode(c.find('catalogdistr').text)
      COURSE_DICT[listing] = course_obj
      print str(listing)
      print '-' * 50


def main():
  #Go through new and old
  getCourseInformation('FA14') # goes through Fall   2014
  getCourseInformation('SP15') # goes through Spring 2015
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
      self.prerequisites = "" 
      self.course_listing = course_listing
      self.name = name
      self.credits = credits #String
  def __str__(self):
    return self.course_listing + ";;;" + self.name + ";;;" + self.credits + ";;;" + self.offered + ";;;" + self.arts_tags + ";;;" + self.prerequisites + ";;;" + self.description


main()
