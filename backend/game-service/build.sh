#!/bin/bash

sudo docker build -t vukhoa23/game-service:"$1" .

sudo docker push vukhoa23/game-service:"$1"

sudo docker rmi vukhoa23/game-service:"$1"