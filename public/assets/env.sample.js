(function (window) {
  window['env'] = window['env'] || {};

  // Environment variables
  window['env']['env'] = '${ENV}';
  window['env']['production'] = '${IS_PROD}';
  window['env']['backendBaseUrl'] = '${API_BASE_URL}';
})(this);
