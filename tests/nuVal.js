/*
  nuVal
  This test subjects a page and its source to the Nu Html Checker, thereby testing scripted
  content found only in the loaded page and erroneous content before the browser corrects it.
  The API erratically replaces left and right double quotation marks with invalid UTF-8, which
  appears as 2 or 3 successive instances of the replacement character (U+fffd). Therefore, this
  test removes all such quotation marks and the replacement character. That causes
  'Bad value “” for' to become 'Bad value  for'. Since the corruption of quotation marks is
  erratic, no better solution is known.
*/

// ########## IMPORTS

// Module to make HTTP requests.
const fetch = require('node-fetch');
// Module to process files.
const fs = require('fs/promises');

// ########## FUNCTIONS

exports.reporter = async (page, options) => {
  const {rules} = options;
  // Get the browser-parsed page.
  const pageContent = await page.content();
  // Get the page source.
  const url = page.url();
  const scheme = url.replace(/:.+/, '');
  let rawPage;
  if (scheme === 'file') {
    const filePath = url.slice(7);
    rawPage = await fs.readFile(filePath, 'utf8');
  }
  else {
    try {
      const rawPageResponse = await fetch(url);
      rawPage = await rawPageResponse.text();
    }
    catch(error) {
      console.log(`ERROR getting page for nuVal test (${error.message})`);
      return {result: {
        prevented: true,
        error: 'ERROR getting page for nuVal test'
      }};
    }
  }
  // Get the data from validator.w3.org, a more reliable service than validator.nu.
  const fetchOptions = {
    method: 'post',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Content-Type': 'text/html; charset=utf-8'
    }
  };
  const nuURL = 'https://validator.w3.org/nu/?parser=html&out=json';
  const data = {};
  const result = {};
  // For each page type:
  for (const page of [['pageContent', pageContent], ['rawPage', rawPage]]) {
    try {
      // Get a Nu Html Checker report on it.
      fetchOptions.body = page[1];
      const nuResult = await fetch(nuURL, fetchOptions);
      const nuData = await nuResult.json();
      // Delete left and right quotation marks and their erratic invalid replacements.
      const nuDataClean = JSON.parse(JSON.stringify(nuData).replace(/[\u{fffd}“”]/ug, ''));
      result[page[0]] = nuDataClean;
      // If there is a report and rules were specified:
      if (! result[page[0]].error && rules && Array.isArray(rules) && rules.length) {
        // Remove all messages except those specified.
        result[page[0]].messages = result[page[0]].messages.filter(message => rules.some(rule => {
          if (rule[0] === '=') {
            return message.message === rule.slice(1);
          }
          else if (rule[0] === '~') {
            return new RegExp(rule.slice(1)).test(message.message);
          }
          else {
            console.log(`ERROR: Invalid nuVal rule ${rule}`);
            return false;
          }
        }));
      }
      return {
        data,
        result
      }
    }
    catch (error) {
      const message = `ERROR: Act failed (${error.message})`;
      console.log(message);
      return {
        data: {
          prevented: true,
          error: message,
        },
        result: {}
      };
    };
  }
};
