terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# -----------------------
# Variables
# -----------------------
variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "project_tag" {
  type    = string
  default = "k8s-free-tier"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "key_name" {
  type = string
  
}

variable "backend_image" {
  type    = string
  default = "dockerizzz/express-backend:latest"
}

variable "backend_port" {
  type    = number
  default = 5000
}

variable "frontend_image" {
  type    = string
  default = "dockerizzz/next-frontend:latest"
}

variable "frontend_port" {
  type    = number
  default = 3000
}

variable "nodeport_frontend" {
  type    = number
  default = 30080
}

variable "nodeport_backend" {
  type    = number
  default = 30081
}


# -----------------------
# Networking (minimal)
# -----------------------
resource "aws_vpc" "main" {
  cidr_block           = "10.42.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = { Name = "${var.project_tag}-vpc" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project_tag}-igw" }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.42.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags                    = { Name = "${var.project_tag}-subnet-public" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project_tag}-rtb-public" }
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_assoc" {
  route_table_id = aws_route_table.public.id
  subnet_id      = aws_subnet.public.id
}

resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_tag}-sg"
  description = "Allow SSH, HTTP, NodePort"
  vpc_id      = aws_vpc.main.id

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP (optional convenience)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # NodePort range
  ingress {
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Egress
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_tag}-sg" }
}

# -----------------------
# AMI (Amazon Linux 2)
# -----------------------
data "aws_ami" "al2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# -----------------------
# EC2 with k3s + Deployments via cloud-init
# -----------------------
resource "aws_instance" "k3s_node" {
  ami                    = data.aws_ami.al2.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name               = var.key_name

  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail

    # Basic packages
    yum update -y
    yum install -y curl jq

    # Install k3s (server)
    curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--write-kubeconfig-mode=644" sh -s -

    # Wait for k3s to be ready
    export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
    until kubectl get nodes; do
      echo "Waiting for k3s..."
      sleep 3
    done

    # Create namespace
    kubectl create namespace app || true

    # Frontend Deployment + Service (NodePort)
    cat <<YAML > /tmp/frontend.yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: frontend
      namespace: app
      labels: { app: frontend }
    spec:
      replicas: 1
      selector:
        matchLabels: { app: frontend }
      template:
        metadata:
          labels: { app: frontend }
        spec:
          containers:
            - name: frontend
              image: $${frontend_image}
              ports:
                - containerPort: $${frontend_port}
              env:
                - name: PORT
                  value: "$${frontend_port}"
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: frontend-svc
      namespace: app
    spec:
      type: NodePort
      selector: { app: frontend }
      ports:
        - name: http
          port: 80
          targetPort: $${frontend_port}
          nodePort: $${nodeport_frontend}
    YAML

    # Backend Deployment + Service (NodePort)
    cat <<YAML > /tmp/backend.yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: backend
      namespace: app
      labels: { app: backend }
    spec:
      replicas: 1
      selector:
        matchLabels: { app: backend }
      template:
        metadata:
          labels: { app: backend }
        spec:
          containers:
            - name: backend
              image: $${backend_image}
              ports:
                - containerPort: $${backend_port}
              env:
                - name: PORT
                  value: "$${backend_port}"
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: backend-svc
      namespace: app
    spec:
      type: NodePort
      selector: { app: backend }
      ports:
        - name: http
          port: 80
          targetPort: $${backend_port}
          nodePort: $${nodeport_backend}
    YAML

    # Apply manifests
    kubectl apply -f /tmp/frontend.yaml
    kubectl apply -f /tmp/backend.yaml
  EOF

  tags = { Name = "${var.project_tag}-ec2" }
}

# -----------------------
# Outputs
# -----------------------
output "ec2_public_ip" {
  value = aws_instance.k3s_node.public_ip
}

output "frontend_url" {
  value = "http://${aws_instance.k3s_node.public_ip}:${var.nodeport_frontend}"
}

output "backend_url" {
  value = "http://${aws_instance.k3s_node.public_ip}:${var.nodeport_backend}"
}

