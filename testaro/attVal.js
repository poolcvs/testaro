/*
  attVal
  This test reports attributes with illicit values.
*/
exports.reporter = async (page, withItems, attributeName, areLicit, values) => {
  console.log('Starting reporter');
  // Identify the elements that have the specified attribute with illicit values.
  const badAttributeData = await page.evaluate(
    async args => {
      const attributeName = args[0];
      // Whether the values are the licit or the illicit ones.
      const areLicit = args[1];
      const values = args[2];
      // Returns the text of an element.
      const textOf = (element, limit) => {
        let text = element.textContent;
        text = text.trim() || element.innerHTML;
        return text.replace(/\s+/sg, ' ').replace(/<>&/g, '').slice(0, limit);
      };
      // Get the elements (including the html element) with the attribute.
      const attributeElements = Array.from(document.querySelectorAll(`[${attributeName}]`));
      // Get those in which the attribute has an illicit value.
      const badElements = attributeElements
      .filter(el => {
        const value = el.getAttribute(attributeName);
        if (areLicit) {
          return ! values.includes(value);
        }
        else {
          return values.includes(value);
        }
      });
      const report = badElements.map(el => ({
        tagName: el.tagName,
        id: el.id,
        textStart: textOf(el, 70),
        attributeValue: el.getAttribute(attributeName)
      }));
      return report;
    },
    [attributeName, areLicit, values]
  );
  const data = {
    total: badAttributeData.length
  };
  const standardInstances = [];
  if (withItems) {
    data.items = badAttributeData;
    badAttributeData.forEach(item => {
      standardInstances.push({
        ruleID: 'attVal',
        what:
          `${item.tagName} element has attribute ${attributeName} with illicit value ${item.attributeValue}`,
        ordinalSeverity: 2,
        tagName: item.tagName,
        id: item.id,
        location: {
          doc: '',
          type: '',
          spec: ''
        },
        excerpt: item.textStart
      });
    });
  }
  else if (data.total) {
    standardInstances.push({
      ruleID: 'attVal',
      what: 'Elements have attributes with illicit values',
      count: data.total,
      ordinalSeverity: 2,
      tagName: '',
      id: '',
      location: {
        doc: '',
        type: '',
        spec: ''
      },
      excerpt: ''
    });
  }
  const totals = [0, 0, data.total, 0];
  return {
    data,
    totals,
    standardInstances
  };
};
