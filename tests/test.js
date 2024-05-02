// userRoutes.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assurez-vous d'importer votre application Express
const User = require('../models/user'); // Assurez-vous d'importer votre modèle User
const { expect } = chai;

chai.use(chaiHttp);

describe('User Routes', () => {
  describe('GET /getAllUsers', () => {
    it('should return an array of users', async () => {
      const res = await chai.request(app).get('/getAllUsers');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      // Vous pouvez ajouter d'autres assertions pour vérifier le contenu de la réponse
    });
  });

  describe('GET /getUserById/:id', () => {
    it('should return a single user by ID', async () => {
      // Créez un utilisateur fictif pour tester
      const user = await User.create({ username: 'testUser', email: 'test@example.com' });

      const res = await chai.request(app).get(`/getUserById/${user._id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('username', 'testUser');
      // Vous pouvez ajouter d'autres assertions pour vérifier le contenu de la réponse
    });

    it('should return 404 if user ID is not found', async () => {
      const res = await chai.request(app).get('/getUserById/invalid_id');
      expect(res).to.have.status(404);
      // Vous pouvez ajouter d'autres assertions pour vérifier le contenu de la réponse
    });
  });
});


