
# 2. Security Group to control traffic to the database
resource "aws_security_group" "rds_sg" {
  name        = "mysql-rds-security-group"
  description = "Allow MySQL traffic from the application instance"
  vpc_id      = aws_vpc.custom-vpc-terraform.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    security_groups = [aws_security_group.custom-vpc-security-group.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "rds-mysql-sg"
  }
}

resource "aws_secretsmanager_secret" "rds_credentials_new" {
  name_prefix = var.db_secret_name_prefix

  tags = {
    Name = var.db_secret_name_prefix
  }
}

resource "aws_secretsmanager_secret_version" "rds_credentials_new" {
  secret_id = aws_secretsmanager_secret.rds_credentials_new.id
  secret_string = jsonencode({
    username = var.db_username
    password = var.db_password
    engine   = "mysql"
    dbname   = var.db_name
  })
}

# 3. DB Subnet Group (Assigns RDS to specific subnets inside your VPC)
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "mysql-db-subnet-group"
  subnet_ids = [
    aws_subnet.custom-vpc-private-subnet-one.id,
    aws_subnet.custom-vpc-private-subnet-two.id,
  ]

  tags = {
    Name = "My DB Subnet Group"
  }
}

# 4. AWS RDS MySQL Instance Configuration
resource "aws_db_instance" "mysql_db" {
  identifier           = "my-mysql-database"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = var.db_instance_class
  allocated_storage    = 20
  max_allocated_storage = 100
  storage_type         = "gp3"

  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  publicly_accessible    = false
  skip_final_snapshot    = true

  tags = {
    Environment = "Dev"
    ManagedBy   = "Terraform"
  }
}

# 1. IAM Execution Role for EC2
# -------------------------------------------------------------

# Trust policy allowing EC2 service to assume this role
data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2_rds_execution_role" {
  name               = "ec2-rds-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

# IAM Policy allowing EC2 to read Secrets Manager (Best Practice for credentials)
resource "aws_iam_policy" "secrets_policy" {
  name        = "ec2-secrets-manager-policy"
  description = "Allows EC2 to retrieve database credentials"
  policy      = data.aws_iam_policy_document.secrets_access.json
}

data "aws_iam_policy_document" "secrets_access" {
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
    ]
    resources = [
      aws_secretsmanager_secret.rds_credentials_new.arn,
    ]
  }
}

# Attach the Secrets Manager policy to our Execution Role
resource "aws_iam_policy_attachment" "attach_secrets" {
  name       = "secrets-attachment"
  roles      = [aws_iam_role.ec2_rds_execution_role.name]
  policy_arn = aws_iam_policy.secrets_policy.arn
}

# Create the Instance Profile that gets attached physically to the EC2 instance
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-rds-instance-profile"
  role = aws_iam_role.ec2_rds_execution_role.name
}

# 5. Output values to view after deployment
output "rds_endpoint" {
  description = "The connection endpoint for the MySQL database"
  value       = aws_db_instance.mysql_db.endpoint
}

output "rds_secret_arn" {
  description = "The Secrets Manager ARN containing the RDS credentials"
  value       = aws_secretsmanager_secret.rds_credentials_new.arn
}

output "rds_secret_name" {
  description = "The Secrets Manager name containing the RDS credentials"
  value       = aws_secretsmanager_secret.rds_credentials_new.name
}
