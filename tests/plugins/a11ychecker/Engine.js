/* bender-tags: editor,unit */
/* bender-include: %TEST_DIR%_helpers/require.js, %TEST_DIR%_helpers/requireConfig.js */
/*global require*/

( function() {
	'use strict';

	require( [ 'Engine', 'helpers/sinon/sinon_amd.min' ], function( Engine, sinon ) {

		bender.test( {
			'test Engine.getFixType': function() {
				var originRequire = require;

				require = sinon.spy();

				Engine.getFixType( 'Foo' );

				assert.areSame( 1, require.callCount, 'require calls count' );
				var requireParam = require.getCalls()[ 0 ].args[ 0 ];
				assert.isInstanceOf( Array, requireParam, 'Invalid param type given to require()' );
				assert.areSame( 'QuickFix/Foo', requireParam[ 0 ], 'Invalid param value given to require()' );

				require = originRequire;
			},

			'test Engine.getFixType callback': function() {
				var quickFixMock = {},
					originRequire = require,
					fixCallback = sinon.spy();

				require = sinon.spy( function( name, requireCallback ) {
					requireCallback( quickFixMock );
				} );

				try {
					Engine.getFixType( 'Foo', fixCallback );

					assert.areSame( 1, fixCallback.callCount, 'Callback called once' );
					var requireParam = fixCallback.getCalls()[ 0 ].args[ 0 ];
					assert.areSame( quickFixMock, requireParam, 'Callback has a valid parameter' );
				} catch ( e ) {
					throw e;
				} finally {
					require = originRequire;
				}
			},

			'test Engine.getFixType store types': function() {
				// Types fetched by the getFix method, should be stored statically
				// in Engine.fixes object.
				var quickFixMock = {},
					originRequire = require;

				require = sinon.spy( function( name, requireCallback ) {
					requireCallback( quickFixMock );
				} );

				try {
					Engine.getFixType( 'BomBomFoo' );

					assert.areSame( quickFixMock, Engine.fixes.BomBomFoo,
						'Fetched QuickFix should be stored in Engine.fixes' );
				} catch ( e ) {
					throw e;
				} finally {
					require = originRequire;
				}
			},

			'test Engine.getFixType returns cached type': function() {
				// getFix() should not call require() when it already has requested type
				// cached.
				var quickFixMock = {},
					originRequire = require;

				require = sinon.spy();

				try {
					Engine.fixes.Baz = 1;
					Engine.getFixType( 'Baz', function( param ) {
						assert.areSame( 1, param, 'Valid param given' );
					} );

					assert.areSame( 0, require.callCount, 'require was not called' );
				} catch ( e ) {
					throw e;
				} finally {
					require = originRequire;
				}
			},

			'test Engine.getFixes no matching quickfixes': function() {
				var engine = new Engine(),
					callback = sinon.spy();

				engine.getFixes( {
						// This property should not exist in engine.fixesMapping.
						id: 'foo-bar-baz'
					}, callback );

				assert.areSame( 1, callback.callCount, 'callback calls count' );
				assert.isTrue( callback.alwaysCalledWithExactly( [] ), 'callback parameter' );
			},

			'test Engine.getFixes': function() {
				var engine = new Engine(),
					callback = sinon.spy( function( quickFixes ) {
						resume( function() {
							assert.areSame( 1, callback.callCount, 'callback calls count' );
							assert.isInstanceOf( Array, quickFixes, 'Invalid parameter type given to callback' );
							assert.areSame( 4, quickFixes.length, 'Invalid quickfixes count' );
							assert.isInstanceOf( DummyType, quickFixes[ 0 ], 'Items have proper type' );
						} );
					} ),
					originRequire = require,
					// A sequence of results returned by require() method.
					requireSequence = [ DummyType, DummyType, DummyType, DummyType ],
					requireReplacement = sinon.spy( function( requrestedType, requireCallback ) {
						setTimeout( function() {
							requireCallback( requireSequence.pop() );
						}, 40 );
					} );

				try {
					require = requireReplacement;

					// That will force 4 require() calls.
					engine.fixesMapping.foo = [ 1, 2, 3, 4 ];

					engine.getFixes( {
							// This property should not exist in engine.fixesMapping.
							id: 'foo'
						}, callback );

					wait( 3000 );
				} catch( e ) {
					throw e;
				} finally {
					require = originRequire;
				}

				function DummyType() {
				}
			}
		} );
	} );
} )();