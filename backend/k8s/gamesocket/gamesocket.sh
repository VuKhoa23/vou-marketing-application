#!/bin/bash

kubectl apply -f=gameredis-deployment.yml

kubectl apply -f=gameredis-service.yml

kubectl apply -f=deployment.yml

kubectl apply -f=service.yml