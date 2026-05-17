const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const talkPath = path.join(__dirname, 'talk.js');
const talkCode = fs.readFileSync(talkPath, 'utf8');

function setupDocumentWithComment(text) {
  const dom = new JSDOM('<!doctype html><html><body><div id="talk-board"></div></body></html>', {
    url: 'http://localhost/'
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.location = dom.window.location;
  global.localStorage = dom.window.localStorage;
  global.Event = dom.window.Event;

  const key = 'comments:' + global.location.pathname;
  global.localStorage.setItem(key, JSON.stringify([{
    id: 'c1',
    name: '测试',
    text: text,
    t: 1680000000000
  }]));

  eval(talkCode);
  document.dispatchEvent(new window.Event('DOMContentLoaded'));

  return document;
}

test('sanitizeHtml removes disallowed script tags and keeps allowed <b>', () => {
  const doc = setupDocumentWithComment('<script>alert(1)</script><b>ok</b>');
  const body = doc.querySelector('#talk-list .body');

  expect(body).not.toBeNull();
  expect(body.innerHTML).toBe('alert(1)<b>ok</b>');
  expect(body.textContent).toBe('alert(1)ok');
});

test('sanitizeHtml strips unsafe href and unsafe style properties', () => {
  const html = '<a href="javascript:alert(1)">click</a> <a href="https://example.com">ok</a> <span style="color:red;position:absolute">x</span>';
  const doc = setupDocumentWithComment(html);
  const body = doc.querySelector('#talk-list .body');

  expect(body).not.toBeNull();
  expect(body.innerHTML).toContain('<a>click</a>');
  expect(body.innerHTML).toContain('<a href="https://example.com">ok</a>');
  expect(body.innerHTML).toContain('style="color:red"');
  expect(body.innerHTML).not.toContain('javascript:alert(1)');
  expect(body.innerHTML).not.toContain('position:absolute');
});