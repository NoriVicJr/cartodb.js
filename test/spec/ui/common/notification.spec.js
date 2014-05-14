
describe("common.ui.Notification", function() {

  var notification;
  beforeEach(function() {
    notification = new cdb.ui.common.Notification({
        el: $('<div>'),
        template: 'template'
    });
    //spyOn(dialog, 'cancel');
  });

  it("open should show the element", function() {
    expect(notification.$el.css('display')).toEqual('none');
    notification.open();

    waitsFor(function(){
      return notification.$el.css('display') !== 'none';
    });
    runs(function () {
      expect(notification.$el.css('display')).toEqual('block');
    });
  });

  it("should be closed on timeout", function() {
    runs(function () {
      notification = new cdb.ui.common.Notification({
        el: $('<div>'),
        timeout: 250,
        template: 'template'
      });
      notification.open();
    });
    waitsFor(function(){
      return notification.$el.css('display') === 'none';
    });
    runs(function () {
      expect(notification.$el.css('display')).toEqual('none');
    });
  });


});
