#!/bin/bash

kubectl apply -f=userdb-pv-c.yml

kubectl apply -f=userdb-deployment.yml

kubectl apply -f=userdb-service.yml

kubectl apply -f=deployment.yml

kubectl apply -f=service.yml