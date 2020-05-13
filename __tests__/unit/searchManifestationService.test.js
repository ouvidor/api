import truncate from '../util/truncate';

import Manifestation from '../../src/models/Manifestation';
import searchManifestationService from '../../src/services/SearchManifestationService';
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
    } = await seedDatabase();
    category = categorySeed;
    ombudsman = seedOmbudsman;
    types = seedTypes;
  });

  it('should search for manifestations', async () => {
    const user = await User.create({
      email: 'email@gmail.com',
      first_name: 'Nome',
      last_name: 'Sobrenome',
      password: '123456',
    });

    try {
      const manifestation = await Manifestation.create({
        title: 'rua',
        description: 'descrição',
        types_id: types[0].id,
        users_id: user.id,
        ombudsmen_id: ombudsman.id,
      });

      await manifestation.setCategories([category.id]);
    } catch (error) {
      console.log(error);
    }

    const manifestations = await searchManifestationService.run('rua');

    expect(manifestations).toHaveProperty('count');
    expect(manifestations).toHaveProperty('last_page');
    expect(manifestations).toHaveProperty('rows');
    expect(manifestations.rows[0]).toHaveProperty(
      'title',
      'description',
      'protocol',
      'id',
      'location',
      'latitude',
      'longitude'
    );
    expect(manifestations.rows[0]).toHaveProperty('secretary');
    expect(manifestations.rows[0]).toHaveProperty('user');
    expect(manifestations.rows[0]).toHaveProperty('read');
    expect(manifestations.rows[0]).toHaveProperty('status_history');
    expect(manifestations.rows[0].categories[0]).toEqual(
      expect.objectContaining({
        title: 'Saneamento',
        id: category.id,
      })
    );
  });
});
