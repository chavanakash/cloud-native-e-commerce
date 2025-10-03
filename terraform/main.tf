// Configure the AWS provider
provider "aws" {
  region = "us-east-1" # Choose a region, often us-east-1 has good Free Tier options
}

// 1. VPC and Subnet (minimal configuration)
resource "aws_vpc" "app_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = { Name = "App-VPC" }
}

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
  tags = { Name = "Public-Subnet" }
}

// 2. Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.app_vpc.id
  tags = { Name = "App-IGW" }
}

// 3. Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.app_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

// 4. Security Group (to allow web traffic and SSH)
resource "aws_security_group" "web_sg" {
  vpc_id = aws_vpc.app_vpc.id
  name   = "web-app-sg"

  // Inbound rules
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # WARNING: Wide open, restrict to your IP in production!
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Frontend port 3000 (usually proxied by Nginx/Caddy on port 80/443, but open for direct access)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Backend port 5000 (usually internal, but open for demonstration/debugging)
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Outbound rule (allow all traffic out)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// 5. EC2 Instance (Free Tier Eligible: t2.micro)
resource "aws_instance" "web_server" {
  ami           = "ami-041a81e99e46a9a21" # Example: Ubuntu Server 20.04 LTS (HVM), SSD Volume Type in us-east-1
  instance_type = "t2.micro"             // Free Tier Eligible!
  subnet_id     = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name      = var.key_name            // Use your key pair name
  associate_public_ip_address = true

  // User Data to install Docker and Docker Compose on first boot
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io
              sudo usermod -aG docker ubuntu
              sudo apt-get install -y docker-compose
              EOF

  tags = {
    Name = "shophu-Web-Server"
  }
}