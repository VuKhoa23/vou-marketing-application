#!/bin/bash

kubectl apply -f="branddb-pv-pvc.yml"

kubectl apply -f="branddb-deployment.yml"

kubectl apply -f="branddb-service.yml"

kubectl apply -f="deployment.yml"

kubectl apply -f="service.yml"

minikube addons enable ingress

kubectl apply -f="ingress.yml"