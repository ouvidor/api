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

- **GET** `user/:id`: retorna o usuário que tem esse id.

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

- **POST** `user/`: cria um novo registro na tabela de _users_.

Existem **dois** tipos de requisições possiveis aqui, uma incluí o atributo 'role' mas é **necessário um token** de usuário de nivel master no header na requisição, e a outra é sem o atributo role.

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

### prefecture

- **GET** `prefecture`: retorna os dados da prefeitura que estão na tabela `prefecture`.

```json
{
  "id": 1,
  "location": "Centro",
  "telephone": "(22)1010-1010",
  "email": "prefeitura@prefeitura.com",
  "site": "www.google.com",
  "attendance": "24 horas por dia, todos os dias",
  "created_at": "2020-04-04T18:12:16.000Z",
  "updated_at": "2020-04-04T18:14:47.118Z"
}
```

- **PUT** `prefecture`: atualiza os dados na tabela `prefecture`.

_requisição_

```json
{
  "id": 1,
  "location": "Centro",
  "telephone": "(22)1010-1010",
  "email": "prefeitura@prefeitura.com",
  "site": "www.google.com",
  "attendance": "24 horas por dia, todos os dias"
}
```

_retorna_

```json
{
  "id": 1,
  "location": "Centro",
  "telephone": "(22)1010-1010",
  "email": "prefeitura@prefeitura.com",
  "site": "www.google.com",
  "attendance": "24 horas por dia, todos os dias",
  "created_at": "2020-04-04T18:12:16.000Z",
  "updated_at": "2020-04-04T18:14:47.118Z"
}
```

### ombudsman

- **GET** `ombudsman`: retorna os dados da prefeitura que estão na tabela `ombudsman`.

```json
{
  "id": 1,
  "location": "Centro",
  "telephone": "(22)1010-1010",
  "email": "prefeitura@prefeitura.com",
  "site": "www.google.com",
  "attendance": "24 horas por dia, todos os dias",
  "created_at": "2020-04-04T18:12:16.000Z",
  "updated_at": "2020-04-04T18:14:47.118Z"
}
```

- **PUT** `ombudsman`: atualiza os dados na tabela `ombudsman`.

_requisição_

```json
{
  "id": 1,
  "location": "Centro",
  "telephone": "(22)1010-1010",
  "email": "prefeitura@prefeitura.com",
  "site": "www.google.com",
  "attendance": "24 horas por dia, todos os dias"
}
```

_retorna_

```json
{
  "id": 1,
  "location": "Centro",
  "telephone": "(22)1010-1010",
  "email": "prefeitura@prefeitura.com",
  "site": "www.google.com",
  "attendance": "24 horas por dia, todos os dias",
  "created_at": "2020-04-04T18:12:16.000Z",
  "updated_at": "2020-04-04T18:14:47.118Z"
}
```

### files

- **POST** `files`: faz upload de arquivos, esses arquivos ficam temporariamente em uma pasta chamada `tmp/uploads/` e ficam permanentemente na tabela _files_.

_requisição_:

Um Multipart Form Data, que deve conter 1 ou mais campos `file` e recebe um arquivo.

_retorna_:

```json
[
  {
    "url": "http://127.0.0.1:3003/files/c322b14af33436685e53aaf234be2004.txt",
    "id": 15,
    "name": "Texto.txt",
    "path": "c322b14af33436685e53aaf234be2004.txt",
    "created_at": "2020-02-08T16:55:57.331Z",
    "updated_at": "2020-02-08T16:55:57.331Z"
  },
  {
    "url": "http://127.0.0.1:3003/files/9d6c4cc7fe93c42aceb2169de74d5f43.pdf",
    "id": 16,
    "name": "Documento.pdf",
    "path": "9d6c4cc7fe93c42aceb2169de74d5f43.pdf",
    "created_at": "2020-02-08T16:55:57.331Z",
    "updated_at": "2020-02-08T16:55:57.331Z"
  }
]
```

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

- **GET** `manifestation/:id`: retorna a manifestação que tem esse id.

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
  "latitude": -22.9230097,
  "longitude": -42.9230097
}
```

_retorna_:

```json
{
  "id": 49,
  "title": "Local",
  "description": "Essa manifestação tem um local",
  "type_id": 1,
  "latitude": -22.9230097,
  "longitude": -42.9230097,
  "location": "Rua Inglaterra, Cabo Frio",
  "user_id": 1,
  "updated_at": "2020-02-09T15:54:11.342Z",
  "created_at": "2020-02-09T15:54:11.342Z",
  "protocol": "k6f7ju38"
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

- **GET** `category/:id`: retorna a categoria que tem esse id.

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

- **GET** `role/:id`: retorna a Role que tem esse id.

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

- **GET** `type/:id`: retorna o Type que tem esse id.

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

- **GET** `status/:id`: retorna o Status que tem esse id.

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

### manifestation status history

- **GET** `manifestation/:idOrProtocol/status`: retorna todos os status de uma manifestação.

```json
[
  {
    "id": 1,
    "description": "descrição, motivo para a mudança do status",
    "created_at": "2019-12-16T17:24:58.000Z",
    "updated_at": "2019-12-16T17:24:58.000Z",
    "status_id": 1,
    "manifestation_id": 4,
    "secretary_id": 1
  }
]
```

- **GET** `manifestation/status/:id`: retorna um status específico de uma manifestação.

```json
{
  "id": 1,
  "description": "descrição, motivo para a mudança do status",
  "created_at": "2019-12-16T17:24:58.000Z",
  "updated_at": "2019-12-16T17:24:58.000Z",
  "status_id": 1,
  "manifestation_id": 4,
  "secretary_id": 1
}
```

- **POST** `/manifestation/:manifestationId/status`: cria um novo status para a manifestação.

_requisição_:

```json
{
  "description": "descrição, motivo para a mudança do status",
  "status_id": 1,
  "secretary_id": 1
}
```

_retorna_:

```json
{
  "id": 1,
  "description": "descrição, motivo para a mudança do status",
  "manifestation_id": "4",
  "status_id": 1,
  "secretary_id": 1,
  "updated_at": "2019-12-16T17:24:58.115Z",
  "created_at": "2019-12-16T17:24:58.115Z"
}
```

- **PUT** `manifestation/status/:id`: atualiza um status específico de uma manifestação.

_requisição_:

```json
{
  "description": "descrição atualizada"
}
```

_retorna_:

```json
{
  "id": 1,
  "description": "descrição atualizada",
  "created_at": "2019-12-16T17:24:58.000Z",
  "updated_at": "2019-12-16T17:40:57.859Z",
  "status_id": 1,
  "manifestation_id": 4,
  "secretary_id": 1
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

- **GET** `secretary/:id`: retorna a secretaria que tem esse id.

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

### email

- **POST** `email/`: envia um email.

_requisição_:

```json
{
  "title": "Título teste",
  "text": "textão",
  "email": "seu@gmail.com"
}
```

_retorna_:

```json
{
  "message": "Email: Título teste. enviado com sucesso"
}
```
