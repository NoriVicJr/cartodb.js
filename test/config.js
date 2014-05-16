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

  /****************/
  /* NEEDED FILES */
  /****************/

  // "../../vendor/jquery.min",
  // "../../vendor/jquery.faviconNotify",

  // "../../vendor/underscore-min",
  // "../../vendor/backbone",
  // "../../vendor/leaflet",
  // // "../../vendor/wax.g",
  // "../../vendor/wax.cartodb",
  // // "../../vendor/cartodb-gmapsv3",
  // "../../vendor/mustache",
  // "../../vendor/GeoJSON",
  // "../../vendor/jscrollpane",
  // "../../vendor/spin",
  // "../../vendor/lzma",
  // "../../vendor/mod/carto",
  // "../../vendor/mod/torque.uncompressed",
  // "../../vendor/mod/jquery-ui/jquery.ui.core",
  // "../../vendor/mod/jquery-ui/jquery.ui.widget",
  // "../../vendor/mod/jquery-ui/jquery.ui.mouse",
  // "../../vendor/mod/jquery-ui/jquery.ui.slider",

  // "../../src/cartodb",

  // "../../src/core/decorator",
  // "../../src/core/config",
  // "../../src/core/log",
  // "../../src/core/profiler",
  // "../../src/core/template",
  // "../../src/core/model",
  // "../../src/core/view",

  // "../../src/geo/geometry",
  // "../../src/geo/map",
  // "../../src/geo/ui/header",
  // "../../src/geo/ui/legend",
  // "../../src/geo/ui/infobox",
  // "../../src/geo/ui/infowindow",
  // "../../src/geo/ui/layer_selector",
  // "../../src/geo/ui/zoom_info",
  // "../../src/geo/ui/tiles_loader",
  // "../../src/geo/ui/zoom",
  // "../../src/geo/ui/tooltip",
  // "../../src/geo/ui/time_slider",
  // "../../src/geo/ui/fullscreen",

  // "../../src/geo/layer_definition",
  // "../../src/geo/common",

  // "../../src/geo/leaflet/leaflet.geometry",

  // "../../src/geo/leaflet/leaflet_base",
  // "../../src/geo/leaflet/leaflet_plainlayer",
  // "../../src/geo/leaflet/leaflet_tiledlayer",
  // "../../src/geo/leaflet/leaflet_cartodb_layergroup",
  // "../../src/geo/leaflet/leaflet_cartodb_layer",
  // "../../src/geo/leaflet/torque",
  // "../../src/geo/leaflet/leaflet",

  // "../../src/geo/gmaps/gmaps.geometry",
  // "../../src/geo/gmaps/gmaps_base",
  // "../../src/geo/gmaps/gmaps_baselayer",
  // "../../src/geo/gmaps/gmaps_plainlayer",
  // "../../src/geo/gmaps/gmaps_tiledlayer",
  // "../../src/geo/gmaps/gmaps_cartodb_layergroup",
  // "../../src/geo/gmaps/gmaps_cartodb_layer",
  // "../../src/geo/gmaps/torque",
  // "../../src/geo/gmaps/gmaps",
  // "../../src/geo/geocoder",

  // "../../src/ui/common/dialog",
  // "../../src/ui/common/share",
  // "../../src/ui/common/notification",
  // "../../src/ui/common/table",
  // "../../src/ui/common/tabpane",
  // "../../src/ui/common/dropdown",
  // "../../src/ui/common/share",

  // "../../src/vis/vis",
  // "../../src/vis/layers",
  // "../../src/vis/overlays",

  // "../../src/api/layers",
  // "../../src/api/sql",
  // "../../src/api/vis",

  /*******************/
  /* JASMINE & SINON */
  /********++++++*****/

  // '../lib/jasmine-1.2.0/jasmine',
  // '../lib/jasmine-1.2.0/jasmine-html',
  // '../lib/jasmine-1.2.0/jasmine-console',
  // '../lib/sinon-1.3.4',
  // '../lib/sinon-ie',

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
  '../spec/ui/common/table.spec',
  '../spec/ui/common/tabpane.spec',

  // Geo specs
  '../spec/geo/layer_definition.spec',
  '../spec/geo/common.spec',
  '../spec/geo/ui/tooltip.spec',

  '../spec/geo/map.spec',
  '../spec/geo/leaflet.spec',
  '../spec/geo/geometry.spec',
  '../spec/geo/legend.spec',
  '../spec/geo/infowindow.spec',
  '../spec/geo/layer_selector.spec',
  '../spec/geo/gmaps.spec',
  // '../spec/geo/geocoder.spec', // Geocoder specs don't make any sense right now

  // '../spec/geo/gmaps_cartodb_layer/hide',
  '../spec/geo/gmaps_cartodb_layer/interaction',
  '../spec/geo/gmaps_cartodb_layer/opacity',
  '../spec/geo/gmaps_cartodb_layer/show',

  // Vis specs
  // '../spec/vis/layers.spec',
  '../spec/vis/vis.spec',

  // API 
  // '../spec/api/layers.spec',
  '../spec/api/layers/cartodb.spec',
  '../spec/api/sql.spec'
],

function(){
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  window.htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  if (navigator.userAgent.indexOf("PhantomJS") > 0) {
    window.consoleReporter = new jasmine.ConsoleReporter();
    jasmineEnv.addReporter(consoleReporter);
  }

  jasmineEnv.execute();
});