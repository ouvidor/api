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
    "role": "master"
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
  "role": "master"
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
  "role": "master",
}
```

---

### Auth

- **POST** `auth/`: Insere as credenciais e loga no sistema. Retorna um _Token_ _JWT_, esse _Token_ é usado para acessar as rotas autenticadas.

_requisição_:

```json
{
  "email": "aa@aa.com",
  "password": "123456",
  "city": "Cabo Frio"
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
    "role": "citizen"
  },
  "city": "Cabo Frio",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImNpdGl6ZW4iLCJjaXR5IjoiQ2FibyBGcmlvIiwiaWF0IjoxNTg4NjIzMTQyLCJleHAiOjE1OTEyMTUxNDJ9.71BpTNmY3YYSaV94h09MbywNPGXbqDy2eAQXV4GvrzE"
}
```

---

## Autenticação necessária

### Prefecture

- **GET** `prefecture/`: retorna os dados das prefeituras registradas.

```json
[
  {
    "id": 1,
    "location": "Centro",
    "name": "Cabo Frio",
    "telephone": "(22)1010-1010",
    "email": "prefeitura@prefeitura.com",
    "site": "www.google.com",
    "attendance": "24 horas por dia, todos os dias",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T19:55:51.000Z",
    "ombudsmen_id": 1,
    "ombudsman": {
      "id": 1,
      "location": "Centro",
      "telephone": "(22)1010-1010",
      "email": "prefeitura@prefeitura.com",
      "site": "www.google.com",
      "attendance": "24 horas por dia, todos os dias",
      "created_at": "2020-05-04T16:55:37.000Z",
      "updated_at": "2020-05-04T19:55:38.000Z"
    }
  }
]
```

- **GET** `prefecture/:id`: retorna os dados de uma prefeitura em específico.

```json
{
  "id": 1,
  "location": "Centro",
  "name": "Cabo Frio",
  "telephone": "(22)1010-1010",
  "email": "prefeitura@prefeitura.com",
  "site": "www.google.com",
  "attendance": "24 horas por dia, todos os dias",
  "created_at": "2020-05-04T16:55:37.000Z",
  "updated_at": "2020-05-04T19:55:51.000Z",
  "ombudsmen_id": 1,
  "ombudsman": {
    "id": 1,
    "location": "Centro",
    "telephone": "(22)1010-1010",
    "email": "prefeitura@prefeitura.com",
    "site": "www.google.com",
    "attendance": "24 horas por dia, todos os dias",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T19:55:38.000Z"
  }
}
```

- **PUT** `prefecture/:id`: atualiza os dados de uma prefeitura em específico.

_requisição_

```json
{
	"site": "www.google.com",
	"email": "prefeitura@prefeitura.com",
	"attendance": "24 horas por dia, todos os dias",
	"location": "Centro",
	"telephone": "(22)1010-1010"
}
```

_retorna_

```json
{
  "id": 1,
  "location": "Centro",
  "name": "Cabo Frio",
  "telephone": "(22)1010-1010",
  "email": "prefeitura@prefeitura.com",
  "site": "www.google.com",
  "attendance": "24 horas por dia, todos os dias",
  "created_at": "2020-05-04T16:55:37.000Z",
  "updated_at": "2020-05-04T19:55:51.525Z",
  "ombudsmen_id": 1
}
```

---

### Ombudsman

- **GET** `ombudsman/`: retorna os dados das ouvidorias registradas.

```json
[
  {
    "id": 1,
    "location": "Centro",
    "telephone": "(22) 1111-1111",
    "email": "prefeitura@ouvidoria.com",
    "site": "www.google.com",
    "attendance": "24 horas por dia, todos os dias",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  }
]
```

- **GET** `ombudsman/:id`: retorna os dados de uma ouvidoria em específico.

```json
{
  "id": 1,
  "location": "Centro",
  "telephone": "(22)1010-1010",
  "email": "prefeitura@prefeitura.com",
  "site": "www.google.com",
  "attendance": "24 horas por dia, todos os dias",
  "created_at": "2020-05-04T16:55:37.000Z",
  "updated_at": "2020-05-04T19:55:38.000Z"
}
```

- **PUT** `ombudsman/:id`: atualiza os dados de uma ouvidoria em específico.

_requisição_

```json
{
	"site": "www.google.com",
	"email": "prefeitura@prefeitura.com",
	"attendance": "24 horas por dia, todos os dias",
	"location": "Centro",
	"telephone": "(22)1010-1010"
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
  "created_at": "2020-05-04T16:55:37.000Z",
  "updated_at": "2020-05-04T19:55:38.624Z"
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
      "id": 3,
      "protocol": "k9sur2dt",
      "title": "MASTER PROBLEM",
      "description": "Um cachorro mordeu uma idosa aqui na rua de trás",
      "read": 0,
      "location": "Rua da Restinga, Foguete",
      "latitude": "-22.9242299",
      "longitude": "-42.0406379",
      "created_at": "2020-05-04T19:03:47.000Z",
      "updated_at": "2020-05-04T19:03:47.000Z",
      "secretariats_id": null,
      "users_id": 1,
      "types_id": 1,
      "ombudsmen_id": null,
      "categories": [
        {
          "id": 1,
          "title": "Saneamento"
        }
      ],
      "type": {
        "id": 1,
        "title": "sugestão"
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
  "id": 3,
  "protocol": "k9sur2dt",
  "title": "MASTER PROBLEM",
  "description": "Um cachorro mordeu uma idosa aqui na rua de trás",
  "read": 0,
  "location": "Rua da Restinga, Foguete",
  "latitude": "-22.9242299",
  "longitude": "-42.0406379",
  "created_at": "2020-05-04T19:03:47.000Z",
  "updated_at": "2020-05-04T19:03:47.000Z",
  "secretariats_id": null,
  "users_id": 1,
  "types_id": 1,
  "ombudsmen_id": null,
  "files": [],
  "type": {
    "id": 1,
    "title": "sugestão"
  },
  "user": {
    "first_name": "master",
    "last_name": "root",
    "email": "root@gmail.com"
  },
  "categories": [
    {
      "id": 1,
      "title": "Saneamento"
    }
  ]
}
```

- **POST** `manifestation/`: cria um novo registro na tabela de _manifestations_.

_requisição_:

```json
{
	"title": "MASTER PROBLEM",
	"description": "Um cachorro mordeu uma idosa aqui na rua de trás",
	"categories_id": [
		1
	],
	"type_id": 1,
	"latitude": -22.9242299,
	"longitude": -42.0406379
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
  "title": "Na rua da restinga tem um problema",
	"location": "Rua da Restinga, Bairro Foguete",
	"type_id": 2
}
```

_retorna_:

```json
{
  "id": 3,
  "protocol": "k9sur2dt",
  "title": "Na rua da restinga tem um problema",
  "description": "Um cachorro mordeu uma idosa aqui na rua de trás",
  "read": 0,
  "location": "Rua da Restinga, Bairro Foguete",
  "latitude": -22.9246355,
  "longitude": -42.0406559,
  "created_at": "2020-05-04T19:03:47.000Z",
  "updated_at": "2020-05-04T19:07:52.199Z",
  "secretariats_id": null,
  "users_id": 1,
  "types_id": 2,
  "ombudsmen_id": null
}
```

---

### File

- **GET** `/files/manifestation/:manifestation_id`: retorna todos os arquivos associados à _manifestação_ buscada.

_retorna_:

```json
{
  "files": [
    {
      "id": 2,
      "name": "imagem.png",
      "name_in_server": "file-1588623519621.png",
      "extension": ".png",
      "created_at": "2020-05-04T20:18:40.000Z",
      "updated_at": "2020-05-04T20:18:40.000Z",
      "manifestations_id": 3,
      "users_id": 1
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
[
  {
    "id": 2,
    "extension": ".png",
    "name": "imagem.png",
    "name_in_server": "file-1588623519621.png",
    "created_at": "2020-05-04T20:18:40.515Z",
    "updated_at": "2020-05-04T20:18:40.542Z",
    "users_id": 1
  }
]
```

- **GET** `/files/:file_id`: Mostra o arquivo em específico.

Necessário ter o **token** do dono do arquivo ou então ser um **admin** ou **master**.

_retorna_:

_**`O arquivo`**_


- **DELETE** `/files/:file_id`: Exclui o arquivo no Google Cloud e remove o arquivo da manifestação.

Necessário ter o **token** do dono do arquivo ou então ser um **admin** ou **master**.

_retorna_:

```json
{
  "id": 1,
  "name": "imagem.png",
  "name_in_server": "file-1588622029185.png",
  "extension": ".png",
  "created_at": "2020-05-04T19:53:50.000Z",
  "updated_at": "2020-05-04T19:53:50.000Z",
  "manifestations_id": 3,
  "users_id": 1
}
```

---

### Category

- **GET** `category/`: retorna todas as categorias.

```json
[
  {
    "id": 1,
    "title": "Segurança",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T19:31:14.000Z"
  }
]
```

- **GET** `category/:id`: retorna a categoria que tem esse id.

```json
{
  "id": 1,
  "title": "Saneamento",
  "created_at": "2020-05-04T16:55:37.000Z",
  "updated_at": "2020-05-04T16:55:37.000Z"
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

- **GET** `role/`: retorna todas as Roles.

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
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 2,
    "title": "elogio",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 3,
    "title": "solicitação",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 4,
    "title": "reclamação",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 5,
    "title": "denúncia",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  }
]
```

- **GET** `type/:id`: retorna o Type que tem esse id.

```json
{
  "id": 1,
  "title": "sugestão",
  "created_at": "2020-05-04T16:55:37.000Z",
  "updated_at": "2020-05-04T16:55:37.000Z"
}
```

---

### Status

- **GET** `status/`: retorna todos os registros na tabela de _status_.

```json
[
  {
    "id": 1,
    "title": "arquivada",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 2,
    "title": "cadastrada",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 3,
    "title": "prorrogada",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 4,
    "title": "resposta intermediária",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 5,
    "title": "complementada",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 6,
    "title": "encerrada",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 7,
    "title": "encaminhada para outra ouvidoria",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  },
  {
    "id": 8,
    "title": "encaminhada para orgão externo",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  }
]
```

- **GET** `status/:id`: retorna o Status que tem esse id.

```json
{
  "id": 2,
  "title": "cadastrada",
  "created_at": "2020-05-04T16:55:37.000Z",
  "updated_at": "2020-05-04T16:55:37.000Z"
}
```

---

### Manifestation Status History

- **GET** `manifestation/:idOrProtocol/status`: retorna todos os status de uma manifestação.

```json
[
  {
    "id": 1,
    "description": "descrição atualizada",
    "created_at": "2020-05-04T19:03:47.000Z",
    "updated_at": "2020-05-04T19:08:18.000Z",
    "manifestations_id": 3,
    "status_id": 2,
    "status": {
      "id": 2,
      "title": "cadastrada",
      "created_at": "2020-05-04T16:55:37.000Z",
      "updated_at": "2020-05-04T16:55:37.000Z"
    }
  }
]
```

- **GET** `manifestation/status/:id`: retorna um status específico de uma manifestação.

```json
{
  "id": 1,
  "description": "descrição atualizada",
  "created_at": "2020-05-04T19:03:47.000Z",
  "updated_at": "2020-05-04T19:08:18.000Z",
  "manifestations_id": 3,
  "status_id": 2,
  "status": {
    "id": 2,
    "title": "cadastrada",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  }
}
```

- **POST** `/manifestation/:manifestationId/status`: cria um novo status para a manifestação.

_requisição_:

```json
{
  "description": "descrição, motivo para a mudança do status",
  "status_id": 1,
}
```

_retorna_:

```json
{
  "id": 5,
  "description": "descrição, motivo para a mudança do status",
  "manifestations_id": 3,
  "status_id": 3,
  "updated_at": "2020-05-04T20:31:26.972Z",
  "created_at": "2020-05-04T20:31:26.972Z"
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
  "created_at": "2020-05-04T19:03:47.000Z",
  "updated_at": "2020-05-04T19:08:18.000Z",
  "manifestations_id": 3,
  "status_id": 2,
  "status": {
    "id": 2,
    "title": "cadastrada",
    "created_at": "2020-05-04T16:55:37.000Z",
    "updated_at": "2020-05-04T16:55:37.000Z"
  }
}
```

---

### Secretary

- **GET** `secretary/`: retorna todos as secretarias.

```json
[
  {
    "id": 2,
    "title": "Secretaria de Testes",
    "email": "saude.gov@gov.com",
    "accountable": "José"
  }
]
```

- **GET** `secretary/:id`: retorna a secretaria que tem esse id.

```json
{
  "id": 2,
  "title": "Secretaria de Testes",
  "email": "saude.gov@gov.com",
  "accountable": "José"
}
```

- **POST** `secretary/`: cria uma nova secretaria.

_requisição_:

```json
{
	"title": "Secretaria de Testes",
	"email": "saude.gov@gov.com",
	"accountable": "José"
}
```

_retorna_:

```json
{
  "id": 3,
  "title": "Secretaria de Testes",
  "email": "saude.gov@gov.com",
  "accountable": "José",
  "updated_at": "2020-05-04T20:35:12.568Z",
  "created_at": "2020-05-04T20:35:12.568Z"
}
```

- **PUT** `secretary/:id`: atualiza uma secreataria.

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
  "id": 2,
  "title": "Secretaria da Fazenda",
  "email": "fazenda.gov@gov.com",
  "accountable": "José",
  "created_at": "2020-05-04T19:27:46.000Z",
  "updated_at": "2020-05-04T20:33:36.000Z"
}
```

- **DELETE** `secretary/:id`: deleta uma secretaria.

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

---

### Admins

- **GET** `admins/`: retorna todos os adminstradores.

_retorna_:

```json
[
  {
    "id": 1,
    "first_name": "master",
    "last_name": "root",
    "email": "root@gmail.com",
    "role": "master"
  }
]
```
