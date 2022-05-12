const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  translate (text, locale) {
    let translated = text;

    if(locale === 'american-to-british'){
      //convert american only words
      translated = this.checkMatches(translated, Object.keys(americanOnly), Object.values(americanOnly));

      //convert american spelling
      translated = this.checkMatches(translated, Object.keys(americanToBritishSpelling), Object.values(americanToBritishSpelling));

      //convert american titles
      translated = this.checkMatches(translated, Object.keys(americanToBritishTitles), Object.values(americanToBritishTitles));

      //convert american times
      translated = this.checkTime(translated, locale);

    }else if(locale === 'british-to-american'){
      //convert british only words
      translated = this.checkMatches(translated, Object.keys(britishOnly), Object.values(britishOnly));

      //convert british spelling
      translated = this.checkMatches(translated, Object.values(americanToBritishSpelling), Object.keys(americanToBritishSpelling));

      //convert british titles
      translated = this.checkMatches(translated, Object.values(americanToBritishTitles), Object.keys(americanToBritishTitles));

      //convert british times
      translated = this.checkTime(translated, locale);
    }

    if(translated === text) return 'Everything looks good to me!';
    console.log(translated);
    return translated;
  }

  checkMatches(sentence, checkList, replaceList){
    let translated = sentence;

    checkList.forEach( (word, i) => {
      let regex = new RegExp('(?<=^| )'+word+'(?=[ .!,;:\'])', "i");
      let foundIndex = translated.search(regex);

      if(foundIndex >= 0){
        let needsUpperCase = /[A-Z]/.test(translated[foundIndex]);
        let replacement = replaceList[i];
        if(needsUpperCase) replacement = replacement[0].toUpperCase()+replacement.slice(1);

        translated = translated.replace(regex, this.wrapTranslation(replacement));
      }
    });

    return translated;
  }

  checkTime(sentence, locale){
    let translated = sentence;
    let punctuation = locale === 'american-to-british' ? ':' : '.';
    let replacePunctuation = locale === 'american-to-british' ? '.' : ':';

    let regex = new RegExp('(2[0-3]|[0-1]?[\\d])['+punctuation+'][0-5][\\d]', 'g');

    let matches = translated.match(regex);

    if(matches){
      matches.forEach(match => {
        let replacement = match.replace(punctuation, replacePunctuation);
        translated = translated.replace(match, this.wrapTranslation(replacement));
      });
    }

    return translated;
  }

  wrapTranslation (word) {
    return '<span class="highlight">' + word + '</span>';
  }

}

module.exports = Translator;