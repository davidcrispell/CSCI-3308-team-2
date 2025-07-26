#!/bin/bash

# DO NOT PUSH THIS FILE TO GITHUB
# This file contains sensitive information and should be kept private

# TODO: Set your PostgreSQL URI - Use the External Database URL from the Render dashboard
PG_URI="postgresql://users_db_hhmw_user:1tL6K5vX2JNmDVQMZFWH47kvWTmpejWf@dpg-d219htbipnbc73d5s3n0-a.oregon-postgres.render.com/users_db_hhmw"

# Execute each .sql file in the directory
for file in init_data/*.sql; do
    echo "Executing $file..."
    psql $PG_URI -f "$file"
done