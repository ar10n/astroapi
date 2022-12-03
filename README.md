# Astro API

## Endpoints
`/users/register` - регистрация пользователей.

`/users/login` - авторизация пользователей.

`/users/info` - проверка авторизации.

### Структура данных для регистрации
```json
{
    "name": "string",
    "password": "string",
    "email": "string"
}
```

### Структура данных для авторизации
```json
{
    "email": "string",
    "password": "string"
}
```

## Структура `.env`-файла
```json
SALT=10
DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME?schema=public"
SECRET="SECRET"
```
`SALT` - число. Используется для хэширования пароля пользователя.

`DATABASE_URL` - строка подключения к БД PostgreSQL, где:
- `DB_USER` - имя пользователя БД;
- `DB_PASSWORD` - пароль пользователя БД;
- `DB_HOST` - хост БД;
- `DB_PORT` - порт БД;
- `DB_NAME` - наименование базы.
