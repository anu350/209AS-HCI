create table tags (
  id uuid DEFAULT uuid_generate_v4 (),
    created_at timestamp with time zone,
    tag text,

    primary key (id)
);

-- Create a table for public "notes"
create table notes (
  id uuid DEFAULT uuid_generate_v4 (),
  created_at timestamp with time zone,
  last_edit_time timestamp with time zone,
  note text,
  title text,
  raw_json json,
  -- tags_id int8[] references tags.id,

  primary key (id)
);

create table questions (
  id uuid DEFAULT uuid_generate_v4 (),
    created_at timestamp with time zone,
    question text,
    related_note uuid references notes.id,

    primary key (id)
);

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table tags, questions;