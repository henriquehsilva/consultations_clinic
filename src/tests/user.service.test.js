import UserServices from '../services/user.service';

beforeEach(() => {
    jest.useFakeTimers();
  });

test('Should created a user', () => {
    let user = {
        name: 'Henrique', 
        phone: '11999999999'
    }

    const createUser = UserServices.create(1, user);

    expect(createUser).toHaveProperty('_id');
});