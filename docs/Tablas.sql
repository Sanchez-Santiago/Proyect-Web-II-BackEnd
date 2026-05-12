-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action character varying NOT NULL,
  table_name character varying,
  record_id uuid,
  ip_address character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.buyer_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  minimum_budget numeric,
  maximum_budget numeric,
  preferred_brand character varying,
  preferred_model character varying,
  minimum_year integer,
  maximum_year integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT buyer_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT buyer_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.chats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chats_pkey PRIMARY KEY (id),
  CONSTRAINT chats_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id)
);
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  publication_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT favorites_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL,
  user_id uuid NOT NULL,
  message text NOT NULL,
  status USER-DEFINED DEFAULT 'SENT'::message_status,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id),
  CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type USER-DEFINED NOT NULL,
  title character varying,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.password_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT password_history_pkey PRIMARY KEY (id),
  CONSTRAINT password_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.price_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL,
  amount numeric NOT NULL,
  currency character varying DEFAULT 'USD'::character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT price_history_pkey PRIMARY KEY (id),
  CONSTRAINT price_history_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id)
);
CREATE TABLE public.publication_features (
  publication_id uuid NOT NULL,
  feature_id uuid NOT NULL,
  CONSTRAINT publication_features_pkey PRIMARY KEY (publication_id, feature_id),
  CONSTRAINT publication_features_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.vehicle_features(id),
  CONSTRAINT publication_features_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id)
);
CREATE TABLE public.publication_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL,
  old_status USER-DEFINED,
  new_status USER-DEFINED,
  changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT publication_status_history_pkey PRIMARY KEY (id),
  CONSTRAINT publication_status_history_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id)
);
CREATE TABLE public.publications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  title character varying,
  description text,
  price numeric NOT NULL,
  currency character varying DEFAULT 'USD'::character varying,
  province character varying,
  city character varying,
  latitude numeric,
  longitude numeric,
  status USER-DEFINED DEFAULT 'ACTIVE'::publication_status,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT publications_pkey PRIMARY KEY (id),
  CONSTRAINT publications_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id),
  CONSTRAINT publications_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id)
);
CREATE TABLE public.refresh_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token text NOT NULL,
  expires_at timestamp without time zone NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  publication_id uuid NOT NULL,
  reason character varying,
  description text,
  status USER-DEFINED DEFAULT 'PENDING'::report_status,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT reports_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id)
);
CREATE TABLE public.saved_searches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  filters_json jsonb NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT saved_searches_pkey PRIMARY KEY (id),
  CONSTRAINT saved_searches_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name character varying NOT NULL,
  birth_date date,
  email character varying NOT NULL UNIQUE,
  password_hash text NOT NULL,
  phone character varying,
  alternative_phone character varying,
  role USER-DEFINED NOT NULL DEFAULT 'BUYER'::user_role,
  verified boolean DEFAULT false,
  failed_login_attempts integer DEFAULT 0,
  province character varying,
  city character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vehicle_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL,
  paint_condition integer CHECK (paint_condition >= 1 AND paint_condition <= 10),
  engine_condition integer CHECK (engine_condition >= 1 AND engine_condition <= 10),
  interior_condition integer CHECK (interior_condition >= 1 AND interior_condition <= 10),
  tires_condition integer CHECK (tires_condition >= 1 AND tires_condition <= 10),
  rims_condition integer CHECK (rims_condition >= 1 AND rims_condition <= 10),
  suspension_condition integer CHECK (suspension_condition >= 1 AND suspension_condition <= 10),
  transmission_condition integer CHECK (transmission_condition >= 1 AND transmission_condition <= 10),
  lights_condition integer CHECK (lights_condition >= 1 AND lights_condition <= 10),
  overall_score numeric,
  estimated_price numeric,
  damage_detected text,
  confidence_score numeric,
  ai_provider character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT vehicle_analytics_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_analytics_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.vehicle_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL,
  document_type USER-DEFINED NOT NULL,
  document_url text NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT vehicle_documents_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_documents_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.vehicle_features (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  feature_name character varying NOT NULL UNIQUE,
  CONSTRAINT vehicle_features_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vehicle_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL,
  image_url text NOT NULL,
  image_name character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT vehicle_images_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_images_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.vehicle_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL,
  user_id uuid,
  ip_address character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT vehicle_views_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_views_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id),
  CONSTRAINT vehicle_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  model character varying NOT NULL,
  brand character varying NOT NULL,
  version character varying,
  year integer NOT NULL,
  vehicle_type USER-DEFINED NOT NULL,
  fuel_type USER-DEFINED NOT NULL,
  transmission USER-DEFINED NOT NULL,
  color character varying,
  doors integer,
  engine character varying,
  mileage integer DEFAULT 0,
  accidents text,
  owners_count integer DEFAULT 1,
  vin character varying,
  license_plate character varying,
  has_debt boolean DEFAULT false,
  debt_amount numeric DEFAULT 0,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT vehicles_pkey PRIMARY KEY (id)
);
