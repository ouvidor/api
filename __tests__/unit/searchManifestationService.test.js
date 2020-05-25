import truncate from '../util/truncate';

import searchManifestations from '../../src/services/Manifestation/search';
import Manifestation from '../../src/models/Manifestation';
import Secretary from '../../src/models/Secretary';
import User from '../../src/models/User';
import seedDatabase from '../util/seedDatabase';

let category;
let ombudsman;
let types;

describe('Search Manifestation Service', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeAll(async () => {
    await truncate();
    const {
      category: categorySeed,
      ombudsman: seedOmbudsman,
      types: seedTypes,
      prefecture,
    } = await seedDatabase();
    category = categorySeed;
    ombudsman = seedOmbudsman;
    types = seedTypes;
    try {
      const secretary = await Secretary.create({
        title: 'secretaria test',
        email: 'secrtaria@test.com',
        accountable: 'Xico Melancia',
        prefectures_id: prefecture.id,
      });

      const user = await User.create({
        email: 'email@gmail.com',
        first_name: 'Nome',
        last_name: 'Sobrenome',
        password: '123456',
        role: 'citizen',
      });

      const manifestation = await Manifestation.create({
        title: 'rua',
        description: 'descrição',
        types_id: types[0].id,
        users_id: user.id,
        ombudsmen_id: ombudsman.id,
        secretariats_id: secretary.id,
      });

      await manifestation.setCategories([category.id]);
    } catch (error) {
      console.log('FALHA AO CRIAR');
      console.log(error);
    }
  });

  it('should search with text', async () => {
    const result = await searchManifestations({
      text: 'rua',
    });

    console.log(result);

    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('last_page');
    expect(result).toHaveProperty('rows');
    expect(result.rows[0]).toHaveProperty(
      'description',
      'protocol',
      'id',
      'location',
      'latitude',
      'longitude'
    );
    expect(result.rows[0]).toHaveProperty('title', 'rua');
    expect(result.rows[0]).toHaveProperty('secretary');
    expect(result.rows[0]).toHaveProperty('user');
    expect(result.rows[0]).toHaveProperty('read');
    expect(result.rows[0]).toHaveProperty('status_history');
    expect(result.rows[0].categories[0]).toEqual(
      expect.objectContaining({
        title: 'Saneamento',
        id: category.id,
      })
    );
  });

  it('should search with options', async () => {
    const result = await searchManifestations({
      options: 'saneamento',
    });

    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('last_page');
    expect(result).toHaveProperty('rows');
    expect(result.rows[0]).toHaveProperty(
      'title',
      'description',
      'protocol',
      'id',
      'location',
      'latitude',
      'longitude'
    );
    expect(result.rows[0]).toHaveProperty('secretary');
    expect(result.rows[0]).toHaveProperty('user');
    expect(result.rows[0]).toHaveProperty('read');
    expect(result.rows[0]).toHaveProperty('status_history');
    expect(result.rows[0].categories[0]).toEqual(
      expect.objectContaining({
        title: category.title,
        id: category.id,
      })
    );
  });
});
