-- ───────────────────────────────────────────────────────────
-- 0. (Optional) Clean up old objects if running multiple times
-- ───────────────────────────────────────────────────────────
drop table if exists payment_details cascade;
drop table if exists order_items cascade;
drop table if exists order_details cascade;
drop table if exists cart_items cascade;
drop table if exists carts cascade;
drop table if exists wishlist cascade;
drop table if exists products_skus cascade;
drop table if exists product_attributes cascade;
drop table if exists products cascade;
drop table if exists sub_categories cascade;
drop table if exists categories cascade;
drop table if exists stores cascade;
drop table if exists addresses cascade;
drop table if exists profiles cascade;
drop type if exists product_attribute_type;

-- ───────────────────────────────────────────────────────────
-- 1. Profiles (backed by Supabase Auth)
-- ───────────────────────────────────────────────────────────
create table profiles (
  id             uuid         primary key references auth.users(id) on delete cascade,
  avatar         varchar,
  first_name     varchar,
  last_name      varchar,
  birth_of_date  date,
  phone_number   varchar,
  created_at     timestamptz  not null default now()
);

-- ───────────────────────────────────────────────────────────
-- 2. Addresses
-- ───────────────────────────────────────────────────────────
create table addresses (
  id              serial       primary key,
  user_id         uuid         not null references profiles(id) on delete cascade,
  title           varchar,
  address_line_1  varchar,
  address_line_2  varchar,
  country         varchar,
  city            varchar,
  postal_code     varchar,
  landmark        varchar,
  phone_number    varchar,
  created_at      timestamptz  not null default now(),
  deleted_at      timestamptz
);

-- ───────────────────────────────────────────────────────────
-- 3. Stores (restaurants)
-- ───────────────────────────────────────────────────────────
create table stores (
  id              serial       primary key,
  name            varchar      not null,
  description     text,
  address_line_1  varchar,
  address_line_2  varchar,
  country         varchar,
  city            varchar,
  postal_code     varchar,
  phone_number    varchar,
  email           varchar,
  created_at      timestamptz  not null default now(),
  deleted_at      timestamptz
);

-- ───────────────────────────────────────────────────────────
-- 4. Categories per store
-- ───────────────────────────────────────────────────────────
create table categories (
  id              serial       primary key,
  store_id        integer      not null references stores(id) on delete cascade,
  name            varchar      not null,
  description     text,
  created_at      timestamptz  not null default now(),
  deleted_at      timestamptz
);

-- ───────────────────────────────────────────────────────────
-- 5. Sub‐categories per store
-- ───────────────────────────────────────────────────────────
create table sub_categories (
  id              serial       primary key,
  store_id        integer      not null references stores(id) on delete cascade,
  parent_id       integer      not null references categories(id) on delete cascade,
  name            varchar      not null,
  description     text,
  created_at      timestamptz  not null default now(),
  deleted_at      timestamptz
);

-- ───────────────────────────────────────────────────────────
-- 6. Products (menu items) per store
-- ───────────────────────────────────────────────────────────
create table products (
  id              serial       primary key,
  store_id        integer      not null references stores(id) on delete cascade,
  name            varchar      not null,
  description     text,
  summary         varchar,
  cover           varchar,
  category_id     integer     references categories(id),
  sub_category_id integer     references sub_categories(id),
  created_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

-- ───────────────────────────────────────────────────────────
-- 7. Product attribute types & values
-- ───────────────────────────────────────────────────────────
create type product_attribute_type as enum (
  'size',
  'spice_level',
  'temperature',
  'cooking_style',
  'add_on',
  'dietary'
);

create table product_attributes (
  id            serial       primary key,
  type          product_attribute_type not null,
  value         varchar      not null,
  created_at    timestamptz  not null default now(),
  deleted_at    timestamptz
);

-- ───────────────────────────────────────────────────────────
-- 8. SKUs per product
-- ───────────────────────────────────────────────────────────
create table products_skus (
  id                   serial       primary key,
  product_id           integer      not null references products(id) on delete cascade,
  size_attribute_id    integer      references product_attributes(id),
  color_attribute_id   integer      references product_attributes(id),
  sku                  varchar      not null unique,
  price                numeric(10,2) not null,
  quantity             integer      default 0,
  created_at           timestamptz  not null default now(),
  deleted_at           timestamptz
);

-- ───────────────────────────────────────────────────────────
-- 9. Wishlists
-- ───────────────────────────────────────────────────────────
create table wishlist (
  id              serial       primary key,
  user_id         uuid         not null references profiles(id) on delete cascade,
  product_id      integer      not null references products(id) on delete cascade,
  created_at      timestamptz  not null default now(),
  deleted_at      timestamptz
);

-- ───────────────────────────────────────────────────────────
-- 10. Carts
-- ───────────────────────────────────────────────────────────
create table carts (
  id           serial       primary key,
  user_id      uuid         not null references profiles(id) on delete cascade,
  total        numeric(10,2) not null default 0,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

-- ───────────────────────────────────────────────────────────
-- 11. Cart items
-- ───────────────────────────────────────────────────────────
create table cart_items (
  id                   serial       primary key,
  cart_id              integer      not null references carts(id) on delete cascade,
  product_id           integer      not null references products(id),
  products_sku_id      integer      references products_skus(id),
  quantity             integer      not null default 1,
  created_at           timestamptz  not null default now(),
  updated_at           timestamptz  not null default now()
);

-- ───────────────────────────────────────────────────────────
-- 12. Orders
-- ───────────────────────────────────────────────────────────
create table order_details (
  id           serial       primary key,
  user_id      uuid         not null references profiles(id),
  store_id     integer      not null references stores(id),
  payment_id   integer,
  total        numeric(10,2) not null,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

-- ───────────────────────────────────────────────────────────
-- 13. Order items
-- ───────────────────────────────────────────────────────────
create table order_items (
  id                   serial       primary key,
  order_id             integer      not null references order_details(id) on delete cascade,
  product_id           integer      not null references products(id),
  products_sku_id      integer      references products_skus(id),
  quantity             integer      not null default 1,
  created_at           timestamptz  not null default now(),
  updated_at           timestamptz  not null default now()
);

-- ───────────────────────────────────────────────────────────
-- 14. Payments
-- ───────────────────────────────────────────────────────────
create table payment_details (
  id           serial       primary key,
  order_id     integer      not null references order_details(id) on delete cascade,
  amount       numeric(10,2) not null,
  provider     varchar      not null,
  status       varchar      not null,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

-- ───────────────────────────────────────────────────────────
-- 15. Sample attribute values
-- ───────────────────────────────────────────────────────────
insert into product_attributes (type, value) values
  ('size',          'Small'),
  ('size',          'Medium'),
  ('size',          'Large'),
  ('spice_level',   'Mild'),
  ('spice_level',   'Hot'),
  ('temperature',   'Cold'),
  ('temperature',   'Hot'),
  ('cooking_style', 'Rare'),
  ('cooking_style', 'Well-Done'),
  ('add_on',        'Extra Cheese'),
  ('add_on',        'Avocado'),
  ('dietary',       'Vegan'),
  ('dietary',       'Gluten-Free');


  -- ───────────────────────────────────────────────────────────
-- 1) Trigger function to set `updated_at = now()` on UPDATE
-- ───────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ───────────────────────────────────────────────────────────
-- 2) Attach the trigger to each table with an updated_at column
-- ───────────────────────────────────────────────────────────
create trigger set_updated_at_on_carts
  before update on carts
  for each row execute procedure set_updated_at();

create trigger set_updated_at_on_cart_items
  before update on cart_items
  for each row execute procedure set_updated_at();

create trigger set_updated_at_on_order_details
  before update on order_details
  for each row execute procedure set_updated_at();

create trigger set_updated_at_on_order_items
  before update on order_items
  for each row execute procedure set_updated_at();

create trigger set_updated_at_on_payment_details
  before update on payment_details
  for each row execute procedure set_updated_at();

-- ───────────────────────────────────────────────────────────
-- 3) Enable RLS & add policies for user-owned tables
--    (so auth.uid() must match the row’s user_id / profile id)
-- ───────────────────────────────────────────────────────────

-- PROFILES
alter table profiles enable row level security;
create policy "Profiles: self" 
  on profiles for all 
  using ( auth.uid() = id );

-- ADDRESSES
alter table addresses enable row level security;
create policy "Addresses: owner"
  on addresses for all
  using ( auth.uid() = user_id );

-- WISHLIST
alter table wishlist enable row level security;
create policy "Wishlist: owner"
  on wishlist for all
  using ( auth.uid() = user_id );

-- CARTS
alter table carts enable row level security;
create policy "Carts: owner"
  on carts for all
  using ( auth.uid() = user_id );

-- CART ITEMS (checks the parent cart’s owner)
alter table cart_items enable row level security;
create policy "CartItems: owner"
  on cart_items for all
  using (
    exists (
      select 1 from carts c
      where c.id = cart_items.cart_id
        and c.user_id = auth.uid()
    )
  );

-- ORDERS
alter table order_details enable row level security;
create policy "Orders: owner"
  on order_details for all
  using ( auth.uid() = user_id );

-- ORDER ITEMS (checks the parent order’s owner)
alter table order_items enable row level security;
create policy "OrderItems: owner"
  on order_items for all
  using (
    exists (
      select 1 from order_details o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

-- PAYMENTS (checks the parent order’s owner)
alter table payment_details enable row level security;
create policy "Payments: owner"
  on payment_details for all
  using (
    exists (
      select 1 from order_details o
      where o.id = payment_details.order_id
        and o.user_id = auth.uid()
    )
  );




-- List of tables to open for public SELECT but lock down mutating actions
-- stores, categories, sub_categories, products, product_attributes, products_skus

-- 1) Enable RLS on each table
alter table stores          enable row level security;
alter table categories      enable row level security;
alter table sub_categories  enable row level security;
alter table products        enable row level security;
alter table product_attributes enable row level security;
alter table products_skus   enable row level security;

-- 2) Public SELECT policy
create policy "Public read on stores" 
  on stores for select using ( true );

create policy "Public read on categories" 
  on categories for select using ( true );

create policy "Public read on sub_categories" 
  on sub_categories for select using ( true );

create policy "Public read on products" 
  on products for select using ( true );

create policy "Public read on product_attributes" 
  on product_attributes for select using ( true );

create policy "Public read on products_skus" 
  on products_skus for select using ( true );

-- 3) Require login for INSERT
create policy "Authenticated insert on stores"
  on stores for insert with check ( auth.uid() IS NOT NULL );

create policy "Authenticated insert on categories"
  on categories for insert with check ( auth.uid() IS NOT NULL );

create policy "Authenticated insert on sub_categories"
  on sub_categories for insert with check ( auth.uid() IS NOT NULL );

create policy "Authenticated insert on products"
  on products for insert with check ( auth.uid() IS NOT NULL );

create policy "Authenticated insert on product_attributes"
  on product_attributes for insert with check ( auth.uid() IS NOT NULL );

create policy "Authenticated insert on products_skus"
  on products_skus for insert with check ( auth.uid() IS NOT NULL );

-- 4) Require login for UPDATE
create policy "Authenticated update on stores"
  on stores for update using ( auth.uid() IS NOT NULL );

create policy "Authenticated update on categories"
  on categories for update using ( auth.uid() IS NOT NULL );

create policy "Authenticated update on sub_categories"
  on sub_categories for update using ( auth.uid() IS NOT NULL );

create policy "Authenticated update on products"
  on products for update using ( auth.uid() IS NOT NULL );

create policy "Authenticated update on product_attributes"
  on product_attributes for update using ( auth.uid() IS NOT NULL );

create policy "Authenticated update on products_skus"
  on products_skus for update using ( auth.uid() IS NOT NULL );

-- 5) Require login for DELETE
create policy "Authenticated delete on stores"
  on stores for delete using ( auth.uid() IS NOT NULL );

create policy "Authenticated delete on categories"
  on categories for delete using ( auth.uid() IS NOT NULL );

create policy "Authenticated delete on sub_categories"
  on sub_categories for delete using ( auth.uid() IS NOT NULL );

create policy "Authenticated delete on products"
  on products for delete using ( auth.uid() IS NOT NULL );

create policy "Authenticated delete on product_attributes"
  on product_attributes for delete using ( auth.uid() IS NOT NULL );

create policy "Authenticated delete on products_skus"
  on products_skus for delete using ( auth.uid() IS NOT NULL );
