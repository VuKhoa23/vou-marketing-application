#!/bin/bash

sudo docker build -t vukhoa23/gamesocket-service:"$1" .

sudo docker push vukhoa23/gamesocket-service:"$1"

sudo docker rmi vukhoa23/gamesocket-service:"$1"