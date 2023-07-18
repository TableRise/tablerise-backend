import { Wiki } from './../../schemas/wikisValidationSchema';
import generateNewMongoID from '../helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const wikiMockEn: Wiki = {
  title: 'Wiki title',
  description: 'Wiki description',
  reference: 'Book of rules',
  image: ''
}

const wikiMockPt: Wiki = {
  title: 'Título da wiki',
  description: 'Descrição da wiki',
  reference: 'Livro de regras',
  image: ''
}

const wiki: Mock = {
  instance: {
    _id: generateNewMongoID(),
    en: wikiMockEn,
    pt: wikiMockPt
  },
  description: 'Mock an instance of a RPG wiki'
}

export default wiki;
