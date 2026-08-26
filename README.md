# TiffinHub DevOps Project

TiffinHub is a containerized web application deployed and managed using Docker and Kubernetes. This project demonstrates the basic DevOps workflow of containerizing an application and deploying it on a Kubernetes cluster using Minikube.

## Project Overview

The application is packaged into a Docker image and deployed to Kubernetes using a Deployment. The Kubernetes Deployment maintains three replicas of the application for availability and allows the application to recover automatically when a Pod is deleted.

A Kubernetes Service is used to provide stable networking and distribute traffic to the running TiffinHub Pods.

## Architecture

```text
TiffinHub Application
        |
        v
   Docker Image
        |
        v
   Kubernetes Deployment
        |
   +----+----+----+
   |    |    |
 Pod 1 Pod 2 Pod 3
   +----+----+----+
        |
        v
 Kubernetes Service
        |
        v
    Application
```

## Technologies Used

- Docker
- Kubernetes
- Minikube
- Git
- GitHub

## Kubernetes Implementation

### Deployment

A Kubernetes Deployment named `tiffinhub` was created with **3 replicas**.

The Deployment provides:

- Pod management
- Replica management
- Self-healing
- Scaling

Pod deletion was tested to verify that Kubernetes automatically creates a replacement Pod.

### Scaling

The application was manually scaled from 3 replicas to 5 replicas and then returned to 3 replicas to understand Kubernetes horizontal scaling.

### Service

A Kubernetes Service named `tiffinhub-service` was created to provide stable network access to the TiffinHub Pods.

The Service was configured as a **NodePort** to demonstrate external access from the Minikube environment.

The Service endpoints were verified and confirmed to point to all three running TiffinHub Pods.

## Testing

The following were verified during the project:

- 3 TiffinHub Pods running successfully
- Deployment showing `3/3` replicas ready
- Service successfully connected to the Pods
- Service endpoints showing all 3 Pod IP addresses
- Pod self-healing after Pod deletion
- Manual scaling of replicas
- Application successfully accessed through Kubernetes port-forwarding

## Project Structure

```text
tiffinhub-devops/
├── Dockerfile
├── deployment.yaml
├── service.yaml
└── README.md
```

## Key Learning

This project provided practical experience with containerization and Kubernetes application deployment, including Deployments, Pods, replicas, self-healing, scaling, Services, networking, and basic troubleshooting.

## Conclusion

TiffinHub was successfully containerized and deployed on Kubernetes using Minikube. The project demonstrates a basic but practical DevOps deployment workflow from a containerized application to a running Kubernetes workload.
