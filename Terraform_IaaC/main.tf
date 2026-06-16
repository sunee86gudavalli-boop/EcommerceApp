### instance
resource "aws_instance" "dev_instance" {
  ami           = lookup(var.ami_id, var.region)
  instance_type = var.instance_type
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
  subnet_id     = aws_subnet.custom-dev-vpc-public-subnet-one.id
  vpc_security_group_ids = [aws_security_group.custom-dev-vpc-security-group.id]
  key_name      = var.key_name

  tags = {
    Name = var.ec2_tags
  }
}

### create security group
resource "aws_security_group" "custom-dev-vpc-security-group" {
  name          = "custom-dev-vpc-security-group"
  description   = "custom-dev-vpc-security-group"
  vpc_id        = aws_vpc.custom-dev-vpc-terraform.id

  ingress {
    description = "custom-dev-vpc-security-group"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow ssh access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow https access"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow ping access"
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "Custom security group"
  }
}
