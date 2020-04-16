# Rotas do Ouvidor

Documentação de todas as rotas da _API_.
Contêm protocolo _HTTP_, endereço da rota, explicação do que é feito, o que recebe e o que retorna.

---

## Publicas

### User

- **GET** `user/`: retorna todos os registros na tabela de _users_.

```json
[
  {
    "id": 1,
    "first_name": "master",
    "last_name": "root",
    "email": "root@gmail.com",
    "role": {
      "id": 3,
      "title": "master"
    }
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
  "role": {
    "id": 3,
    "title": "master"
  }
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

- **PUT** `user/:id`: edita o seu próprio usuário.

_requisição_:
```json
{
  "email": "novoemail@gmail.com",
}
```

_retorna_:
```json
{
  "id": 2,
  "first_name": "primeiro nome",
  "last_name": "ultimo nome",
  "email": "novoemail@gmail.com",
  "role": {
    "id": 3,
    "title": "master"
  }
}
```

---

### Auth

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
    "role": {
      "id": 1,
      "title": "citizen"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6eyJpZCI6MSwidGl0bGUiOiJjaXRpemVuIn0sImlhdCI6MTU4NjcxMTcwOCwiZXhwIjoxNTg5MzAzNzA4fQ.b_TjuCk2hGtbqUq6O7HgqaX9d1cWp_Ffj2vpN9iKW8U"
}
```

---

## Autenticação necessária

### Prefecture

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

---

### Ombudsman

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

---

### Manifestation

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

- **GET** `manifestation/:id`: retorna a manifestação que tem esse numero de protocolo, exemplo: `k8xde3pz`.

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

### File

- **GET** `/manifestation/:manifestation_id/files`: retorna todos os arquivos associados à _manifestação_ buscada.

_retorna_:

```json
{
  "files": [
    {
      "id": 1,
      "file_name": "imagem.jpg",
      "file_name_in_server": "file-1586716408853.jpg",
      "extension": ".jpg",
      "created_at": "2020-04-12T18:33:31.000Z",
      "updated_at": "2020-04-12T18:33:31.000Z",
      "manifestation_id": 1,
      "user_id": 2
    }
  ]
}
```

- **POST** `/files/`: faz upload de um arquivo para o server, o arquivo é vinculado a uma manifestação e tem seus dados salvos na tabela _files_, o arquivo em si é salvo na Googlo Cloud.

O corpo para envio dessa requisição se da através de um **multipart form-data** na seguinte estrutura:
| key               | value         |
|-------------------|---------------|
| file              | documento.pdf |
| manifestation_id  | 3             |

Para que o envio ocorra com sucesso, o token de autenticação deve ser do **AUTOR** da manifestação, ou de algum usuário com role **ADMIN** ou **MASTER**

_retorna_:

```json
{
  "id": 3,
  "file_name": "documento.pdf",
  "file_name_in_server": "file-1586717080767.pdf",
  "extension": ".pdf",
  "updated_at": "2020-04-12T18:44:41.639Z",
  "created_at": "2020-04-12T18:44:41.580Z",
  "user_id": 2,
  "manifestation_id": 1
}
```

- **GET** `/files/:file_id`: Realiza o download do arquivo escolhido.

Necessário ter o **token** do dono do arquivo ou então ser um **admin** ou **master**.

_retorna_:

_**`O arquivo`**_


- **DELETE** `/files/:file_id`: Exclui o arquivo no Google Cloud e remove o arquivo da manifestação.

Necessário ter o **token** do dono do arquivo ou então ser um **admin** ou **master**.


_retorna_:

```json
{
  "id": 2,
  "file_name": "documento.pdf",
  "file_name_in_server": "file-1586716623542.pdf",
  "extension": ".pdf",
  "created_at": "2020-04-12T18:37:04.000Z",
  "updated_at": "2020-04-12T18:37:04.000Z",
  "manifestation_id": 1,
  "user_id": 2
}
```

---

### Category

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

---

### Role

- **GET** `role/`: retorna todos os registros na tabela _roles_.

```json
[
  {
    "id": 1,
    "title": "citizen"
  },
  {
    "id": 2,
    "title": "admin"
  },
  {
    "id": 3,
    "title": "master"
  }
]
```

- **GET** `role/:id`: retorna a Role que tem esse id.

```json
{
  "id": 1,
  "title": "citizen"
}
```

---

### Type

- **GET** `type/`: retorna todos os tipos possíveis de manifestações.

```json
[
  {
    "id": 1,
    "title": "sugestão",
  }
]
```

- **GET** `type/:id`: retorna o Type que tem esse id.

```json
{
  "id": 1,
  "title": "sugestão"
}
```

---

### Status

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

---

### Manifestation Status History

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

---

### Secretary

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

---

### Email

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
