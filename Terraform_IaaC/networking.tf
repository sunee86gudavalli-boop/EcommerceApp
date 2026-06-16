### Create VPC
resource "aws_vpc" "custom-dev-vpc-terraform" {
	cidr_block            = var.cidr
	instance_tenancy      = var.instance_tenancy
	enable_dns_hostnames  = var.enable_dns_hostnames
	enable_dns_support    = var.enable_dns_support

	tags = {
		Name = var.tags
	}
}

### pulic Subnet
resource "aws_subnet" "custom-dev-vpc-public-subnet-one" {
  vpc_id      = aws_vpc.custom-dev-vpc-terraform.id
  map_public_ip_on_launch = true
  availability_zone = var.availability_zone_one
  cidr_block  = var.public_subnet_one

  tags = {
    Name = var.public_subnet_one_tags
  }
}

resource "aws_subnet" "custom-dev-vpc-public-subnet-two" {
  vpc_id      = aws_vpc.custom-dev-vpc-terraform.id
  map_public_ip_on_launch = true
  availability_zone = var.availability_zone_two
  cidr_block  = var.public_subnet_two

  tags = {
    Name = var.public_subnet_two_tags
  }
}

### private subnet
resource "aws_subnet" "custom-dev-vpc-private-subnet-one" {
  vpc_id      = aws_vpc.custom-dev-vpc-terraform.id
  map_public_ip_on_launch = false
  availability_zone = var.availability_zone_one
  cidr_block  = var.private_dev_subnet_one

  tags = {
    Name = var.private_dev_subnet_one_tags
  }
}

resource "aws_subnet" "custom-dev-vpc-private-subnet-two" {
  vpc_id      = aws_vpc.custom-dev-vpc-terraform.id
  map_public_ip_on_launch = false
  availability_zone = var.availability_zone_two
  cidr_block  = var.private_dev_subnet_two

  tags = {
    Name = var.private_dev_subnet_two_tags
  }
}

### IGW
resource "aws_internet_gateway" "custom-vpc-IGW" {
  vpc_id      = aws_vpc.custom-dev-vpc-terraform.id
  tags = {
    Name = var.custom-vpc-IGW
  }
}

#private route table
resource "aws_route_table" "private_route_table" {
  vpc_id      = aws_vpc.custom-dev-vpc-terraform.id

  tags = {
    Name = var.private_route_table
  }
}
#public route table
resource "aws_route_table" "public_route_table" {
  vpc_id      = aws_vpc.custom-dev-vpc-terraform.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.custom-vpc-IGW.id
  }

  tags = {
    Name = var.public_route_table
  }
}

resource "aws_route_table_association" "public_route_association-1" {
  subnet_id   =  aws_subnet.custom-dev-vpc-public-subnet-one.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_route_association-2" {
  subnet_id   =  aws_subnet.custom-dev-vpc-public-subnet-two.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "private_route_association-1" {
  subnet_id   =  aws_subnet.custom-dev-vpc-private-subnet-one.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "private_route_association-2" {
  subnet_id   =  aws_subnet.custom-dev-vpc-private-subnet-two.id
  route_table_id = aws_route_table.private_route_table.id
}
