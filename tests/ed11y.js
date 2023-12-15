/*
  © 2023 CVS Health and/or one of its affiliates. All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/*
  ed11y
  This test implements the Editoria11y ruleset for accessibility.
*/

// IMPORTS

// Module to handle files.
const fs = require('fs/promises');

// FUNCTIONS

// Conducts and reports the Editoria11y tests.
exports.reporter = async (page, options) => {
  // Get the nonce, if any.
  const {report} = options;
  const {jobData} = report;
  const scriptNonce = jobData && jobData.lastScriptNonce;
  // Get the test script.
  const script = await fs.readFile(`${__dirname}/../ed11y/editoria11y.min.js`, 'utf8');
  const rawResultJSON = await page.evaluate(args => new Promise(async resolve => {
    const {scriptNonce, script} = args;
    // When the script is executed:
    document.addEventListener('ed11yResults', () => {
      console.log('Event occurred');
      // Get the result.
      const resultObj = {};
      [
        'version',
        'options',
        'elements',
        'results',
        'mediaCount',
        'roots',
        'imageAlts',
        'headingOutline',
        'errorCount',
        'warningCount',
        'dismissedCount',
        'totalCount'
      ]
      .forEach(key => {
        resultObj[key] = Ed11y[key];
      });
      // Delete useless properties from the result.
      resultObj.imageAlts = resultObj.imageAlts.filter(item => item[3] !== 'pass');
      delete resultObj.options.sleekTheme;
      delete resultObj.options.darkTheme;
      delete resultObj.options.lightTheme;
      // Revise the properties of the element results.
      resultObj.results.forEach(elResult => {
        if (elResult.content) {
          elResult.content = elResult.content.replace(/\s+/g, ' ');
        }
        delete elResult.position;
        delete elResult.dismissalKey;
        delete elResult.dismissalStatus;
        if (elResult.element) {
          elResult.tagName = elResult.element.tagName || '';
          elResult.id = elResult.element.id || '';
          const locRect = elResult.element.getBoundingClientRect();
          elResult.loc = {};
          ['x', 'y', 'width', 'height'].forEach(dim => {
            elResult.loc[dim] = Math.round(locRect[dim]);
          });
          let elText = elResult.element.textContent.replace(/\s+/g, ' ').trim();
          if (! elText) {
            elText = elResult.element.outerHTML;
          }
          if (elText.length > 400) {
            elText = `${elText.slice(0, 200)}…${elText.slice(-200)}`;
          }
          elResult.excerpt = elText.replace(/\s+/g, ' ');
        }
      });
      // Return the result.
      const resultJSON = JSON.stringify(resultObj);
      console.log('About to return result');
      resolve(resultJSON);
      console.log('Done');
    });
    // Add the test script to the page.
    const testScript = document.createElement('script');
    if (scriptNonce) {
      testScript.nonce = scriptNonce;
      console.log(`Added nonce ${scriptNonce} to script`);
    }
    testScript.textContent = script;
    document.body.insertAdjacentElement('beforeend', testScript);
    // Run the script.
    try {
      await new Ed11y({
        alertMode: 'headless'
      });
      console.log(`Ran script by creating Ed11y`);
    }
    catch(error) {
      console.log(`ERROR creating Ed11y (${error.message})`);
      resolve(JSON.stringify({error: error.message}));
    };
  }), {scriptNonce, script});
  console.log(`About to parse result`);
  const result = JSON.parse(rawResultJSON);
  let data = {};
  // Return the act report.
  return {
    data,
    result
  };
};
