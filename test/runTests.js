var page = require('webpage').create();
page.open('SpecRunner.html', function(status){
  if (status === 'success')
    phantom.exit(0);
  else
    phantom.exit(-1);
});