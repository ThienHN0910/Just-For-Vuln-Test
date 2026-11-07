const escapeHtml = require('escape-html');

function clean(value) {
  return escapeHtml(String(value));
}

module.exports = { clean };
