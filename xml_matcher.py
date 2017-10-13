#! /usr/bin/env python
# -*- coding: utf-8 -*-


##################################################################
#                                                                #
# Programmet startas med:                                        #
#                                                                #
# python xml_matcher.py med parameter TEST eller PRODUKTION      #
#                                                                #
##################################################################


import sys
reload(sys)

import urllib2
import MySQLdb # sudo apt-get install python-mysqldb
import time
import datetime
import sys
import logging
import logging.handlers
from lxml import etree # sudo apt-get install python-lxml
import getpass


import smtplib # För att kunna skicka epost via SMTP

# Import the email modules
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header


class isa_match():
   def __init__(self):
#      self.Season        = 0 Primär nyckel
#      self.GameId        = 0 Primär nyckel
      self.HomeId         = '' # Home Team info
      self.HomeName       = '' # Home Team info
      self.HomeCode       = '' # Home Team info
      self.AwayId         = '' # Away Team info
      self.AwayName       = '' # Away Team info
      self.AwayCode       = '' # Away Team info
      self.Date           = ''
      self.Arena          = ''
      self.GameNumber     = ''
      self.Round          = ''
      self.GameType       = ''
      self.Level          = '' # PlayoffInfo
      self.Game           = '' # PlayoffInfo
      self.SeriesIndex    = '' # PlayoffInfo

class shl_match():
   def __init__(self):
      self.Season         = ''
      self.GameId         = ''
      self.Status         = ''
      self.GameState      = ''
      self.HomeGoal       = ''
      self.AwayGoal       = ''
      self.HomeId         = ''
      self.HomeName       = ''
      self.HomeCode       = ''
      self.AwayId         = ''
      self.AwayName       = ''
      self.AwayCode       = ''
      self.Date           = ''
      self.Arena          = ''
      self.Round          = ''
      self.GameType       = ''
      self.Level          = ''
      self.Game           = ''
      self.SeriesIndex    = ''
      self.Domarcoach     = ''
      self.PubliceraMatch = ''
      self.TillsattStatus = ''




def ReadXMLSeason():
   #
   # Läser Season från ISA-systemet
   #

   url = "http://reports.statnet.se/report/gamelist.xml"

   f = urllib2.urlopen(url)
   data = f.read()

   global Season
   svar = True

   try:
      root    = etree.fromstring (data)
      Season  = root.find( 'Season').text

   except etree.XMLSyntaxError, e:
      svar = False
      print
      print time.ctime(),
      print "Exception in def ReadXMLSeason: %d:  %s" % ( e.args[0], e.args[1] )
      log.error("Exception in def ReadXMLSeason: %s", e.args[1])

   #Slut på läsningen av Season
   return svar



def ReadXMLMatcher():
   print "Läser matcher"

   url = "http://reports.statnet.se/report/gamelist.xml"

   f = urllib2.urlopen(url)
   #data=unicode(f.read(),'ISO-8859-1')
   data = f.read()


   global new_isa_macth

   GameIds        = dict()
   global isa_Matcher

   tal      = -1
   this_pid = 0

   poster   = 0

   try:
      root    = etree.fromstring (data)
      GameIds = root.find( 'GameIds')
      Season  = root.find( 'Season').text
      for GameId in GameIds:

         HomeId = ''
         HomeName = ''
         HomeCode=''
         AwayId=''
         AwayName=''
         AwayCode=''
         Date=''
         Arena=''
         GameNumber=''
         Round=''
         GameType=''
         Level=''
         Game=''
         SeriesIndex=''

         poster += 1

         for child in GameId:
            if child.tag == "HomeTeam":
               HomeId = child.get('Id')
               HomeName = child.find('Name').text
               HomeCode = child.find('Code').text
            elif child.tag == "AwayTeam":
               AwayId = child.get('Id')
               AwayName = child.find('Name').text
               AwayCode = child.find('Code').text
            elif child.tag == "Date":
               Date = child.text
            elif child.tag == "Arena":
               Arena = child.text
            elif child.tag == "GameNumber":
               GameNumber = int(child.text)
            elif child.tag == "Round":
               Round = child.text
            elif child.tag == "GameType":
               GameType = child.text
            elif child.tag == "PlayoffInfo":
               Level = child.find('Level').text
               Game = child.find('Game').text
               SeriesIndex = child.find('SeriesIndex').text

         new_Match             = isa_match()
         new_Match.HomeId      = HomeId
         new_Match.HomeName    = HomeName
         new_Match.HomeCode    = HomeCode
         new_Match.AwayId      = AwayId
         new_Match.AwayName    = AwayName
         new_Match.AwayCode    = AwayCode
         new_Match.Date        = Date.replace("T", " ")
         new_Match.Arena       = Arena
         new_Match.Round       = Round
         new_Match.GameType    = GameType

         if len(Level) == 0:
            new_Match.Level    =  None
         else:
            new_Match.Level    = Level

         if len(Game) == 0:
            new_Match.Game     =  None
         else:
            new_Match.Game     = Game

         if len(SeriesIndex) == 0:
            new_Match.SeriesIndex     =  None
         else:
            new_Match.SeriesIndex     = SeriesIndex

         isa_Matcher[GameNumber] = new_Match

   except etree.XMLSyntaxError, e:
      print
      print time.ctime(),
      print "Exception in def ReadXMLLottoOmgang: %d:  %s" % ( e.args[0], e.args[1] )
      #log.error("Exception in def ReadXMLLottoOmgang: %s", e.args[1])

   print "Slut på läsningen av matcher för säsong ",Season




def update_Match():

   global isa_Matcher
   global shl_Matcher
   global updates
   global updated_matches
   global TillMig


   try:
      for GameId in isa_Matcher:
         #updated_matches += '<br>'
         Olika = False
         try:
            if isa_Matcher[GameId].HomeId   != shl_Matcher[GameId].HomeId:
               Olika = True
               updated_matches += '<br><b>HomeId</b> för GameNo ' + str(GameId) + ' ändrad från ' + shl_Matcher[GameId].HomeId + ' till ' + isa_Matcher[GameId].HomeId
               shl_Matcher[GameId].HomeId    = isa_Matcher[GameId].HomeId

            if isa_Matcher[GameId].HomeName != shl_Matcher[GameId].HomeName:
               Olika = True
               updated_matches += '<br><b>HomeName</b> för GameNo ' + str(GameId) + ' ändrad från ' + shl_Matcher[GameId].HomeName + ' till ' + isa_Matcher[GameId].HomeName
               shl_Matcher[GameId].HomeName  = isa_Matcher[GameId].HomeName

            if isa_Matcher[GameId].HomeCode != shl_Matcher[GameId].HomeCode:
               Olika = True
               updated_matches += '<br><b>HomeCode</b> för GameNo ' + str(GameId) + ' ändrad från ' + shl_Matcher[GameId].HomeCode + ' till ' + isa_Matcher[GameId].HomeCode
               shl_Matcher[GameId].HomeCode  = isa_Matcher[GameId].HomeCode

            if isa_Matcher[GameId].AwayId   != shl_Matcher[GameId].AwayId:
               Olika = True
               updated_matches += '<br><b>AwayId</b> för GameNo ' + str(GameId) + ' ändrad från ' + shl_Matcher[GameId].AwayId + ' till ' + isa_Matcher[GameId].AwayId
               shl_Matcher[GameId].AwayId    = isa_Matcher[GameId].AwayId

            if isa_Matcher[GameId].AwayName != shl_Matcher[GameId].AwayName:
               Olika = True
               updated_matches += '<br><b>AwayName</b> för GameNo ' + str(GameId) + ' ändrad från ' + shl_Matcher[GameId].AwayName + ' till ' + isa_Matcher[GameId].AwayName
               shl_Matcher[GameId].AwayName  = isa_Matcher[GameId].AwayName

            if isa_Matcher[GameId].AwayCode != shl_Matcher[GameId].AwayCode:
               Olika = True
               updated_matches += '<br><b>AwayCode</b> för GameNo ' + str(GameId) + ' ändrad från ' + shl_Matcher[GameId].AwayCode + ' till ' + isa_Matcher[GameId].AwayCode
               shl_Matcher[GameId].AwayCode  = isa_Matcher[GameId].AwayCode

            if isa_Matcher[GameId].Date     != str(shl_Matcher[GameId].Date):
               Olika = True
               updated_matches += '<br><b>Date</b> för GameNo ' + str(GameId) + ' ändrad från ' + str(shl_Matcher[GameId].Date) + ' till ' + isa_Matcher[GameId].Date
               shl_Matcher[GameId].Date      = isa_Matcher[GameId].Date

            if isa_Matcher[GameId].Arena    != shl_Matcher[GameId].Arena:
               Olika = True
               updated_matches += '<br><b>Arena</b> för GameNo ' + str(GameId) + ' ändrad från ' + shl_Matcher[GameId].Arena + ' till ' + isa_Matcher[GameId].Arena
               shl_Matcher[GameId].Arena     = isa_Matcher[GameId].Arena

            if isa_Matcher[GameId].Round    != str(shl_Matcher[GameId].Round):
               Olika = True
               updated_matches += '<br><b>Round</b> för GameNo ' + str(GameId) + ' ändrad från ' + str(shl_Matcher[GameId].Round) + ' till ' + isa_Matcher[GameId].Round
               shl_Matcher[GameId].Round     = isa_Matcher[GameId].Round

            if isa_Matcher[GameId].GameType != shl_Matcher[GameId].GameType:
               Olika = True
               updated_matches += '<br><b>GameType</b> för GameNo ' + str(GameId) + ' ändrad från ' + shl_Matcher[GameId].GameType + ' till ' + isa_Matcher[GameId].GameType
               shl_Matcher[GameId].GameType  = isa_Matcher[GameId].GameType

            if isa_Matcher[GameId].Level    != shl_Matcher[GameId].Level:
               print type(isa_Matcher[GameId].Level), ' shl=',type(shl_Matcher[GameId].Level)
               Olika = True
               updated_matches += '<br><b>Level</b> för GameNo ' + str(GameId) + ' ändrad från '
               if shl_Matcher[GameId].Level == None:
                  updated_matches += 'NULL'
               else:
                  updated_matches += shl_Matcher[GameId].Level
               updated_matches += ' till '
               if isa_Matcher[GameId].Level == None:
                  updated_matches += 'NULL'
               else:
                  updated_matches += isa_Matcher[GameId].Level

            if isa_Matcher[GameId].Game     != shl_Matcher[GameId].Game:
               Olika = True
               updated_matches += '<br><b>Game</b> för GameNo ' + str(GameId) + ' ändrad från ' + str(shl_Matcher[GameId].Game) + ' till ' + str(isa_Matcher[GameId].Game)
               shl_Matcher[GameId].Game      = isa_Matcher[GameId].Game

            if isa_Matcher[GameId].SeriesIndex != shl_Matcher[GameId].SeriesIndex:
               Olika = True
               updated_matches += '<br><b>SeriesIndex</b> för GameNo ' + str(GameId) + ' ändrad från ' + str(shl_Matcher[GameId].SeriesIndex) + ' till ' + str(isa_Matcher[GameId].SeriesIndex)
               shl_Matcher[GameId].SeriesIndex  = isa_Matcher[GameId].SeriesIndex


            if Olika == True:
               updates += 1
               update_Matchen(GameId)
         except KeyError:
            felmedelande = 'Unexpected KeyError vid update_Match\n\n'
            sendmail(TillMig, 'ERROR - xml_matcher.py', felmedelande)

   except:
      fel = ''
      try:
         fel = str(sys.exc_info()[0]) + '\n\n' + str(sys.exc_info()[1])
      except IndexError:
         fel = str(sys.exc_info()[0])
      felmedelande = 'Unexpected error vid update_Match med följande beskrivning:\n\n' + fel
      #Send the mail
      sendmail(TillMig, 'ERROR - xml_matcher.py', felmedelande)

   return


def update_Matchen(GameId):

   global isa_Matcher
   global shl_Matcher

   return


def delete_Match():

   global isa_Matcher
   global shl_Matcher
   global deleted_matches

   isa_Matcher.pop(6152, None)
   print '6152 removed'
   isa_Matcher.pop(6153,None)
   print '6153 removed'

   i = 0
   for GameId in shl_Matcher:
      if not GameId in isa_Matcher:
         print GameId, ' ',
         if i > 0:
            deleted_matches += ', '

         i += 1
         delete_Matchen(GameId)
   return


def delete_Matchen(GameId):

   global Season
   global shl_Matcher
   global deleted
   global deleted_fail
   global deleted_matches

   try:
      db = MySQLdb.connect(host=myhost, user=myuser, passwd=mypasswd, db=mydb)
      db.set_character_set('utf8')

      cursor = db.cursor()
      cursor.execute('SET NAMES utf8;')
      cursor.execute('SET CHARACTER SET utf8;')
      cursor.execute('SET character_set_connection=utf8;')

      params=[Season, GameId]

      cursor.callproc('delete_Match', params)
      db.commit()

      cursor.close()
      db.close()

      deleted += 1
      deleted_matches += str(GameId)

   except MySQLdb.Error,e:
      deleted_fail += 1
      fel = ''
      try:
         fel = str(e.args[0]) + '\n\n' + str(e.args[1])
      except IndexError:
         fel = str(e)

      felmedelande = 'Error vid delete_Matchen med nyckel=' + str(GameId) + ' med följande beskrivning:\n\n' + fel
      #Send the mail
      #MySQLclientconfig.sendemail('ERROR', felmedelande)

   return


def insert_Match():

   global isa_Matcher
   global shl_Matcher
   global inserted_matches

   i = 0
   for GameId in isa_Matcher:
      if not GameId in shl_Matcher:
         print GameId, ' ',
         if i > 0:
            inserted_matches += ', '

         i += 1
         insert_Matchen(GameId)
   return



def insert_Matchen(GameId):

   global isa_Matcher
   global Season
   global inserts
   global inserts_fail
   global inserted_matches


   try:

      HomeId      = isa_Matcher[GameId].HomeId
      HomeName    = isa_Matcher[GameId].HomeName
      HomeCode    = isa_Matcher[GameId].HomeCode
      AwayId      = isa_Matcher[GameId].AwayId
      AwayName    = isa_Matcher[GameId].AwayName
      AwayCode    = isa_Matcher[GameId].AwayCode
      Date        = isa_Matcher[GameId].Date
      Arena       = isa_Matcher[GameId].Arena
      Round       = isa_Matcher[GameId].Round
      GameType    = isa_Matcher[GameId].GameType
      Level       = isa_Matcher[GameId].Level
      Game        = isa_Matcher[GameId].Game
      SeriesIndex = isa_Matcher[GameId].SeriesIndex


      if Level == '':
         Level = None

      if Game == '':
         Game = None
      else:
         Game = int(Game)

      if SeriesIndex == '':
         SeriesIndex = None
      else:
         SeriesIndex = int(SeriesIndex)


      db = MySQLdb.connect(host=myhost, user=myuser, passwd=mypasswd, db=mydb)
      db.set_character_set('utf8')

      cursor = db.cursor()
      cursor.execute('SET NAMES utf8;')
      cursor.execute('SET CHARACTER SET utf8;')
      cursor.execute('SET character_set_connection=utf8;')

      params=[Season,GameId,HomeId,HomeName,HomeCode,AwayId,AwayName,AwayCode,Date,Arena,Round,GameType,Level,Game,SeriesIndex]

      cursor.callproc('insert_Match', params)
      db.commit()

      inserts += 1
      inserted_matches += str(GameId)

   except MySQLdb.Error,e:
      inserts_fail += 1
      svar = False
      fel = ''
      try:
         fel = str(e.args[0]) + '\n\n' + str(e.args[1])
      except IndexError:
         fel = str(e)

      felmedelande = 'Error vid insert_Matchen med följande beskrivning:\n\n' + fel
      print felmedelande
      #Send the mail
      #MySQLclientconfig.sendemail('ERROR', felmedelande)
      cursor.close()
      db.close()

   return



def insert_Matcher():

   global Season
   svar = True

   try:

      db = MySQLdb.connect(host=myhost, user=myuser, passwd=mypasswd, db=mydb)
      db.set_character_set('utf8')

      cursor = db.cursor()
      cursor.execute('SET NAMES utf8;')
      cursor.execute('SET CHARACTER SET utf8;')
      cursor.execute('SET character_set_connection=utf8;')


      poster = 0
      for GameId in isa_Matcher:

         HomeId      = isa_Matcher[GameId].HomeId
         HomeName    = isa_Matcher[GameId].HomeName
         HomeCode    = isa_Matcher[GameId].HomeCode
         AwayId      = isa_Matcher[GameId].AwayId
         AwayName    = isa_Matcher[GameId].AwayName
         AwayCode    = isa_Matcher[GameId].AwayCode
         Date        = isa_Matcher[GameId].Date
         Arena       = isa_Matcher[GameId].Arena
         Round       = isa_Matcher[GameId].Round
         GameType    = isa_Matcher[GameId].GameType
         Level       = isa_Matcher[GameId].Level
         Game        = isa_Matcher[GameId].Game
         SeriesIndex = isa_Matcher[GameId].SeriesIndex


         if Level == '':
            Level = None

         if Game == '':
            Game = None
         else:
            Game = int(Game)

         if SeriesIndex == '':
            SeriesIndex = None
         else:
            SeriesIndex = int(SeriesIndex)

         params=[Season,GameId,HomeId,HomeName,HomeCode,AwayId,AwayName,AwayCode,Date,Arena,Round,GameType,Level,Game,SeriesIndex]

         cursor.callproc('insert_Match', params)
         db.commit()
         poster += 1

      cursor.close()
      db.close()
      print ' ', poster, ' Matcher (HELA TABELLEN) har lagts till'

   except MySQLdb.Error,e:
      svar = False
      fel = ''
      try:
         fel = str(e.args[0]) + '\n\n' + str(e.args[1])
      except IndexError:
         fel = str(e)

      felmedelande = 'Error vid insert_Matcher med följande beskrivning:\n\n' + fel
      print felmedelande
      #Send the mail
      #MySQLclientconfig.sendemail('ERROR', felmedelande)

   return svar



def Read_shlMatcher():

   global Season
   global shl_Matcher
   global TillMig

   try:
      db = MySQLdb.connect(host=myhost, user=myuser, passwd=mypasswd, db=mydb)
      db.set_character_set('utf8')

      cursor = db.cursor()
      cursor.execute('SET NAMES utf8;')
      cursor.execute('SET CHARACTER SET utf8;')
      cursor.execute('SET character_set_connection=utf8;')

      params = [Season]
      cursor.callproc('read_Matcher', params)
      result = cursor.fetchall()

      shl_Matcher.clear()

      for i in range(cursor.rowcount):

         new_Match = shl_match()

         GameId    = result[i][0]

         new_Match.Status      = None
         if result[i][1] != None:
            new_Match.Status      = result[i][1].decode('utf-8')

         new_Match.GameState   = None
         if result[i][2] != None:
            new_Match.GameState   = result[i][2].decode('utf-8')

         new_Match.HomeGoal    = None
         if result[i][3] != None:
            new_Match.HomeGoal = result[i][3]

         new_Match.AwayGoal    = None
         if result[i][4] != None:
            new_Match.AwayGoal = result[i][4]

         new_Match.HomeId      = result[i][5].decode('utf-8')
         new_Match.HomeName    = result[i][6].decode('utf-8')
         new_Match.HomeCode    = result[i][7].decode('utf-8')
         new_Match.AwayId      = result[i][8].decode('utf-8')
         new_Match.AwayName    = result[i][9].decode('utf-8')
         new_Match.AwayCode    = result[i][10].decode('utf-8')
         new_Match.Date        = result[i][11]
         new_Match.Arena       = result[i][12].decode('utf-8')
         new_Match.Round       = result[i][13]
         new_Match.GameType    = result[i][14].decode('utf-8')

         new_Match.Level       = None
         if result[i][15] != None:
            new_Match.Level = result[i][15].decode('utf-8')

         new_Match.Game        = None
         if result[i][16] != None:
            new_Match.Game = result[i][16]

         new_Match.SeriesIndex = None
         if result[i][17] != None:
            new_Match.SeriesIndex = result[i][17]

         new_Match.Domarcoach  = None
         if result[i][18] != None:
            new_Match.Domarcoach = result[i][18]

         new_Match.PubliceraMatch  = None
         if result[i][19] != None:
            new_Match.PubliceraMatch = result[i][19]

         new_Match.TillsattStatus = result[i][20]

         shl_Matcher[GameId]  = new_Match

      cursor.close()
      db.close()

   except MySQLdb.Error,e:
      fel = ''
      try:
         fel = str(e.args[0]) + '\n\n' + str(e.args[1])
      except IndexError:
         fel = str(e)

      felmedelande = 'Error vid read_shlMatcher med följande beskrivning:\n\n' + fel
      #Send the mail
      sendmail(TillMig, 'ERROR - xml_matcher.py',felmedelande )

   print 'Inlästa poster=', str(len(shl_Matcher))
   return



#def sendemail(rubrik, message):
#    from_addr    = 'referenser@geijerskolan.se'
#    to_addr_list = ['pavlidis.nitsasoft@gmail.com']
#    cc_addr_list = []
#    subject      = rubrik
#    login        = 'referenser@geijerskolan.se'
#    password     = 'X2y?_vht52'
#    smtpserver   = 'send.one.com:2525'

#    header  = 'From: %s\n' % from_addr
#    header += 'To: %s\n' % ','.join(to_addr_list)
#    header += 'Cc: %s\n' % ','.join(cc_addr_list)
#    header += 'Subject: %s\n\n' % subject
#    message = header + message

#    server = smtplib.SMTP(smtpserver)
#    server.starttls()
#    server.login(login,password)
#    problems = server.sendmail(from_addr, to_addr_list, message)
#    if len(problems) > 0:
#       fil.write(time.strftime("%Y-%m-%d %H:%M:%S"))
#       fil.write(message)

#    server.quit()


def sendmail(mottagare, rubrik, body):
   global TillMig

   me  = 'referenser@geijerskolan.se'
   you = ''

   if (KORNING == 'TEST'):
      you = TillMig   # vid TESTER
   else:
      you = mottagare # vid PRODUKTION


   # Construct email
   msg = MIMEMultipart('alternative')
   msg['Subject'] = Header(rubrik,'utf-8')
   msg['From']    = 'referenser@geijerskolan.se'
   msg['To']      = you

   #text = "Hi!\nHow are you?\nHere is the link you wanted:\nhttps://www.python.org"

   # Record the MIME types of both parts - text/plain and text/html.
   #part1 = MIMEText(text, 'plain')
   part2 = MIMEText(body, 'html','utf-8')

   # Attach parts into message container.
   # According to RFC 2046, the last part of a multipart message, in this case
   # the HTML message, is best and preferred.
   #msg.attach(part1)
   msg.attach(part2)

   # Send the message via One.com server.
   s = smtplib.SMTP('send.one.com',2525)
   s.starttls()
   smtp_user   = 'referenser@geijerskolan.se'
   smtp_pass   = 'X2y?_vht52'
   SendSuccess = True
   try:
      s.login(smtp_user,smtp_pass)
      # sendmail function takes 3 arguments: sender's address, recipient's address
      # and message to send - here it is sent as one string.
      #
      #
      s.sendmail(me, you, msg.as_string())
      #
      #

   except Exception:
      log.error('Misslyckad epost från ' + me + ' till ' + you)
      log.error('Misslyckad e-posten är: \n' + body)
      SendSuccess = False

   s.quit()
   return SendSuccess


#try:
#   db = MySQLdb.connect(host=myhost, user=myuser, passwd=mypasswd, db=mydb)
#   db.set_character_set('utf8')

#   cursor = db.cursor()
#   cursor.execute('SET NAMES utf8;')
#   cursor.execute('SET CHARACTER SET utf8;')
#   cursor.execute('SET character_set_connection=utf8;')

#   params = []
#   cursor.callproc('read_SmtpParametrar', params)
#   result = cursor.fetchall()

#   shl_Matcher.clear()
#   for i in range(cursor.rowcount):

#      new_match   = shl()

#         SmtpID                      = result[i][0]
#         new_smtpParameter.UserName  = result[i][1].decode('utf-8')
#         new_smtpParameter.Pw        = result[i][2].decode('utf-8')
#         new_smtpParameter.Host      = result[i][3].decode('utf-8')
#         new_smtpParameter.Port      = result[i][4]
#         new_smtpParameter.EnableSsl = result[i][5]

#         MySQLclientconfig.MySQL_SmtpParametrar[SmtpID]  = new_smtpParameter

#      cursor.close()
#      db.close()

#   except MySQLdb.Error,e:
#      fel = ''
#      try:
#         fel = str(e.args[0]) + '\n\n' + str(e.args[1])
#      except IndexError:
#         fel = str(e)

#      felmedelande = 'Error vid read_SmtpParametrar med följande beskrivning:\n\n' + fel
#      #Send the mail
#      MySQLclientconfig.sendemail('ERROR',felmedelande )

#   return



# ==========================================================================
#                                                                          #
#                        THE MAIN PROGRAM BEGIN HERE                       #
#                                                                          #
# ==========================================================================


sys.setdefaultencoding('utf-8')


if len(sys.argv) != 2:
   print 'Parameter KORNING(ska vara TEST eller PRODUKTION) behövs. Programmet avbryts! Ha en trevlig dag!'
   print
   sys.exit(0)



KORNING        =  sys.argv[1]


myhost   = 'localhost'
myuser   = 'root'
mydb     = 'shl'

if (KORNING   == 'TEST'):
   mypasswd    = 'silop1337' # Utvecklingsmiljö
elif (KORNING == 'PRODUKTION'):
   mypasswd    = 'XXXXXXX'   # Produktionsmiljö
else:
   print 'KORNING ska vara TEST eller PRODUKTION. Programmet avbryts! Ha en trevlig dag!'
   print
   sys.exit(0)


TillMig          = 'pavlidis.nitsasoft@gmail.com'
TillMottagare    = 'peter.andersson@shl.se'


inserts          = 0
deleted          = 0
updates          = 0

inserts_fail     = 0
deleted_fail     = 0
updates_fail     = 0

inserted_matches = ''
deleted_matches  = ''
updated_matches  = ''

shl_Matcher      = dict() # Data i SHL-databasen
isa_Matcher      = dict() # Data från ISA-systemet
Season           = ''



LOG_FILENAME = "/var/log/shl/matcher.log"
username = getpass.getuser()
print "username=",username

#if (username == "shl") or (username == "root"):
#    LOG_FILENAME = "/var/log/shl/matcher.log"
#else:
#    LOG_FILENAME = "matcher.log"


format = logging.Formatter("%(levelname)-10s %(asctime)s %(message)s")
fhandler = logging.FileHandler(LOG_FILENAME,'a','utf-8')
fhandler.setFormatter(format)
log = logging.getLogger("shl.matcher")
log.setLevel(logging.INFO)
log.addHandler(fhandler)


log.info("xml_matcher.py started")
#log.error("matcher fel")
#ReadXMLMatcher()


if not ReadXMLSeason():
   print 'Misslyckad anrop'
   sys.exit(0)



ReadXMLMatcher()

s = str(len(isa_Matcher)) + ' har lästs in.<br>'
print len(isa_Matcher), ' isa-poster'

#Read_shlMatcher()
#s += str(len(shl_Matcher)) + ' har lästs in.'
#print len(shl_Matcher), ' shl-poster'


#if len(shl_Matcher) < 1:
#   insert_Matcher()
#   sys.exit(0)

#insert_Match()

#delete_Match()

#update_Match()


body  = '<!DOCTYPE html>'
body += '<html lang="sv">'
body += '<head>'
body += '<meta charset="utf-8" />'
body += '</head>'
body += '<body>'
body += '<h1 style="background: #ffa500; font-size:25pt;"><strong>Tillsättningsprogrammet</strong></h1>'
body += '<h2>Sammanställning</h2>'
#body += 'Vi har initialt läst in ifrån ISA-systemmet ' + str(len(isa_Matcher)) + ' matcher.'
#body += '<br>Från vår egen databas har vi initialt läst in ' + str(len(shl_Matcher)) + ' matcher.'

body += '<br><br>Följande bearbetning har gjorts:';
body += '<ul>';
#body += '   <li>Registrering: Totalt ' + str(inserts + inserts_fail) + ' matcher varav:</li>';
#body += '      <ul><li>' + str(inserts) + ' lyckade registreringar.</li>';
#body += '          <li>' + str(inserts_fail) + ' misslyckade registreringar.</li></ul>';
#body += '   <li>Borttagning totalt '  + str(deleted + deleted_fail) + ' matcher varav:</li>';
#body += '      <ul><li>' + str(deleted) + ' lyckade borttagningar.</li>';
#body += '          <li>' + str(deleted_fail) + ' misslyckade borttagningar.</li></ul>';
#body += '   <li>Uppdatering totalt '  + str(updates + updates_fail) + ' matcher varav:</li>';
#body += '      <ul><li>' + str(updates) + ' lyckade uppdateringar.</li>';
#body += '          <li>' + str(updates_fail) + ' misslyckade uppdateringar.</li></ul>';
body += '</ul>';
body += '<br><br>';
#body += '<b>Lista med GameNo över nyregistrerade matcher:</b> ' + inserted_matches
body += '<br><br>';
#body += '<b>Lista med GameNo över borttagna matcher:</b> ' + deleted_matches
body += '<br><br>';
#body += '<b>Lista över ändringar genomförda i matcher:</b> ' + updated_matches
body += '<br><br>Med vänliga hälsningar';
body += '<br>Tillsättningsprogrammet';
body += '</body>';
body += '</html>';



rubrik = 'Sammanställning av databassynkroniseringen med ISA-systemet'
#sendmail(TillMottagare, rubrik, body)

sys.exit(0)
