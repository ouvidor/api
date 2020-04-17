import truncate from '../util/truncate';

import Manifestation from '../../src/app/models/Manifestation';
import searchManifestationService from '../../src/app/services/SearchManifestationService';
import User from '../../src/app/models/User';
import seedDatabase from '../util/seedDatabase';

let category;

describe('Search Manifestation Service', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    const { category: categorySeed } = await seedDatabase();
    category = categorySeed;
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
        type_id: 1,
        user_id: user.id,
      });

      await manifestation.setCategories([category.id]);
    } catch (error) {
      console.log(error);
    }

    const manifestations = await searchManifestationService.run('rua');

    expect(manifestations).toHaveProperty('count');
    expect(manifestations).toHaveProperty('last_page');
    expect(manifestations).toHaveProperty('rows');
    expect(manifestations.rows[0]).toEqual(
      expect.objectContaining({
        title: 'rua',
        description: 'descrição',
        latitude: null,
        type_id: 1,
      })
    );
    expect(manifestations.rows[0].categories[0]).toEqual(
      expect.objectContaining({
        title: 'Saneamento',
        id: category.id,
      })
    );
  });
});
