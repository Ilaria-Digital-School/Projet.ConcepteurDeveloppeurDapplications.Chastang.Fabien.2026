import { addCountry } from '../controllers/country.controller.js';

describe('addCountry', () => {
  it('create a new country', () => {
    const req = {
      body: { value: '23', name: 'Arménie' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    addCountry(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ value: '23', name: 'Arménie' });
  });
});
