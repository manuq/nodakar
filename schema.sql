drop table if exists nodakar;
create table nodakar (
    id integer primary key autoincrement,
    id_remera text not null,
    nombre text not null,
    correo text not null,
    ciudad text not null,
    provincia text not null,
    pais text not null,
    censurada boolean not null);
