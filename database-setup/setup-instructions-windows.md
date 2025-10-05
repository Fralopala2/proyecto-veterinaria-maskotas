# Windows Setup Instructions

Since you're on a Windows system, these bash scripts are designed to run on your AWS EC2 Linux instance, not locally on Windows.

## How to Use These Scripts on AWS EC2

1. **Connect to your EC2 instance** using the AWS setup scripts in the `aws-setup` directory
2. **Upload the database-setup scripts** to your EC2 instance
3. **Run the scripts** on the Linux EC2 instance

### Step-by-Step Process

1. First, connect to your EC2 instance:
   ```powershell
   # Use one of the connection scripts from aws-setup directory
   .\aws-setup\quick-connect.ps1
   ```

2. Once connected to EC2, create the database-setup directory:
   ```bash
   mkdir -p ~/database-setup
   ```

3. Copy the script contents to your EC2 instance (you can copy-paste each script content)

4. Make scripts executable and run:
   ```bash
   chmod +x ~/database-setup/*.sh
   ./database-setup/setup-mariadb-complete.sh
   ```

## Alternative: Direct Commands on EC2

If you prefer to run commands directly instead of using scripts, execute these commands on your EC2 instance:

```bash
# Install MariaDB
sudo yum install -y mariadb-server.x86_64

# Start and enable service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Download world database
cd /tmp
wget https://downloads.mysql.com/docs/world-db.zip
unzip world-db.zip

# Restore database
sudo mysql < world-db/world.sql

# Verify installation
sudo mysql -e "SHOW DATABASES;"
sudo mysql -e "USE world; SHOW TABLES;"
sudo mysql -e "USE world; SELECT * FROM city LIMIT 100;"
```

The bash scripts in this directory are meant to be executed on the Linux EC2 instance, not on your local Windows machine.