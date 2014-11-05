
( function() {
	'use strict';

	CKEDITOR.plugins.a11ychecker.quickFixes.get( 'Base', function( Base ) {
		/**
		 * QuickFix renaming an attribute {@link #attributeName} to another name
		 * {@link #attributeTargetName}.
		 *
		 * @member CKEDITOR.plugins.a11ychecker.quickFix
		 * @class AttributeRename
		 * @constructor
		 * @param {CKEDITOR.plugins.a11ychecker.Issue} issue Issue QuickFix is created for.
		 */
		function AttributeRename( issue ) {
			Base.call( this, issue );
		}

		AttributeRename.prototype = new Base();

		AttributeRename.prototype.constructor = AttributeRename;

		/**
		 * Name of the attribute to be renamed.
		 *
		 * @member CKEDITOR.plugins.a11ychecker.quickFix.AttributeRename
		 */
		AttributeRename.prototype.attributeName = 'title';

		/**
		 * A desired name for the attribute.
		 *
		 * @member CKEDITOR.plugins.a11ychecker.quickFix.AttributeRename
		 */
		AttributeRename.prototype.attributeTargetName = 'alt';

		AttributeRename.prototype.display = function( form ) {
			var proposedValue = this.issue.element.getAttribute( this.attributeName) || '';

			form.setInputs( {
				value: {
					type: 'text',
					label: 'Value',
					value: proposedValue
				}
			} );
		};

		/**
		 * @param {Object} formAttributes Object containing serialized form inputs. See
		 * {@link CKEDITOR.plugins.a11ychecker.ViewerForm#serialize}.
		 * @param {Function} callback Function to be called when a fix was applied. Gets QuickFix object
		 * as a first parameter.
		 */
		AttributeRename.prototype.fix = function( formAttributes, callback ) {
			var issueElement = this.issue.element,
				desiredValue = formAttributes.value;

			// Set desired attribute value.
			issueElement.setAttribute( this.attributeTargetName, desiredValue );
			// Unset the old attribute.
			issueElement.removeAttribute( this.attributeName );

			if ( callback ) {
				callback( this );
			}
		};

		CKEDITOR.plugins.a11ychecker.quickFixes.add( 'AttributeRename', AttributeRename );
	} );
}() );