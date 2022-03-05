#!/bin/bash
set -e
export PGPASSWORD=$POSTGRES_PASSWORD;
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE $APP_DB_NAME;
  \connect $APP_DB_NAME $POSTGRES_USER
  BEGIN;
    CREATE EXTENSION IF NOT EXISTS postgis;
  COMMIT;
  CREATE USER $APP_DB_USER WITH PASSWORD '$APP_DB_PASS';
  GRANT ALL PRIVILEGES ON DATABASE $APP_DB_NAME TO $APP_DB_USER;
  \connect $APP_DB_NAME $APP_DB_USER
  BEGIN;
    CREATE TABLE IF NOT EXISTS interactions (
      id SERIAL,
      chat_id bigint NOT NULL,
      curr_step_id character varying,
      interaction_state character varying,
      created_at timestamp with time zone,
      updated_at timestamp with time zone,
      description character varying,
      location geometry,
      site_of_interest character varying,
      photo character varying,
      CONSTRAINT data_pkey PRIMARY KEY (id)
	  );
  COMMIT;
EOSQL
