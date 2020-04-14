/**
 * ARQUIVADA: No caso de manifestações duplicadas, ou que se resumam a xingamentos, é possível arquivar, sem enviar uma resposta ao cidadão.
 * CADASTRADA: Situação inicial da manifestação, após o registro pelo cidadão.
 * PRORROGADA: Manifestação sem resposta conclusiva em 20 dias, prorrogada por mais 10 dias.
 * RESPOSTA INTERMEDIÁRIA: a manifestação já foi analisada, a ouvidoria ofereceu uma resposta intermediária e está trabalhando para oferecer uma resposta conclusiva.
 * COMPLEMENTADA: Após a resposta intermediária, o cidadão ofereceu uma informação adicional, complementando a manifestação.
 * ENCERRADA: Manifestação finalizada no sistema, com resposta conclusiva encaminhada ao cidadão.
 * ENCAMINHADA POR OUTRA OUVIDORIA: Manifestação encaminhada por outro órgão ou entidade que utiliza o Sistema de Ouvidorias do Poder Executivo federal.
 * ENCAMINHADA PARA ÓRGÃO EXTERNO - ENCERRADA: Manifestação encaminhada para outro órgão ou entidade que não utiliza o Sistema de Ouvidorias do Poder Executivo federal.
 */

export const ARQUIVADA = 'arquivada';
export const CADASTRADA = 'cadastrada';
export const PRORROGADA = 'prorrogada';
export const RESPOSTA_INTERMEDIARIA = 'resposta intermediária';
export const COMPLEMENTADA = 'complementada';
export const ENCERRADA = 'encerrada';
export const ENCAMINHADA_PARA_OUTRA_OUVIDORIA =
  'encaminhada para outra ouvidoria';
export const ENCAMINHADA_PARA_ORGAO_EXTERNO_ENCERRADA =
  'encaminhada para orgão externo - encerrada';

export default [
  {
    id: 1,
    title: ARQUIVADA,
  },
  {
    id: 2,
    title: CADASTRADA,
  },
  {
    id: 3,
    title: PRORROGADA,
  },
  {
    id: 4,
    title: RESPOSTA_INTERMEDIARIA,
  },
  {
    id: 5,
    title: COMPLEMENTADA,
  },
  {
    id: 6,
    title: ENCERRADA,
  },
  {
    id: 7,
    title: ENCAMINHADA_PARA_OUTRA_OUVIDORIA,
  },
  {
    id: 8,
    title: ENCAMINHADA_PARA_ORGAO_EXTERNO_ENCERRADA,
  },
];
