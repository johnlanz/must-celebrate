create table public.profiles (
  id uuid not null,
  role text null,
  phone text null,
  avatar_url text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  first_name character varying null,
  last_name character varying null,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint profiles_role_check check (
    (
      role = any (
        array[
          'customer'::text,
          'vendor'::text,
          'planner'::text,
          'admin'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.admin_logs (
  id uuid not null default gen_random_uuid (),
  admin_id uuid null,
  action text null,
  target_table text null,
  target_id uuid null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint admin_logs_pkey primary key (id),
  constraint admin_logs_admin_id_fkey foreign KEY (admin_id) references profiles (id)
) TABLESPACE pg_default;


create table public.bookings (
  id uuid not null default gen_random_uuid (),
  event_id uuid null,
  vendor_id uuid null,
  status text null,
  total_amount numeric null,
  payment_status text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint bookings_pkey primary key (id),
  constraint bookings_event_id_fkey foreign KEY (event_id) references events (id),
  constraint bookings_vendor_id_fkey foreign KEY (vendor_id) references profiles (id),
  constraint bookings_payment_status_check check (
    (
      payment_status = any (
        array['unpaid'::text, 'paid'::text, 'refunded'::text]
      )
    )
  ),
  constraint bookings_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'confirmed'::text,
          'cancelled'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.content_flags (
  id uuid not null default gen_random_uuid (),
  flagged_by uuid null,
  content_type text null,
  content_id uuid null,
  reason text null,
  resolved boolean null default false,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint content_flags_pkey primary key (id),
  constraint content_flags_flagged_by_fkey foreign KEY (flagged_by) references profiles (id)
) TABLESPACE pg_default;

create table public.event_vendors (
  id uuid not null default gen_random_uuid (),
  event_id uuid null,
  vendor_id uuid null,
  service_type text null,
  booked boolean null default false,
  constraint event_vendors_pkey primary key (id),
  constraint event_vendors_event_id_fkey foreign KEY (event_id) references events (id),
  constraint event_vendors_vendor_id_fkey foreign KEY (vendor_id) references profiles (id)
) TABLESPACE pg_default;

create table public.events (
  id uuid not null default gen_random_uuid (),
  customer_id uuid null,
  name text null,
  theme text null,
  event_date date null,
  location text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint events_pkey primary key (id),
  constraint events_customer_id_fkey foreign KEY (customer_id) references profiles (id)
) TABLESPACE pg_default;

create table public.messages (
  id uuid not null default gen_random_uuid (),
  sender_id uuid null,
  recipient_id uuid null,
  message text null,
  read boolean null default false,
  sent_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint messages_pkey primary key (id),
  constraint messages_recipient_id_fkey foreign KEY (recipient_id) references profiles (id),
  constraint messages_sender_id_fkey foreign KEY (sender_id) references profiles (id)
) TABLESPACE pg_default;

create table public.payments (
  id uuid not null default gen_random_uuid (),
  booking_id uuid null,
  amount numeric null,
  method text null,
  paid_at timestamp without time zone null,
  constraint payments_pkey primary key (id),
  constraint payments_booking_id_fkey foreign KEY (booking_id) references bookings (id)
) TABLESPACE pg_default;

create table public.planner_bookings (
  id uuid not null default gen_random_uuid (),
  planner_id uuid null,
  vendor_id uuid null,
  event_id uuid null,
  status text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint planner_bookings_pkey primary key (id),
  constraint planner_bookings_event_id_fkey foreign KEY (event_id) references events (id),
  constraint planner_bookings_planner_id_fkey foreign KEY (planner_id) references profiles (id),
  constraint planner_bookings_vendor_id_fkey foreign KEY (vendor_id) references profiles (id)
) TABLESPACE pg_default;

create table public.planner_notes (
  id uuid not null default gen_random_uuid (),
  planner_id uuid null,
  customer_id uuid null,
  note text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint planner_notes_pkey primary key (id),
  constraint planner_notes_customer_id_fkey foreign KEY (customer_id) references profiles (id),
  constraint planner_notes_planner_id_fkey foreign KEY (planner_id) references profiles (id)
) TABLESPACE pg_default;

create table public.vendor_availability (
  id uuid not null default gen_random_uuid (),
  vendor_id uuid null,
  date date null,
  available boolean null default true,
  constraint vendor_availability_pkey primary key (id),
  constraint vendor_availability_vendor_id_fkey foreign KEY (vendor_id) references profiles (id)
) TABLESPACE pg_default;

create table public.vendor_profiles (
  id uuid not null,
  business_name text null,
  description text null,
  category text null,
  pricing jsonb null,
  gallery jsonb null,
  subscription_tier text null default 'free'::text,
  constraint vendor_profiles_pkey primary key (id),
  constraint vendor_profiles_id_fkey foreign KEY (id) references profiles (id)
) TABLESPACE pg_default;

create table public.vendor_reviews (
  id uuid not null default gen_random_uuid (),
  vendor_id uuid null,
  customer_id uuid null,
  rating integer null,
  review text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint vendor_reviews_pkey primary key (id),
  constraint vendor_reviews_customer_id_fkey foreign KEY (customer_id) references profiles (id),
  constraint vendor_reviews_vendor_id_fkey foreign KEY (vendor_id) references profiles (id),
  constraint vendor_reviews_rating_check check (
    (
      (rating >= 1)
      and (rating <= 5)
    )
  )
) TABLESPACE pg_default;

create table public.wishlists (
  id uuid not null default gen_random_uuid (),
  customer_id uuid null,
  vendor_id uuid null,
  notes text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint wishlists_pkey primary key (id),
  constraint wishlists_customer_id_fkey foreign KEY (customer_id) references profiles (id),
  constraint wishlists_vendor_id_fkey foreign KEY (vendor_id) references profiles (id)
) TABLESPACE pg_default;




alter table public.profiles enable row level security;

-- allow users to create their own profile
create policy "insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

-- allow users to read profiles (or scope as you prefer)
create policy "read profiles"
on public.profiles for select
to authenticated
using (true);

-- allow users to update their own profile
create policy "update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
