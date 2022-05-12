const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
  test('Translation with text and locale fields: POST request to /api/translate', function(done){
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: 'We watched the tantalising footie match at 4.30 for a while with Mr Roberts.',
        locale: 'british-to-american'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'Response should be an object');
        assert.property(res.body, 'text', 'Response should have a text property');
        assert.property(res.body, 'translation', 'Response should have a translation property');
        assert.equal(res.body.text, 'We watched the tantalising footie match at 4.30 for a while with Mr Roberts.');
        assert.equal(res.body.translation, 'We watched the <span class="highlight">tantalizing</span> <span class="highlight">soccer</span> match at <span class="highlight">4:30</span> for a while with <span class="highlight">Mr.</span> Roberts.');
        done();
      });
  });

  test('Translation with text and invalid locale field: POST request to /api/translate', function(done){
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: 'We watched the tantalising footie match at 4.30 for a while with Mr Roberts.',
        locale: 'something-wrong'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'Response should be an object');
        assert.property(res.body, 'error', 'Response should have an error property');
        assert.equal(res.body.error, 'Invalid value for locale field', 'Error should be "Invalid value for locale field"');
        done();
      });
  });

  test('Translation with missing text field: POST request to /api/translate', function(done){
    chai
      .request(server)
      .post('/api/translate')
      .send({
        locale: 'british-to-american'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'Response should be an object');
        assert.property(res.body, 'error', 'Response should have an error property');
        assert.equal(res.body.error, 'Required field(s) missing', 'Error should be "Required field(s) missing"');
        done();
      });
  });

  test('Translation with missing locale field: POST request to /api/translate', function(done){
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: 'We watched the tantalising footie match at 4.30 for a while with Mr Roberts.',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'Response should be an object');
        assert.property(res.body, 'error', 'Response should have an error property');
        assert.equal(res.body.error, 'Required field(s) missing', 'Error should be "Required field(s) missing"');
        done();
      });
  });

  test('Translation with empty text: POST request to /api/translate', function(done){
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: '',
        locale: 'british-to-american'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'Response should be an object');
        assert.property(res.body, 'error', 'Response should have an error property');
        assert.equal(res.body.error, 'No text to translate', 'Error should be "No text to translate"');
        done();
      });
  });

  test('Translation with text that needs no translation: POST request to /api/translate', function(done){
    chai
      .request(server)
      .post('/api/translate')
      .send({
        text: 'We watched the tantalising footie match at 4.30 for a while with Mr Roberts.',
        locale: 'american-to-british'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'Response should be an object');
        assert.property(res.body, 'text', 'Response should have a text property');
        assert.property(res.body, 'translation', 'Response should have a translation property');
        assert.equal(res.body.text, 'We watched the tantalising footie match at 4.30 for a while with Mr Roberts.');
        assert.equal(res.body.translation, 'Everything looks good to me!');
        done();
      });
  });
});
