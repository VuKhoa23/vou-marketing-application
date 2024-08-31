#!/bin/bash

mvn clean install -DskipTests

sudo docker build -t vukhoa23/admin-service:"$1" .

sudo docker push vukhoa23/admin-service:"$1"

sudo docker rmi vukhoa23/admin-service:"$1"