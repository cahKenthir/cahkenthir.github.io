#!/bin/bash

# Backup database
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "Starting backup at $(date)"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec -t postgres pg_dumpall -U imeai > $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Backup AI models
tar -czvf $BACKUP_DIR/models_backup_$TIMESTAMP.tar.gz /models

# Backup uploads
tar -czvf $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz /uploads

# Sync with S3 if enabled
if [ "$STORAGE_TYPE" == "s3" ]; then
  aws s3 sync $BACKUP_DIR s3://$S3_BUCKET/backups/
fi

echo "Backup completed at $(date)"