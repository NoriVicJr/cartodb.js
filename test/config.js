//describe tools
requirejs.config({
  baseUrl: './src',
  paths: {
    lib : '../test/libs',
    suites : '../test/spec',
    src : '../src'
  }
});

// Start tests
requirejs([
  '../lib/jasmine-1.2.0/jasmine-html',
  '../lib/phantomjs/jasmine.console_reporter',

  /*********/
  /* SPECS */
  /*********/

  // Core source
  '../spec/core/decorators.spec',
  '../spec/core/config.spec',
  '../spec/core/log.spec',
  '../spec/core/model.spec',
  '../spec/core/view.spec',
  '../spec/core/template.spec',

  // Common specs
  '../spec/ui/common/dialog.spec',
  '../spec/ui/common/notification.spec',
  // '../spec/ui/common/table.spec',
  // '../spec/ui/common/tabpane.spec',

  // // Geo specs
  // '../spec/geo/layer_definition.spec',
  // '../spec/geo/common.spec',
  // '../spec/geo/ui/tooltip.spec',

  // '../spec/geo/map.spec',
  // '../spec/geo/leaflet.spec',
  // '../spec/geo/geometry.spec',
  // '../spec/geo/legend.spec',
  // '../spec/geo/infowindow.spec',
  // '../spec/geo/layer_selector.spec',
  // '../spec/geo/gmaps.spec',
  // '../spec/geo/geocoder.spec',

  // '../spec/geo/gmaps_cartodb_layer/hide',
  // '../spec/geo/gmaps_cartodb_layer/interaction',
  // '../spec/geo/gmaps_cartodb_layer/opacity',
  // '../spec/geo/gmaps_cartodb_layer/show',

  // // Vis specs
  // '../spec/vis/layers.spec',
  // '../spec/vis/vis.spec',

  // // API 
  // '../spec/api/layers.spec',
  // '../spec/api/layers/cartodb.spec',
  // '../spec/api/sql.spec'
],

function(){
  var jasmineEnv = jasmine.getEnv();
  jasmine.VERBOSE = true;
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(new jasmine.ConsoleReporter());
  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
      return htmlReporter.specFilter(spec);
  };

  jasmineEnv.execute();
});