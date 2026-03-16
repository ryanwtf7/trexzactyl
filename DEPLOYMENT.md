# Trexzactyl Deployment Guide

This guide covers the deployment and configuration steps for running Trexzactyl in production.

## File Permissions

Set the correct ownership for the Trexzactyl directory:

### Debian/Ubuntu (Apache/Nginx with www-data)
```bash
sudo chown -R www-data:www-data /var/www/trexzactyl
```

### CentOS/RHEL (Nginx)
```bash
sudo chown -R nginx:nginx /var/www/trexzactyl
```

## Queue Workers

Trexzactyl uses Laravel's queue system to handle background jobs such as server provisioning, backups, and scheduled tasks. You need to set up both the Laravel scheduler and a queue worker.

### 1. Crontab Setup

The Laravel scheduler needs to run every minute to check for scheduled tasks.

Open your crontab:
```bash
sudo crontab -e
```

Add the following line:
```cron
* * * * * php /var/www/trexzactyl/artisan schedule:run >> /dev/null 2>&1
```

This will run the Laravel scheduler every minute, which will then execute any scheduled tasks defined in the application.

### 2. Systemd Queue Worker

Create a systemd service to keep the queue worker running continuously.

Create the service file:
```bash
sudo nano /etc/systemd/system/trexzactyl.service
```

Paste the following configuration:
```ini
[Unit]
Description=Trexzactyl Queue Worker

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/trexzactyl/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

**Note for CentOS/RHEL:** Change `User=www-data` and `Group=www-data` to `User=nginx` and `Group=nginx`.

### 3. Enable and Start Services

Reload systemd to recognize the new service:
```bash
sudo systemctl daemon-reload
```

Enable and start the Trexzactyl queue worker:
```bash
sudo systemctl enable --now trexzactyl.service
```

Enable and start Redis (required for queues):
```bash
sudo systemctl enable --now redis-server
```

**Note for CentOS/RHEL:** Use `redis` instead of `redis-server`:
```bash
sudo systemctl enable --now redis
```

### 4. Verify Services

Check the status of the queue worker:
```bash
sudo systemctl status trexzactyl.service
```

Check the status of Redis:
```bash
sudo systemctl status redis-server  # or 'redis' on CentOS
```

View queue worker logs:
```bash
sudo journalctl -u trexzactyl.service -f
```

## Queue Configuration

The queue worker processes jobs in the following order:
1. **high** - Critical tasks (server creation, deletion)
2. **standard** - Normal tasks (backups, updates)
3. **low** - Non-urgent tasks (cleanup, notifications)

The worker will:
- Sleep for 3 seconds when no jobs are available
- Retry failed jobs up to 3 times
- Automatically restart if it crashes (up to 30 times in 180 seconds)

## Troubleshooting

### Queue Worker Not Processing Jobs

1. Check if the service is running:
   ```bash
   sudo systemctl status trexzactyl.service
   ```

2. Check Redis connection:
   ```bash
   redis-cli ping
   ```

3. Restart the queue worker:
   ```bash
   sudo systemctl restart trexzactyl.service
   ```

### Scheduled Tasks Not Running

1. Verify crontab is set up:
   ```bash
   sudo crontab -l
   ```

2. Check cron service is running:
   ```bash
   sudo systemctl status cron  # Debian/Ubuntu
   sudo systemctl status crond  # CentOS/RHEL
   ```

### Permission Errors

If you see permission errors in the logs, ensure the web server user has proper ownership:
```bash
sudo chown -R www-data:www-data /var/www/trexzactyl
sudo chmod -R 755 /var/www/trexzactyl/storage
sudo chmod -R 755 /var/www/trexzactyl/bootstrap/cache
```

## Maintenance

### Restarting the Queue Worker After Updates

After deploying code changes, restart the queue worker to load the new code:
```bash
sudo systemctl restart trexzactyl.service
```

### Monitoring Queue Performance

Monitor the queue in real-time:
```bash
php artisan queue:monitor
```

List failed jobs:
```bash
php artisan queue:failed
```

Retry all failed jobs:
```bash
php artisan queue:retry all
```

Clear all failed jobs:
```bash
php artisan queue:flush
```
