-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.vendedor (
  id_user character varying NOT NULL,
  name text NOT NULL,
  fecha_creacion timestamp without time zone NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL,
  CONSTRAINT vendedor_pkey PRIMARY KEY (id_user)
);
