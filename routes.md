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

- **GET** `user/:id?`: essa mesma rota pode receber o id de um _users_ específico, retornando assim o usuário.

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
  "email": "aa@aa.com",
  "password": "123456"
}
```

_retorna_:

```json
{
  "user": {
    "id": 7,
    "first_name": "a",
    "last_name": "last_name",
    "email": "aa@aa.com",
    "role": [
      {
        "id": 3,
        "title": "citizen",
        "level": 3
      }
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6W3siaWQiOjMsInRpdGxlIjoiY2l0aXplbiIsImxldmVsIjozfV0sImlhdCI6MTU3MjgyMjk5NywiZXhwIjoxNTc1NDE0OTk3fQ.DLK849R9QNndfZ6aAWfWJki75U97GkjRGQQzNgXLnJ8"
}
```

---

## Autenticação necessária

### manifestation

- **GET** `manifestation/`: retorna todos os registros da tabela _manifestations_.
  O resultado é limitado em 10 manifestações.

Essa rota pode receber em sua query parâmetros opcionais.

- page: valor _default_ é `1`, define a página a ser pesquisar.
- isRead: valor _default_ é `1`, define a busca por manifestações não lidas.
- text: define um título específico a ser pesquisado.
- options: define um array de categorias e tipos de manifestações a serem pesquisados.

_retorna_:

```json
{
  "count": 1,
  "rows": [
    {
      "id": 18,
      "title": "Na rua da restinga tem um problema",
      "description": "desc",
      "read": 1,
      "location": "Rua da Restinga, Bairro Foguete",
      "latitude": "-22.9242297",
      "longitude": "-42.0406372",
      "created_at": "2019-11-12T15:23:24.000Z",
      "updated_at": "2019-11-21T22:26:00.000Z",
      "secretary_id": null,
      "user_id": 1,
      "type_id": 1,
      "categories": [
        {
          "id": 3,
          "title": "Saúde"
        }
      ],
      "type": {
        "id": 1,
        "title": "Reclamação"
      }
    }
  ],
  "last_page": 1
}
```

- **GET** `manifestation/:id?`: essa mesma rota pode receber o id de uma manifestação específica, retornando assim a manifestação.

_retorna_:

```json
{
  "id": 2,
  "title": "Problema na rua",
  "description": "texto texto texto texto",
  "read": 0,
  "location": "Rua da restinga, Cabo Frio",
  "latitude": null,
  "longitude": null,
  "created_at": "2019-11-07T00:47:49.000Z",
  "updated_at": "2019-11-07T00:47:49.000Z",
  "secretary_id": null,
  "user_id": 1,
  "type_id": 1,
  "categories": [
    {
      "id": 1,
      "title": "Saneamento"
    }
  ],
  "type": {
    "id": 1,
    "title": "Reclamação"
  }
}
```

- **POST** `manifestation`: cria um novo registro na tabela de _manifestations_.

_requisição_:

```json
{
  "title": "Local",
  "description": "Essa manifestação tem um local",
  "categories_id": [1],
  "type_id": 1,
  "latitude": -22.9242297,
  "longitude": -42.0406372
}
```

_retorna_:

```json
{
  "id": 49,
  "title": "Local",
  "description": "Essa manifestação tem um local",
  "type_id": 1,
  "latitude": -22.9242297,
  "longitude": -42.0406372,
  "location": "Rua da Restinga, Foguete",
  "user_id": 1,
  "updated_at": "2019-11-21T22:32:24.902Z",
  "created_at": "2019-11-21T22:32:24.902Z"
}
```

- **PUT** `manifestation/:id`: atualiza um registro de acordo com o id passado no parametro da rota na tabela de _manifestations_.

_requisição_:

```json
{
  "title": "Na rua da restinga tem um problema"
}
```

_retorna_:

```json
{
  "id": 7,
  "title": "Na rua da restinga tem um problema",
  "description": "texto texto texto texto",
  "read": 0,
  "created_at": "2019-11-06T16:11:41.000Z",
  "updated_at": "2019-11-06T17:03:58.963Z",
  "secretary_id": null,
  "user_id": 1,
  "type_id": 1
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

- **GET** `category/:id?`: essa mesma rota pode receber o id de um _categories_ específico, retornando assim a categoria.

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

- **GET** `role/:id?`: essa mesma rota pode receber o id de um _role_ específico, retornando assim o role.

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

- **GET** `type/:id?`: essa mesma rota pode receber o id de um _type_ específico, retornando assim o status.

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

- **GET** `status/:id?`: essa mesma rota pode receber o id de um _status_ específico, retornando assim o status.

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

- **GET** `secretary/:id?`: essa mesma rota pode receber o id de um _secretariats_ específico, retornando assim a secretaria.

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
