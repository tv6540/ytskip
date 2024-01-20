#!/bin/bash
f=`date +"%m-%d-%Y-%T"`
export SPRING_PROFILES_ACTIVE=prod
echo -e "\n\n\n\ntriggered at $f\n\n\n\n" >> /home/ubuntu/ytskip/logs/startup.log
LOG_DIR_PREFIX="/home/ubuntu/ytskip" java -jar /home/ubuntu/ytskip/ytskip-*.jar >> /home/ubuntu/ytskip/logs/startup.log