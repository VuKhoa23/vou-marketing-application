#!/bin/bash

kubectl apply -f=gamedb-pv-c.yml

kubectl apply -f=gamedb-deployment.yml

kubectl apply -f=gamedb-service.yml
