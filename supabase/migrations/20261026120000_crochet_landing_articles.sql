-- Crochet CasRey: articles for the "Biblioteca de patrones" (/patrones) and "Aprende" (/aprende) hubs.
-- Same access model as the product tables: the table is closed to direct access and everything goes
-- through SECURITY DEFINER RPCs. Public RPCs only return published rows; admin RPCs require
-- public.user_profiles.role = 'admin'. Cover images live in the existing crochet-landing-images bucket.

create table if not exists public.crochet_landing_articles (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('patrones', 'aprende')),
  category text not null,
  slug text not null,
  title text not null check (length(btrim(title)) > 0),
  excerpt text,
  body text,
  cover_path text,
  video_url text,
  price_label text,
  is_published boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crochet_landing_articles_section_slug_key unique (section, slug),
  constraint crochet_landing_articles_category_check check (
    (section = 'patrones' and category in ('gratuitos', 'de-pago', 'novedades'))
    or (section = 'aprende' and category in ('tutoriales', 'consejos', 'tecnicas', 'materiales', 'errores-frecuentes'))
  )
);

create index if not exists crochet_landing_articles_public_idx
  on public.crochet_landing_articles (section, is_published, sort_order);

alter table public.crochet_landing_articles enable row level security;
revoke all on public.crochet_landing_articles from anon, authenticated;

create or replace function public.crochet_landing_assert_admin()
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'No tienes permisos para administrar esta landing.' using errcode = '42501';
  end if;
end;
$$;

create or replace function public.crochet_landing_article_slug(input_title text, input_slug text)
returns text
language sql
immutable
set search_path = ''
as $$
  select nullif(
    btrim(
      regexp_replace(
        translate(lower(coalesce(nullif(btrim(input_slug), ''), input_title)), 'áàäâéèëêíìïîóòöôúùüûñç', 'aaaaeeeeiiiioooouuuunc'),
        '[^a-z0-9]+', '-', 'g'
      ),
      '-'
    ),
    ''
  );
$$;

create or replace function public.crochet_landing_article_json(article public.crochet_landing_articles, include_body boolean)
returns json
language sql
stable
set search_path = ''
as $$
  select json_build_object(
    'id', article.id,
    'section', article.section,
    'category', article.category,
    'slug', article.slug,
    'title', article.title,
    'excerpt', article.excerpt,
    'body', case when include_body then article.body else null end,
    'cover_path', article.cover_path,
    'video_url', article.video_url,
    'price_label', article.price_label,
    'is_published', article.is_published,
    'published_at', article.published_at,
    'sort_order', article.sort_order,
    'created_at', article.created_at,
    'updated_at', article.updated_at
  );
$$;

-- Public: published articles of one hub, without body.
create or replace function public.get_crochet_landing_articles(input_section text)
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    json_agg(public.crochet_landing_article_json(a, false) order by a.sort_order, a.published_at desc nulls last),
    '[]'::json
  )
  from public.crochet_landing_articles a
  where a.section = input_section and a.is_published;
$$;

-- Public: one published article with body, or null.
create or replace function public.get_crochet_landing_article(input_section text, input_slug text)
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select public.crochet_landing_article_json(a, true)
  from public.crochet_landing_articles a
  where a.section = input_section and a.slug = input_slug and a.is_published;
$$;

-- Admin: every article with body.
create or replace function public.get_crochet_landing_admin_articles()
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.crochet_landing_assert_admin();

  return (
    select coalesce(
      json_agg(public.crochet_landing_article_json(a, true) order by a.section, a.sort_order, a.created_at desc),
      '[]'::json
    )
    from public.crochet_landing_articles a
  );
end;
$$;

create or replace function public.create_crochet_landing_article(
  article_section text,
  article_category text,
  article_title text,
  article_slug text default null,
  article_excerpt text default null,
  article_body text default null,
  article_cover_path text default null,
  article_video_url text default null,
  article_price_label text default null,
  article_is_published boolean default false,
  article_sort_order integer default 0
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_slug text := public.crochet_landing_article_slug(article_title, article_slug);
  inserted public.crochet_landing_articles;
begin
  perform public.crochet_landing_assert_admin();

  if next_slug is null then
    raise exception 'El título es obligatorio.';
  end if;

  if exists (select 1 from public.crochet_landing_articles where section = article_section and slug = next_slug) then
    next_slug := next_slug || '-' || substr(md5(random()::text), 1, 4);
  end if;

  insert into public.crochet_landing_articles (
    section, category, slug, title, excerpt, body, cover_path, video_url, price_label,
    is_published, published_at, sort_order
  )
  values (
    article_section,
    article_category,
    next_slug,
    btrim(article_title),
    nullif(btrim(article_excerpt), ''),
    nullif(btrim(article_body), ''),
    nullif(article_cover_path, ''),
    nullif(btrim(article_video_url), ''),
    nullif(btrim(article_price_label), ''),
    coalesce(article_is_published, false),
    case when coalesce(article_is_published, false) then now() end,
    coalesce(article_sort_order, 0)
  )
  returning * into inserted;

  return public.crochet_landing_article_json(inserted, true);
end;
$$;

create or replace function public.update_crochet_landing_article(
  article_id uuid,
  article_section text,
  article_category text,
  article_title text,
  article_slug text default null,
  article_excerpt text default null,
  article_body text default null,
  article_cover_path text default null,
  article_video_url text default null,
  article_price_label text default null,
  article_is_published boolean default false,
  article_sort_order integer default 0
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_slug text := public.crochet_landing_article_slug(article_title, article_slug);
  updated public.crochet_landing_articles;
begin
  perform public.crochet_landing_assert_admin();

  if next_slug is null then
    raise exception 'El título es obligatorio.';
  end if;

  if exists (
    select 1 from public.crochet_landing_articles
    where section = article_section and slug = next_slug and id <> article_id
  ) then
    raise exception 'Ya existe otro artículo con el slug "%" en esta sección.', next_slug;
  end if;

  update public.crochet_landing_articles
  set
    section = article_section,
    category = article_category,
    slug = next_slug,
    title = btrim(article_title),
    excerpt = nullif(btrim(article_excerpt), ''),
    body = nullif(btrim(article_body), ''),
    cover_path = nullif(article_cover_path, ''),
    video_url = nullif(btrim(article_video_url), ''),
    price_label = nullif(btrim(article_price_label), ''),
    is_published = coalesce(article_is_published, false),
    published_at = case
      when coalesce(article_is_published, false) then coalesce(published_at, now())
      else published_at
    end,
    sort_order = coalesce(article_sort_order, 0),
    updated_at = now()
  where id = article_id
  returning * into updated;

  if updated.id is null then
    raise exception 'El artículo no existe.';
  end if;

  return public.crochet_landing_article_json(updated, true);
end;
$$;

-- Returns the removed cover path so the client can delete the file from storage.
create or replace function public.delete_crochet_landing_article(article_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  removed_cover text;
begin
  perform public.crochet_landing_assert_admin();

  delete from public.crochet_landing_articles
  where id = article_id
  returning cover_path into removed_cover;

  return removed_cover;
end;
$$;

revoke all on function public.crochet_landing_assert_admin() from public, anon;
revoke all on function public.crochet_landing_article_json(public.crochet_landing_articles, boolean) from public, anon, authenticated;
revoke all on function public.get_crochet_landing_admin_articles() from public, anon;
revoke all on function public.create_crochet_landing_article(text, text, text, text, text, text, text, text, text, boolean, integer) from public, anon;
revoke all on function public.update_crochet_landing_article(uuid, text, text, text, text, text, text, text, text, text, boolean, integer) from public, anon;
revoke all on function public.delete_crochet_landing_article(uuid) from public, anon;

grant execute on function public.get_crochet_landing_articles(text) to anon, authenticated;
grant execute on function public.get_crochet_landing_article(text, text) to anon, authenticated;
grant execute on function public.crochet_landing_assert_admin() to authenticated;
grant execute on function public.get_crochet_landing_admin_articles() to authenticated;
grant execute on function public.create_crochet_landing_article(text, text, text, text, text, text, text, text, text, boolean, integer) to authenticated;
grant execute on function public.update_crochet_landing_article(uuid, text, text, text, text, text, text, text, text, text, boolean, integer) to authenticated;
grant execute on function public.delete_crochet_landing_article(uuid) to authenticated;
