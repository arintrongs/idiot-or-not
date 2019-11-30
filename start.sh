#!/bin/sh
git pull
kubectl delete -f kubernetes/deployments
kubectl delete -f kubernetes/services
kubectl apply -f kubernetes/deployments
kubectl apply -f kubernetes/services
