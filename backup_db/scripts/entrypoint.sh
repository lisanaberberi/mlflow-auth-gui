#!/bin/sh
service cron start & tail -f /var/log/cron.log

# Start your main application (replace with the actual command)
exec "$@"