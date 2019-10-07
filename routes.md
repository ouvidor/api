# Rotas do Ouvidor

## Publicas

## user

- **user/ - GET**: retorna todas as entries de user no banco

- **user/create - POST**: cria uma nova entry no banco de um _user_.
  recebe como parâmetros as keys: - **first_name**: String - **last_name**: String - **email**: String - **password**: String

## auth

- **auth/ - POST**: Autentica as credenciais e retorna um _JWT_ (**_STRING_**) que é usado para acessar rotas autenticadas, necessita dos parâmetros: - **email**: String - **password**: String

## Autenticação necessária

## manifestation

- **manifestation/ - GET**: Recebe como retorno um JSON com todas as entries de _manifestation_.

- **manifestation/ - POST**: Retorna uma entry especifica baseada nos parâmetros enviados, recebe: - **manifestation_id**

- **manifestation/create - POST**: Cria uma nova entry de _manifestation_ no banco, recebe os parâmetros: - **title**: String - **description**: Text - **categories**: Array de INTEGER (cada numero correspondendo a uma categoria da tabela categoria), exemplo:

>     {
>         "title": "Rua em péssimas condições",
>         "description": "texto texto texto texto texto",
>         "categories": [1,4],
>     }

_(por exemplo, 1 corresponde a problema estrutural e 4 a problemas elétricos)._

# Necessário privilégio ADMIN

## category

- **category/create - POST**: Cria uma nova entry de _category_ no banco, recebe os parâmetros: - **name**: String
