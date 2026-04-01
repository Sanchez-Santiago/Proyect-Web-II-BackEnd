-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.ai_analysis (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL UNIQUE,
  condition USER-DEFINED,
  estimated_price numeric,
  damage_report text,
  confidence numeric,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ai_analysis_pkey PRIMARY KEY (id),
  CONSTRAINT fk_ai_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT fk_favorites_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT fk_message_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id),
  CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES public.users(id),
  CONSTRAINT fk_message_receiver FOREIGN KEY (receiver_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_preferences (
  user_id uuid NOT NULL,
  year_range ARRAY,
  mileage_range ARRAY,
  color_range ARRAY,
  interior_range ARRAY,
  paint_range ARRAY,
  rims_range ARRAY,
  dashboard_range ARRAY,
  tires_range ARRAY,
  fuel_types ARRAY,
  vehicle_types ARRAY,
  brands ARRAY,
  models ARRAY,
  CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id),
  CONSTRAINT fk_preferences_user FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'BUYER'::user_role,
  province text NOT NULL,
  city text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vehicle_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL,
  url text NOT NULL,
  title text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT vehicle_images_pkey PRIMARY KEY (id),
  CONSTRAINT fk_vehicle_images_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL,
  vehicle_type USER-DEFINED NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  color text,
  fuel_type USER-DEFINED,
  transmission USER-DEFINED,
  mileage integer,
  price numeric,
  province text,
  city text,
  latitude numeric,
  longitude numeric,
  last_service_date date,
  last_oil_change date,
  accidents text,
  interior_condition integer CHECK (interior_condition >= 1 AND interior_condition <= 10),
  paint_condition integer CHECK (paint_condition >= 1 AND paint_condition <= 10),
  rims_condition integer CHECK (rims_condition >= 1 AND rims_condition <= 10),
  dashboard_condition integer CHECK (dashboard_condition >= 1 AND dashboard_condition <= 10),
  tires_condition integer CHECK (tires_condition >= 1 AND tires_condition <= 10),
  description text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_vehicle_seller FOREIGN KEY (seller_id) REFERENCES public.users(id)
);
