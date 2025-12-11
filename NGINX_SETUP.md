# NGINX Reverse Proxy Setup Guide

This guide explains how to set up the outer NGINX configuration on your dedicated server to forward traffic to your Docker container.

## Architecture

```
Internet
   │
   └─> Your Dedicated Server (Port 80/443)
         │
         └─> NGINX (nginx.outer.conf) - Reverse Proxy
               │
               └─> localhost:8080
                     │
                     └─> Docker Container (Nginx inside container)
```

## Installation Steps

### 1. Copy the configuration file

```bash
# Copy the configuration file to NGINX sites-available
sudo cp nginx.outer.conf /etc/nginx/sites-available/qwranks.com

# Create symlink to enable it
sudo ln -s /etc/nginx/sites-available/qwranks.com /etc/nginx/sites-enabled/
```

### 2. Test the configuration

```bash
# Test NGINX configuration for syntax errors
sudo nginx -t
```

### 3. Reload NGINX

```bash
# If test passes, reload NGINX
sudo systemctl reload nginx
# OR
sudo service nginx reload
```

### 4. Set up SSL (Let's Encrypt)

```bash
# Install certbot if not already installed
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate for both domains
sudo certbot --nginx -d qwranks.com -d www.qwranks.com

# Certbot will automatically update the nginx config with SSL paths
```

After running certbot, you'll need to uncomment the SSL lines in the config:

```nginx
ssl_certificate /etc/letsencrypt/live/qwranks.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/qwranks.com/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
# ... etc
```

### 5. Verify it's working

```bash
# Check NGINX status
sudo systemctl status nginx

# Check if Docker container is running on port 8080
sudo netstat -tlnp | grep 8080
# OR
sudo ss -tlnp | grep 8080

# Test from command line
curl -I http://localhost:8080
```

## Configuration Details

### What this config does:

1. **HTTP to HTTPS redirect**: Automatically redirects all HTTP traffic to HTTPS
2. **Domain handling**: Handles both `qwranks.com` and `www.qwranks.com`
3. **Reverse proxy**: Forwards all requests to `localhost:8080` (your Docker container)
4. **Header forwarding**: Passes important headers like `X-Real-IP`, `X-Forwarded-For`, etc.
5. **WebSocket support**: Ready for WebSocket connections if needed
6. **Security headers**: Adds security headers to responses
7. **Logging**: Separate log files for each domain

### Important Headers Explained:

- `X-Real-IP`: The actual client IP address
- `X-Forwarded-For`: Chain of proxy IPs (useful for debugging)
- `X-Forwarded-Proto`: Original protocol (http/https)
- `Host`: Original host header (important for the container's NGINX)

## Troubleshooting

### Container not accessible

```bash
# Make sure Docker container is running
docker ps

# Check if port 8080 is listening
sudo netstat -tlnp | grep 8080

# Check Docker container logs
docker logs <container-name>
```

### NGINX errors

```bash
# Check NGINX error logs
sudo tail -f /var/log/nginx/qwranks.com.error.log
sudo tail -f /var/log/nginx/error.log

# Check NGINX access logs
sudo tail -f /var/log/nginx/qwranks.com.access.log
```

### Permission issues

```bash
# Ensure NGINX can read the config
sudo chmod 644 /etc/nginx/sites-available/qwranks.com

# Check NGINX user
grep user /etc/nginx/nginx.conf
```

## Firewall Configuration

Make sure ports 80 and 443 are open:

```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## DNS Configuration

Make sure your DNS records point to your server:

```
A Record:     qwranks.com      → Your Server IP
A Record:     www.qwranks.com → Your Server IP
```

You can verify DNS with:
```bash
dig qwranks.com
dig www.qwranks.com
```

## Testing

### Test locally (from server):

```bash
# Test HTTP redirect
curl -I http://localhost

# Test HTTPS (after SSL setup)
curl -I https://localhost

# Test with domain
curl -I -H "Host: qwranks.com" http://localhost
```

### Test from external:

```bash
# From your local machine
curl -I http://qwranks.com
curl -I https://qwranks.com
```

## Maintenance

### Renew SSL certificates

Let's Encrypt certificates expire every 90 days. Certbot usually sets up auto-renewal, but you can test it:

```bash
# Test renewal
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew
```

### Update configuration

After modifying the config:

```bash
# Test config
sudo nginx -t

# Reload (graceful, no downtime)
sudo systemctl reload nginx

# OR restart (brief downtime)
sudo systemctl restart nginx
```

## Notes

- The configuration assumes your Docker container is running on `localhost:8080`
- SSL configuration is commented out initially - uncomment after setting up Let's Encrypt
- Both domains (with and without www) are configured identically
- Logs are stored in `/var/log/nginx/` for each domain separately
