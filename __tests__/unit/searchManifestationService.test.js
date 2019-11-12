import truncate from '../util/truncate';

import Manifestation from '../../src/app/models/Manifestation';
import Type from '../../src/app/models/Type';
import Category from '../../src/app/models/Category';
import searchManifestationService from '../../src/app/services/SearchManifestationService';
import User from '../../src/app/models/User';

describe('Search Manifestation Service', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
  });

  it('should search for manifestations', async () => {
    const type = await Type.create({ title: 'Reclamação' });
    expect(type).toBeDefined();
    expect(type).toHaveProperty('id');

    const category = await Category.create({ title: 'Saneamento' });
    expect(category).toBeDefined();
    expect(category).toHaveProperty('id');

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
        type_id: type.id,
        user_id: user.id,
      });

      await manifestation.setCategories([category.id]);
    } catch (error) {
      console.log(error);
    }

    const manifestations = await searchManifestationService.run('rua');
    expect(manifestations).toBeDefined();
    expect(manifestations[0]).toBeDefined();
    expect(manifestations[0]).toEqual(
      expect.objectContaining({
        title: 'rua',
        description: 'descrição',
        latitude: null,
        type_id: type.id,
      })
    );
    expect(manifestations[0].categories[0]).toEqual(
      expect.objectContaining({
        title: 'Saneamento',
        id: category.id,
      })
    );
  });
});
