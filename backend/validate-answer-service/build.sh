#!/bin/bash

sudo docker build -t vukhoa23/validate-answer-service:"$1" .

sudo docker push vukhoa23/validate-answer-service:"$1"

sudo docker rmi vukhoa23/validate-answer-service:"$1"