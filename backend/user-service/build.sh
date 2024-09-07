#!/bin/bash

sudo docker build -t vukhoa23/user-service:"$1" .

sudo docker push vukhoa23/user-service:"$1"

sudo docker rmi vukhoa23/user-service:"$1"