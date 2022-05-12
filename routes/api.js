'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      //Return error if text or locale not provided
      if(req.body.text === undefined || req.body.locale === undefined) return res.json({error: 'Required field(s) missing'});

      //Return error if text is empty string
      if(req.body.text === '') return res.json({error: 'No text to translate'});

      //Return error if locale not expected string
      let localeTest = (req.body.locale === 'american-to-british') || (req.body.locale === 'british-to-american');
      if(!localeTest) return res.json({error: 'Invalid value for locale field'});

      let resObj = {
        text: req.body.text,
        translation: translator.translate(req.body.text, req.body.locale)
      };
      
      res.json(resObj);
    });
};
