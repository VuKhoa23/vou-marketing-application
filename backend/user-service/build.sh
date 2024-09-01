#!/bin/bash

sudo docker build -t vukhoa23/brand-management-service:"$1" .

sudo docker push vukhoa23/brand-management-service:"$1"

sudo docker rmi vukhoa23/brand-management-service:"$1"