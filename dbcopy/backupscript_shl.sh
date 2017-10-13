#!/bin/bash                                                                     
#                                                                               

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/var/www/html/dbcopy

FILE=/var/www/html/dbcopy/shlAms_`date +"%Y%m%d_%H%M"`
DBSERVER=127.0.0.1
DATABASE=shl
USER=root
PASS=silop1337
mysqldump --opt --user=${USER} --password=${PASS} ${DATABASE} --routines  > ${F\
ILE}
