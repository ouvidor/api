# Rotas do Ouvidor

Documentação de todas as rotas da _API_.
Contêm protocolo _HTTP_, endereço da rota, explicação do que é feito, o que recebe e o que retorna.

---

## Publicas

### user

- **GET** `user/`: retorna todos os registros da tabela _users_.

_retorna_:

```json
    {
        "id": 7,
        "first_name": "Romullo",
        "last_name": "Cordeiro Rodrigues",
        "email": "romullocordeiro@gmail.com",
        "created_at": "2019-10-18T17:38:42.000Z",
        "role": [
            {
                "id": 2,
                "title": "admin"
            }
        ]
    },
```

- **POST** `user/create`: cria um novo registro na tabela de _users_.

Existem dois tipos de requisições possiveis aqui, uma incluí o atributo 'role' mas é necessário um token de usuário de nivel master no header na requisição, e a outra é sem o atributo role.

_requisição sem role_:

```json
{
  "first_name": "anitta",
  "last_name": "manuel",
  "email": "anitta@gmail.com",
  "password": "123456"
}
```

_requisição com role_:

```json
{
  "first_name": "anitta",
  "last_name": "manuel",
  "email": "anitta@gmail.com",
  "role": "admin",
  "password": "123456"
}
```

_retorna_:

```json
{
  "id": 2134,
  "first_name": "anitta",
  "last_name": "manuel",
  "email": "anitta@gmail.com"
}
```

### auth

- **POST** `auth/`: Insere as credenciais e loga no sistema. Retorna um _Token_ _JWT_, esse _Token_ é usado para acessar as rotas autenticadas.

_requisição_:

```json
{
  "email": "claudin@gmail.com",
  "password": "123456"
}
```

_retorna_:

```json
{
  "user": {
    "id": 1233,
    "first_name": "claudin",
    "last_name": "buchecha",
    "email": "claudin@gmail.com"
  },
  "token": "UMtokenJWTbizarro"
}
```

---

## Autenticação necessária

### manifestation

- **GET** `manifestation/`: retorna todos os registros da tabela _manifestations_.

_retorna_:

```json
{
  [
    {
      "id": 42,
      "user_id": 911,
      "title": "Um problema na minha rua",
      "description": "Tem um buracão na rua vai fazer 5 meses.",
      "categories": [1, 2],
      "create_at": "2019-08-07T21:21:00+00:00"
    }
  ]
}
```

- **POST** `manifestation/`: baseado no _id_ passado acha um registro da tabela _manifestations_.

_requisição_:

```json
{
  "manifestation_id": 42
}
```

_retorna_:

```json
{
  "id": 42,
  "user_id": 911,
  "title": "Um problema na minha rua",
  "description": "Tem um buracão na rua vai fazer 5 meses.",
  "categories": [1, 2],
  "create_at": "2019-08-07T21:21:00+00:00"
}
```

- **POST** `manifestation/create`: cria um novo registro na tabela de _manifestations_.

_requisição_:

```json
{
  "title": "Rua em péssimas condições",
  "description": "texto texto texto texto texto",
  "categories": [1, 4]
}
```

_retorna_:

```json
{
  "id": 567,
  "user_id": 111,
  "title": "Rua em péssimas condições",
  "description": "texto texto texto texto texto",
  "categories": [1, 4],
  "create_at": "2019-12-24T21:16:00+00:00"
}
```

---

## Necessário privilégio ADMIN

### category

- **POST** `category/create`: cria um novo registro na tabela de _categories_.

_requisição_:

```json
{
  "title": "Saneamento"
}
```

_retorna_:

```json
{
  "id": 6,
  "title": "Saneamento"
}
```

## Necessário privilégio MASTER

### role

- **POST** `role/create`: cria um novo registro na tabela de _role_.

_requisição_:

```json
{
  "title": "Saneamento"
}
```

_retorna_:

```json
{
  "id": 6,
  "title": "Saneamento"
}
```

### type

- **GET** `type/`: retorna todos os registros na tabela de _types_.

```json
[
  {
    "id": 1,
    "title": "Elogio",
    "created_at": "2019-10-31T16:37:51.000Z",
    "updated_at": "2019-10-31T16:37:57.000Z"
  }
]
```

- **POST** `type/`: cria um novo registro na tabela de _types_.

_requisição_:

```json
{
  "title": "Reclamação"
}
```

_retorna_:

```json
{
  "id": 1,
  "title": "Reclamação"
}
```

- **PUT** `type/:id`: atualiza um registro de acordo com o id passado no parametro da rota na tabela de _types_.

_requisição_:

```json
{
  "title": "Elogio"
}
```

_retorna_:

```json
{
  "id": 1,
  "title": "Elogio"
}
```

### status

- **GET** `status/`: retorna todos os registros na tabela de _status_.

```json
[
  {
    "id": 1,
    "title": "Fechado",
    "created_at": "2019-10-31T16:38:10.000Z",
    "updated_at": "2019-10-31T16:38:27.000Z"
  }
]
```

- **POST** `status/`: cria um novo registro na tabela de _status_.

_requisição_:

```json
{
  "title": "Em andamento"
}
```

_retorna_:

```json
{
  "id": 1,
  "title": "Em andamento"
}
```

- **PUT** `status/:id`: atualiza um registro de acordo com o id passado no parametro da rota na tabela de _status_.

_requisição_:

```json
{
  "title": "Fechado"
}
```

_retorna_:

```json
{
  "id": 1,
  "title": "Fechado"
}
```
