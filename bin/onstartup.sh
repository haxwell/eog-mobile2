#!/bin/sh

# HAXWELL INFRASTRUCTURE - Update the frontend. Each instance of the backend server has a copy of the frontend,
#   that's this file, and uses it to run automated tests.

----

# Be sure that the branch of the git repo that this server is building off of is the correct one..
#  Master for PROD, Develop for STAGING, and the local dev branch for DEV

# 
# This script is added to crontab, and then run when the machine starts.
#  It keeps me from having to initialize the machine, this script now does
#  it for me.
#
#  crontab: @reboot <this-file-name.sh>       # create cron entry which runs this file at reboot

# To see if this file has been added to cron already:
#  crontab -l

# Also, there is a file, ~/.my.cnf, which has mysql login info

cd /home/quizki/src/$HAX_APP_FRONTEND_NAME

git pull

exit 0;

