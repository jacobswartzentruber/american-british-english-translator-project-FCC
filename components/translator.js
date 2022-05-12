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

    }else if(locale === 'british-to-american'){
      //convert british only words
      translated = this.checkMatches(translated, Object.keys(britishOnly), Object.values(britishOnly));

      //convert american spelling
      translated = this.checkMatches(translated, Object.values(americanToBritishSpelling), Object.keys(americanToBritishSpelling));

      //convert american titles
      translated = this.checkMatches(translated, Object.values(americanToBritishTitles), Object.keys(americanToBritishTitles));
    }

    if(translated === text) return 'Everything looks good to me!';
    
    return translated;
  }

  checkMatches(sentence, checkList, replaceList){
    let translated = sentence;

    checkList.forEach( (word, i) => {
      let regex = new RegExp('(?<!-)'+word+'(?!-)', "i");
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

  /*translate (text, locale){
    if(locale === 'american-to-british') console.log("convert to british");
    if(locale === 'british-to-american') console.log("convert to american");

    let translated = text.split(/\s/).map(sequence => {
        return this.translateSequence(sequence, locale);
      });

    return translated.join(" ");
  };

  translateSequence (sequence, locale) {
    let translated = this.translateTitle(sequence, locale);
    if(sequence !== translated) return translated;

    translated = sequence.split(/\b/).map(word => {
      let lowercase = word.toLowerCase();

      if(locale === 'american-to-british'){
        //convert from american to british
        if(Object.keys(americanOnly).includes(lowercase)) return this.formatTranslation(word, americanOnly[lowercase]);
        if(Object.keys(americanToBritishSpelling).includes(lowercase)) return this.formatTranslation(word, americanToBritishSpelling[lowercase]);

      }else if(locale === 'british-to-american'){
        console.log(word);
        //convert from british to american
        if(Object.keys(britishOnly).includes(lowercase)) return this.formatTranslation(word, britishOnly[lowercase]);

        let spellingFound = Object.keys(americanToBritishSpelling).find(key => americanToBritishSpelling[key] === lowercase);
        if(spellingFound) return this.formatTranslation(word, spellingFound);
      }

      return word;
    });

    return translated.join("");
  }
  
  translateTitle (sequence, locale) {
    let lowercase = sequence.toLowerCase();

    if(locale === 'american-to-british'){

      if(Object.keys(americanToBritishTitles).includes(lowercase)) return this.formatTranslation(sequence, americanToBritishTitles[lowercase]);

    }else if(locale === 'british-to-american'){

      let titleFound = Object.keys(americanToBritishTitles).find(key => americanToBritishTitles[key] === lowercase);
      if(titleFound) return this.formatTranslation(sequence, titleFound);
      
    }

    return sequence;
  }*/

  formatTranslation (original, translated) {
    return this.wrapTranslation(this.caseFormat(original, translated));
  }

  caseFormat (original, translated){
    if(/[A-Z]/.test(original[0])) return translated[0].toUpperCase() + translated.slice(1);
    return translated;
  };

  wrapTranslation (word) {
    return '<span class="highlight">' + word + '</span>';
  }

}

module.exports = Translator;