/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {

	config.toolbarGroups = [
		{ name: 'clipboard', groups: [ 'undo', 'clipboard' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'document', groups: [ 'document', 'mode', 'doctools' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		'/',
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
	];
	//config.skin = 'office2013';
	config.language = 'zh-cn';
	config.resize_enabled = false;
	config.editingBlock = true;

	config.removeButtons = 'Source,About,ShowBlocks,Image,Flash,HorizontalRule,Smiley,SpecialChar,Cut,Copy,Paste,PasteText,PasteFromWord,NewPage,Print,Preview,Templates,Find,Replace,Form,TextField,Radio,Checkbox,Textarea,Select,Button,ImageButton,HiddenField,PageBreak,Iframe,Anchor,Save,Scayt,SelectAll,Language';
};
