# Rotas do Ouvidor

Documentação de todas as rotas da _API_.
Contêm protocolo _HTTP_, endereço da rota, explicação do que é feito, o que recebe e o que retorna.

---

## Publicas

### user

- **GET** `user/`: retorna todos os registros na tabela de _users_.

```json
[
  {
    "id": 1,
    "first_name": "master",
    "last_name": "root",
    "email": "root@gmail.com",
    "role": [
      {
        "id": 1,
        "title": "master"
      }
    ]
  }
]
```

- **GET** `user/:id?*`: essa mesma rota pode receber o id de um _users_ específico, retornando assim o usuário.

```json
{
  "id": 1,
  "first_name": "master",
  "last_name": "root",
  "email": "root@gmail.com",
  "role": [
    {
      "id": 1,
      "title": "master"
    }
  ]
}
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
[
  {
    "id": 8,
    "title": "Problema na rua",
    "description": "texto texto texto texto",
    "read": 0,
    "created_at": "2019-10-31T17:17:53.000Z",
    "updated_at": "2019-10-31T17:17:55.000Z",
    "user_id": 1,
    "type_id": 1,
    "categories": [
      {
        "id": 1,
        "title": "Saneamento"
      }
    ]
  }
]
```

- **GET** `manifestation/:id?*`: essa mesma rota pode receber o id de uma manifestação específica, retornando assim a manifestação.

_retorna_:

```json
{
  "id": 8,
  "title": "Problema na rua",
  "description": "texto texto texto texto",
  "read": 0,
  "created_at": "2019-10-31T17:17:53.000Z",
  "updated_at": "2019-10-31T17:17:55.000Z",
  "user_id": 1,
  "type_id": 1
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

### category

- **GET** `category/`: retorna todos os registros na tabela de _categories_.

```json
[
  {
    "id": 1,
    "title": "Saneamento"
  }
]
```

- **GET** `category/:id?*`: essa mesma rota pode receber o id de um _categories_ específico, retornando assim a categoria.

```json
{
  "id": 1,
  "title": "Saneamento"
}
```

- **POST** `category`: cria um novo registro na tabela de _categories_.

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

- **PUT** `category/:id`: atualiza um registro de acordo com o id passado no parametro da rota na tabela de _categories_.

_requisição_:

```json
{
  "title": "Segurança"
}
```

_retorna_:

```json
{
  "id": 1,
  "title": "Segurança"
}
```

- **DELETE** `type/:id`: deleta um registro de acordo com o id passado no parametro da rota na tabela de _categories_.

_retorna_:

```json
{
  "id": 1,
  "title": "Segurança",
  "created_at": "2019-10-31T17:03:19.000Z",
  "updated_at": "2019-10-31T18:29:13.000Z"
}
```

### role

- **GET** `role/`: retorna todos os registros na tabela _roles_.

```json
[
  {
    "id": 1,
    "title": "master",
    "level": 1
  },
  {
    "id": 2,
    "title": "admin",
    "level": 2
  },
  {
    "id": 3,
    "title": "citizen",
    "level": 3
  }
]
```

- **GET** `role/:id?*`: essa mesma rota pode receber o id de um _role_ específico, retornando assim o role.

```json
{
  "id": 1,
  "title": "master"
}
```

- **POST** `role/`: cria um novo registro na tabela de _roles_.

_requisição_:

```json
{
  "title": "Ajudante",
  "level": 2
}
```

_retorna_:

```json
{
  "id": 4,
  "title": "Ajudante",
  "level": 2
}
```

- **PUT** `role/:id`: atualiza um registro de acordo com o id passado no parametro da rota na tabela de _roles_.

_requisição_:

```json
{
  "title": "Cidadão"
}
```

_retorna_:

```json
{
  "id": 3,
  "title": "Cidadão",
  "level": 3
}
```

- **DELETE** `role/:id`: deleta um registro de acordo com o id passado no parametro da rota na tabela de _roles_.

_retorna_:

```json
{
  "id": 4,
  "title": "Ajudante",
  "level": 2,
  "created_at": "2019-11-01T17:02:27.000Z",
  "updated_at": "2019-11-01T17:02:27.000Z"
}
```

### type

- **GET** `type/`: retorna todos os registros na tabela de _types_.

```json
[
  {
    "id": 1,
    "title": "Reclamação"
  }
]
```

- **GET** `type/:id?*`: essa mesma rota pode receber o id de um _type_ específico, retornando assim o status.

```json
{
  "id": 1,
  "title": "Reclamação"
}
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

- **DELETE** `type/:id`: deleta um registro de acordo com o id passado no parametro da rota na tabela de _types_.

_retorna_:

```json
{
  "id": 1,
  "title": "Reclamação",
  "created_at": "2019-10-31T17:01:36.000Z",
  "updated_at": "2019-10-31T17:01:36.000Z"
}
```

### status

- **GET** `status/`: retorna todos os registros na tabela de _status_.

```json
[
  {
    "id": 2,
    "title": "Em andamento"
  }
]
```

- **GET** `status/:id?*`: essa mesma rota pode receber o id de um _status_ específico, retornando assim o status.

```json
{
  "id": 2,
  "title": "Em andamento"
}
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

- **DELETE** `status/:id`: deleta um registro de acordo com o id passado no parametro da rota na tabela de _status_.

_retorna_:

```json
{
  "id": 1,
  "title": "Em andamento",
  "created_at": "2019-10-31T17:01:37.000Z",
  "updated_at": "2019-10-31T17:01:37.000Z"
}
```

### secretary

- **GET** `secretary/`: retorna todos os registros na tabela de _secretariats_.

```json
[
  {
    "id": 1,
    "title": "Secretaria da Saúde",
    "email": "saude.gov@gov.com"
  }
]
```

- **GET** `secretary/:id?*`: essa mesma rota pode receber o id de um _secretariats_ específico, retornando assim a secretaria.

```json
{
  "id": 1,
  "title": "Secretaria da Saúde",
  "email": "saude.gov@gov.com"
}
```

- **POST** `secretary/`: cria um novo registro na tabela de _secretariats_.

_requisição_:

```json
{
  "title": "Secretaria da Saúde",
  "email": "saude.gov@gov.com"
}
```

_retorna_:

```json
{
  "id": 1,
  "title": "Secretaria da Saúde",
  "email": "saude.gov@gov.com"
}
```

- **PUT** `status/:id`: atualiza um registro de acordo com o id passado no parametro da rota na tabela de _status_.

_requisição_:

```json
{
  "title": "Secretaria da Fazenda",
  "email": "fazenda.gov@gov.com"
}
```

_retorna_:

```json
{
  "id": 1,
  "title": "Secretaria da Fazenda",
  "email": "fazenda.gov@gov.com"
}
```

- **DELETE** `status/:id`: deleta um registro de acordo com o id passado no parametro da rota na tabela de _status_.

_retorna_:

```json
{
  "id": 1,
  "title": "Secretaria da Fazenda",
  "email": "fazenda.gov@gov.com",
  "created_at": "2019-10-31T21:30:47.000Z",
  "updated_at": "2019-10-31T23:55:51.000Z"
}
```
