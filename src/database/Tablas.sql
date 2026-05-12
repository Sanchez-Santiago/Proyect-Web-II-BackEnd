CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('BUYER', 'SELLER', 'ADMIN');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'BLOCKED');
CREATE TYPE seller_type AS ENUM ('PARTICULAR', 'AGENCIA', 'CONCESIONARIA');
CREATE TYPE fuel_type AS ENUM ('GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG', 'CNG', 'OTHER');
CREATE TYPE transmission AS ENUM ('MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT', 'OTHER');
CREATE TYPE publication_status AS ENUM ('A_LA_VENTA', 'RESERVADO', 'VENDIDO', 'BLOQUEADO', 'FRAUDE', 'SUSPENDIDO', 'PAUSADO');
CREATE TYPE moderation_status AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'REVISION_MANUAL');
CREATE TYPE lead_status AS ENUM ('NUEVO', 'CONTACTADO', 'NEGOCIANDO', 'GANADO', 'PERDIDO');
CREATE TYPE message_status AS ENUM ('ENVIADO', 'LEIDO', 'ELIMINADO');
CREATE TYPE currency AS ENUM ('ARS', 'USD');
CREATE TYPE sale_status AS ENUM ('PENDIENTE', 'COMPLETADA', 'CANCELADA');
CREATE TYPE alert_type AS ENUM ('OPORTUNIDAD', 'ANOMALIA', 'ACTIVIDAD_SOSPECHOSA', 'SISTEMA', 'PRECIO');
CREATE TYPE alert_severity AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');
CREATE TYPE alert_status AS ENUM ('ABIERTA', 'LEIDA', 'RESUELTA', 'DESCARTADA');
CREATE TYPE ai_analysis_type AS ENUM ('VEHICULO', 'PUBLICACION', 'PRECIO', 'RIESGO', 'FOTO', 'RESPUESTA');
CREATE TYPE recommendation_status AS ENUM ('PENDIENTE', 'VISTA', 'DESCARTADA', 'FAVORITA');
CREATE TYPE analytics_event_type AS ENUM ('VISITA_PUBLICACION', 'CONTACTO_VENDEDOR', 'FAVORITO_AGREGADO', 'BUSQUEDA', 'LOGIN', 'PUBLICACION_CREADA', 'VENTA');

CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  birth_date date NOT NULL,
  phone text NOT NULL,
  alternate_phone text,
  role user_role NOT NULL DEFAULT 'BUYER',
  account_status account_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at timestamp without time zone,
  blocked_at timestamp without time zone,
  blocked_reason text,
  suspicious_score numeric(5, 2),
  email text NOT NULL UNIQUE,
  verified boolean NOT NULL DEFAULT false,
  password text NOT NULL,
  password_created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  failed_attempts integer NOT NULL DEFAULT 0,
  seller_type seller_type NOT NULL DEFAULT 'PARTICULAR',
  business_name text,
  tax_id text,
  contact_email text,
  contact_phone text,
  province text,
  city text,
  address text,
  accepts_trade_in boolean NOT NULL DEFAULT false,
  seller_description text,
  ai_auto_reply boolean NOT NULL DEFAULT false
);

CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text NOT NULL,
  brand text NOT NULL,
  version text,
  year integer NOT NULL,
  fuel_type fuel_type,
  transmission transmission,
  color text,
  doors integer,
  engine text,
  kilometers integer,
  accidents text,
  owner_count integer,
  has_debt_or_taxes boolean,
  debt_or_taxes_note text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.analytic_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL UNIQUE REFERENCES public.vehicles(id) ON DELETE CASCADE,
  paint_condition integer CHECK (paint_condition BETWEEN 1 AND 10),
  engine_condition integer CHECK (engine_condition BETWEEN 1 AND 10),
  interior_condition integer CHECK (interior_condition BETWEEN 1 AND 10),
  tires_condition integer CHECK (tires_condition BETWEEN 1 AND 10),
  rims_condition integer CHECK (rims_condition BETWEEN 1 AND 10),
  suspension_condition integer CHECK (suspension_condition BETWEEN 1 AND 10),
  transmission_condition integer CHECK (transmission_condition BETWEEN 1 AND 10),
  lights_condition integer CHECK (lights_condition BETWEEN 1 AND 10)
);

CREATE TABLE public.vehicle_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  name text,
  sort_order integer NOT NULL DEFAULT 0,
  ai_quality_score numeric(5, 2) CHECK (ai_quality_score BETWEEN 0 AND 100),
  ai_suggestion text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE
);

CREATE TABLE public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id),
  seller_id uuid NOT NULL REFERENCES public.users(id),
  reviewed_by_id uuid REFERENCES public.users(id),
  current_price_history_id uuid UNIQUE,
  title text,
  description text,
  price numeric(12, 2) NOT NULL,
  currency currency NOT NULL DEFAULT 'ARS',
  city text NOT NULL,
  province text NOT NULL,
  status publication_status NOT NULL DEFAULT 'A_LA_VENTA',
  moderation_status moderation_status NOT NULL DEFAULT 'PENDIENTE',
  rejection_reason text,
  ai_score numeric(5, 2) CHECK (ai_score BETWEEN 0 AND 100),
  views_count integer NOT NULL DEFAULT 0,
  contact_count integer NOT NULL DEFAULT 0,
  favorite_count integer NOT NULL DEFAULT 0,
  published_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at timestamp without time zone
);

CREATE TABLE public.price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount numeric(12, 2) NOT NULL,
  currency currency NOT NULL DEFAULT 'ARS',
  publication_id uuid NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE
);

ALTER TABLE public.publications
  ADD CONSTRAINT fk_publications_current_price
  FOREIGN KEY (current_price_history_id) REFERENCES public.price_history(id);

CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id uuid NOT NULL REFERENCES public.users(id),
  publication_id uuid NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
  CONSTRAINT favorites_user_publication_unique UNIQUE (user_id, publication_id)
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL,
  buyer_id uuid NOT NULL REFERENCES public.users(id),
  seller_id uuid NOT NULL REFERENCES public.users(id),
  publication_id uuid REFERENCES public.publications(id),
  user_id uuid NOT NULL REFERENCES public.users(id),
  message text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at timestamp without time zone,
  status message_status NOT NULL DEFAULT 'ENVIADO',
  lead_status lead_status NOT NULL DEFAULT 'NUEVO',
  last_message_at timestamp without time zone
);

CREATE TABLE public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  min_budget numeric(12, 2),
  max_budget numeric(12, 2),
  preferred_brand text,
  preferred_model text,
  year_from integer,
  year_to integer,
  fuel_types fuel_type[] NOT NULL DEFAULT '{}',
  transmissions transmission[] NOT NULL DEFAULT '{}',
  provinces text[] NOT NULL DEFAULT '{}',
  alert_enabled boolean NOT NULL DEFAULT true
);

CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES public.publications(id),
  buyer_id uuid REFERENCES public.users(id),
  seller_id uuid NOT NULL REFERENCES public.users(id),
  final_price numeric(12, 2) NOT NULL,
  currency currency NOT NULL DEFAULT 'ARS',
  status sale_status NOT NULL DEFAULT 'PENDIENTE',
  sold_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.ai_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type ai_analysis_type NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE,
  publication_id uuid REFERENCES public.publications(id) ON DELETE CASCADE,
  requested_by_id uuid REFERENCES public.users(id),
  fair_price numeric(12, 2),
  estimated_price numeric(12, 2),
  depreciation_estimate numeric(12, 2),
  market_delta_percent numeric(6, 2),
  risk_score numeric(5, 2),
  opportunity_score numeric(5, 2),
  confidence numeric(5, 2),
  summary text,
  damage_report text,
  suggestions text,
  metadata jsonb,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  publication_id uuid NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
  score numeric(5, 2) NOT NULL,
  reason text,
  status recommendation_status NOT NULL DEFAULT 'PENDIENTE',
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT recommendations_user_publication_unique UNIQUE (user_id, publication_id)
);

CREATE TABLE public.vehicle_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text,
  publication_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  publication_id uuid REFERENCES public.publications(id) ON DELETE SET NULL,
  type alert_type NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'MEDIA',
  status alert_status NOT NULL DEFAULT 'ABIERTA',
  title text NOT NULL,
  message text,
  metadata jsonb,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at timestamp without time zone,
  resolved_at timestamp without time zone
);

CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  publication_id uuid REFERENCES public.publications(id) ON DELETE SET NULL,
  event_type analytics_event_type NOT NULL,
  metadata jsonb,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_search ON public.vehicles(brand, model, year);
CREATE INDEX idx_vehicle_images_vehicle ON public.vehicle_images(vehicle_id);
CREATE INDEX idx_publications_status ON public.publications(status, moderation_status);
CREATE INDEX idx_publications_location ON public.publications(province, city);
CREATE INDEX idx_publications_price ON public.publications(price);
CREATE INDEX idx_price_history_publication ON public.price_history(publication_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_messages_chat_created ON public.messages(chat_id, created_at);
CREATE INDEX idx_messages_buyer ON public.messages(buyer_id);
CREATE INDEX idx_messages_seller ON public.messages(seller_id);
CREATE INDEX idx_messages_publication ON public.messages(publication_id);
CREATE INDEX idx_sales_seller_status ON public.sales(seller_id, status);
CREATE INDEX idx_ai_analyses_vehicle ON public.ai_analyses(vehicle_id);
CREATE INDEX idx_ai_analyses_publication ON public.ai_analyses(publication_id);
CREATE INDEX idx_recommendations_user_score ON public.recommendations(user_id, score);
CREATE INDEX idx_vehicle_comparisons_user ON public.vehicle_comparisons(user_id);
CREATE INDEX idx_alerts_status_severity ON public.alerts(status, severity);
CREATE INDEX idx_alerts_user ON public.alerts(user_id);
CREATE INDEX idx_analytics_events_type_created ON public.analytics_events(event_type, created_at);
