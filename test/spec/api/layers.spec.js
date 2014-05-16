describe('api.layers', function() {

  describe('loadLayer leaflet', function() {
    loadLayerSpecs(function() {
      return L.map($('<div>')[0]).setView([0, 0], 3);
    });
  });

  describe('loadLayer gmaps', function() {
    loadLayerSpecs(function() {
      return new google.maps.Map($('<div>')[0],{
        zoom: 3,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    });
  });


  describe('loadLayer unknow', function() {
    it("shoudl return an error for unknow map types", function() {
      var map = {};
      var err = false;
      runs(function() {
        cartodb.createLayer(map, { kind: 'plain', options: {} }, function(l) {
          layer = l;
        }).error(function() {
          err = true;
        });
      })
      waitsFor(function() { return err }, "Time out", 200);
      runs(function() {
        expect(err).toEqual(true);
      });
    })
  });

  //
  // shared specs for each map
  //
  function loadLayerSpecs(mapFn) {

    describe("(shared)", function() {
      var map;
      beforeEach(function() {
        map = mapFn();
        cartodb.torque = torque;
      });

      afterEach(function() {
        delete cartodb.torque;
      });

      it("should fecth layer when user and pass are specified", function() {
        spyOn(cdb.vis.Loader, 'get');
        cartodb.createLayer(map, {
          user: 'development',
          table: 'clubbing',
          host: 'localhost.lan:3000',
          protocol: 'http'
        });
        expect(cdb.vis.Loader.get).toHaveBeenCalled();
      });

      it("should fecth layer when a url is specified", function() {
        spyOn(cdb.vis.Loader, 'get');
        cartodb.createLayer(map, 'http://test.com/layer.json');
        expect(cdb.vis.Loader.get).toHaveBeenCalled();
      });

      it("should not fecth layer when kind and options are specified", function() {
        spyOn(cdb.vis.Loader, 'get');
        cartodb.createLayer(map, { kind: 'plain', options: {} });
        expect(cdb.vis.Loader.get).not.toHaveBeenCalled();
      });

      it("should create a layer", function() {
        var layer, called = false;
        runs(function() {
          cartodb.createLayer(map, { kind: 'plain', options: {} }, function(l) {
            layer = l;
            called = true;
          });
        });
        waitsFor(function() { return called }, "Time out", 400);
        runs(function() {
          expect(layer).not.toEqual(undefined);
          expect(layer.type).toEqual('plain');
        });
      });

      it("should create a layer with type", function() {
        var layer, called = false;
        runs(function() {
          cartodb.createLayer(map, { kind: 'cartodb', options: { tile_style: 'test', table_name: 'table', user_name: 'test'} }, function(l) {
            layer = l;
            called = true;
          });
        });
        waitsFor(function() { return called }, "Time out", 400);
        runs(function() {
          expect(layer.type).toEqual('cartodb');
        });
      });

      it("should create a layer with options", function() {
        var layer, called = false;
        runs(function() {
          cartodb.createLayer(map, { kind: 'cartodb', options: {tile_style: 'test', table_name: 'table', user_name: 'test'} }, {query: 'select test'}, function(l) {
            layer = l;
            called = true;
          });
        });
        waitsFor(function() { return called }, "Time out", 400);
        runs(function() {
          expect(layer.options.query).toEqual('select test');
        });
      });

      it("should use https when https == true", function() {
        var layer, called = false;

        cartodb.createLayer(map, { kind: 'cartodb', options: {tile_style: 'test', table_name: 'table', user_name: 'test'} }, {https: true}, function(l) {
          layer = l;
          called = true;
        });

        waitsFor(function() { return called }, "Time out", 400);

        runs(function() {
          expect(layer._host().indexOf('https')).toEqual(0)
        });
      });

      it("should not use https when https == false", function() {
        var layer, called = false;
        cartodb.createLayer(map, { kind: 'cartodb', options: {tile_style: 'test', table_name: 'table', user_name: 'test'} }, {https: false}, function(l) {
          layer = l;
        }).on('done', function(){
          called = true;
        });
        waitsFor(function() { return called }, "Time out", 400);
        runs(function() {
          expect(layer._host().indexOf('https')).toEqual(-1)
        });
      });

      it("should not substitute mapnik tokens", function() {
        var layer, called = false;

        cartodb.createLayer(map, { kind: 'cartodb', options: {tile_style: 'test', table_name: 'table', user_name: 'test'} }, {query: 'select !bbox!'}, function(l) {
          layer = l;
          called = true;
        })

        waitsFor(function() { return called }, "Time out", 1000);
        runs(function() {
          expect(layer.getQuery()).toEqual('select !bbox!');
        });
      });

      it("should manage errors", function() {
        var s = sinon.spy(), called = false;

        cartodb.createLayer(map, { options: {} }).on('error', function(){
          s.called = true;
          called = true;
        });

        waitsFor(function() { return called }, "Time out", 800);
        runs(function() {
          expect(s.called).toEqual(true);
        });
      });

      it("should call callback if the last argument is a function", function() {
        var layer;
        var s = sinon.spy();
        var s2 = sinon.spy();
        runs(function() {
          cartodb.createLayer(map, { kind: 'plain', options: {} }, s);
          cartodb.createLayer(map, layer={ kind: 'plain', options: {} }, { rambo: 'thebest'} ,s2)
            .on('done', function() { called = true })
        });
        waitsFor(function() { return s.called  }, "Time out", 1000);
        runs(function() {
          expect(s.called).toEqual(true);
          expect(layer.options.rambo).toEqual('thebest');
          expect(s2.called).toEqual(true);
        });

      });

      it("should load vis.json", function() {
        var layer, called = false;
        var s = sinon.spy();
        runs(function() {
          cartodb.createLayer(map, {
            updated_at: 'jaja',
            layers: [
              null,
              //{kind: 'plain', options: {} }
              {kind: 'cartodb', options: { tile_style: 'test', user_name: 'test', table_name: 'test', extra_params: { cache_buster: 'cb' }} }
            ]
          }, s).done(function(lyr) {
            layer = lyr;
            called = true;
          });
        });
        waitsFor(function() { return called }, "Time out", 300);
        runs(function() {
          expect(s.called).toEqual(true);
          //expect(layer.model.attributes.extra_params.updated_at).toEqual('jaja');
          expect(layer.model.attributes.extra_params.cache_buster).toEqual('cb');
          //expect(layer.model.attributes.extra_params.cache_buster).toEqual(undefined);
        });
      });

      // it("should load vis.json without infowindows", function() {
      //   var layer;
      //   var s = sinon.spy();
      //   var called = false;

      //   cartodb.createLayer(map, {
      //     updated_at: 'jaja',
      //     layers: [
      //       null,
      //       {kind: 'cartodb', options: { user_name: 'test', table_name: 'test', tile_style: 'test'}, infowindow: { fields: [], template: '' } }
      //     ]
      //   }, s).done(function(lyr) {
      //     layer = lyr;
      //     called = true;
      //   });

      //   waitsFor(function() {return s.called }, "Time out", 500);

      //   runs(function() {
      //     expect(s.called).toEqual(true);
      //   });

      // });

      // it("should load specified layer", function() {
      //   var layer;
      //   var s = sinon.spy();
      //   var called = false;

      //   cartodb.createLayer(map, {
      //     updated_at: 'jaja',
      //     layers: [
      //       null,
      //       {kind: 'cartodb', options: { user_name: 'test', table_name: 'test', tile_style: 'test'}, infowindow: null },
      //       {kind: 'torque', options: { user_name: 'test', table_name: 'test', tile_style: '#test { marker-width: 10; }'}, infowindow: null }
      //     ]
      //   }, { layerIndex: 2 }, s).done(function(lyr) {
      //     layer = lyr;
      //     called = true;
      //   });

      //   waitsFor(function() { return called }, "Time out", 400);

      //   runs(function() {
      //     expect(s.called).toEqual(true);
      //     // check it's a torque layer and not a cartodb one
      //     expect(layer.model.get('type')).toEqual('torque');
      //   });

      // });

      // it("should add cartodb logo with torque layer although it is not defined", function() {
      //   var layer;
      //   var s = sinon.spy();
      //   var called = false;

      //   runs(function() {
      //     cartodb.createLayer(map, {
      //       updated_at: 'jaja',
      //       layers: [
      //         null,
      //         {kind: 'cartodb', options: { user_name: 'test', table_name: 'test', tile_style: 'test'}, infowindow: null },
      //         {kind: 'torque', options: { user_name: 'test', table_name: 'test', tile_style: '#test { marker-width: 10; }'}, infowindow: null }
      //       ]
      //     }, { layerIndex: 2 }, s).done(function(lyr) {
      //       layer = lyr;
      //       setTimeout(function(){
      //         called = true;
      //       },2000)
      //     }).addTo(map)
      //   });

      //   var wait = 500;
      //   if (!map.getContainer) wait = 2500;

      //   waitsFor(function() { return called }, "Time out", waits);

      //   runs(function() {
      //     expect(layer.options.cartodb_logo).toEqual(undefined);
      //     if (map.getContainer) expect($(map.getContainer()).find('.cartodb-logo').length).toBe(1)
      //     if (map.getDiv)       expect($(map.getDiv()).find('.cartodb-logo').length).toBe(1)
      //   });
      // });

      // it("should create a named map", function() {
      //   var layer;
      //   var called = false;

      //   runs(function() {
      //     cartodb.createLayer(map, {
      //       type: 'namedmap',
      //       user_name: 'dev',
      //       options: {
      //         named_map: {
      //           name: 'testing',
      //           params: {
      //             color: 'red'
      //           }
      //         }
      //       }
      //     }).done(function(lyr) {
      //       layer = lyr;
      //       called = true;
      //     });
      //   });

      //   waitsFor(function() { return called }, "Time out", 200000);

      //   runs(function() {
      //     expect(layer).not.toEqual(undefined);
      //     expect(layer.toJSON()).toEqual({ color: 'red' });
      //   });

      // });

      // it("should use access_token", function() {
      //   var layer;
      //   var called = false;

      //   cartodb.createLayer(map, {
      //     type: 'namedmap',
      //     user_name: 'dev',
      //     options: {
      //       named_map: {
      //         name: 'testing',
      //         params: {
      //           color: 'red'
      //         }
      //       }
      //     }
      //   }, { https: true,  auth_token: 'at_rambo' }).done(function(lyr) {
      //     layer = lyr;
      //     called = true;
      //   });

      //   waitsFor(function() { return called }, "Time out", 200);

      //   runs(function() {
      //     expect(layer).not.toEqual(undefined);
      //     layer.layerToken = 'test';
      //     layer.getTiles(function(tiles) {
      //       expect(tiles.tiles[0].indexOf("auth_token=at_rambo")).not.toEqual(-1);
      //     });
      //   });

      // });

      // it("should create layer form sublayer list", function() {
      //   var layer, called = false;

      //   cartodb.createLayer(map, {
      //     type: 'cartodb',
      //     sublayers: [{
      //       sql: 'select * from table',
      //       cartocss: 'test',
      //       interactivity: 'testi'
      //     }]
      //   }).done(function(lyr) {
      //     layer = lyr;
      //     called = true;
      //   });

      //   waitsFor(function() { return called }, "Time out", 200);

      //   runs(function() {
      //     expect(layer).not.toEqual(undefined);
      //     expect(layer.toJSON()).toEqual({
      //       version: '1.0.0',
      //       stat_tag: 'API',
      //       layers: [{
      //         type: 'cartodb',
      //         options: {
      //           sql: 'select * from table',
      //           cartocss: 'test',
      //           cartocss_version: '2.1.0',
      //           interactivity: ['testi']
      //         }
      //       }]
      //     });
      //   });

      // });

      // it("should have addTo", function() {
      //   var layer;
      //   var called = false;
        
      //   cartodb.createLayer(map, {
      //     type: 'cartodb',
      //     sublayers: [{
      //       sql: 'select * from table',
      //       cartocss: 'test',
      //       interactivity: 'testi'
      //     }]
      //   })
      //   .addTo(map)
      //   .done(function(lyr) {
      //     layer = lyr;
      //     called = true;
      //   });

      //   waitsFor(function() { return called }, "Time out", 300);

      //   runs(function() {
      //     expect(layer).not.toEqual(undefined);
      //     if(map.overlayMapTypes) {
      //       expect(layer).toBe(map.overlayMapTypes.getAt(0));
      //     } else {
      //       expect(layer).toBe(map._layers[L.stamp(layer)]);
      //     }
      //   });

      // });

    //});

    });
  }

});
