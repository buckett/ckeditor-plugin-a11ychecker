/* bender-tags: a11ychecker,unit */

( function() {
	'use strict';

	bender.require( [ 'helpers/quickFixTest' ], function( quickFixTest ) {
		var tests = {
				setUp: function() {
					// Assign a QuickFix class to more precise property.
					QuickFix = this.quickFixType;
				},

				'test constructor': function() {
					var expectedIssue = {},
						fix = new QuickFix( expectedIssue );

					assert.areSame( expectedIssue, fix.issue, 'Object has valid issue property' );
				},

				'test QuickFix.validate': function() {
					// Lets simply check default return value, because there's no
					// special logic in QuickFix.validate.
					var ret = QuickFix.prototype.validate.call( {}, {} );

					assert.isInstanceOf( Array, ret );
					assert.areSame( 0, ret.length, 'Return array length' );
				}
			},
			QuickFix;

		quickFixTest( 'QuickFix', tests );
	} );
} )();