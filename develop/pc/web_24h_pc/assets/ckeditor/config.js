/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	config.language = 'zh-cn';
	config.height = 400;
	config.toolbar = 'Full';
	config.toolbar_Full =
	[
        //加粗     斜体，     下划线      穿过线      下标字        上标字
        ['Bold','Italic','Underline','Strike','Subscript','Superscript'],
        // 数字列表          实体列表            减小缩进    增大缩进
        ['NumberedList','BulletedList','-','Outdent','Indent'],
        //左对 齐             居中对齐          右对齐          两端对齐
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        //超链接  取消超链接 锚点
        ['Link','Unlink','Anchor'],
        //图片    flash    表格       水平线            表情       特殊字符        分页符
        ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
        '/',
        // 样式       格式      字体    字体大小
        ['Styles','Format','Font','FontSize'],
        //文本颜色     背景颜色
        ['TextColor','BGColor'],
        //全屏           显示区块
        ['Maximize', 'ShowBlocks','-']
 	]
//	[
//	    ['Source','-','Save','NewPage','Preview','-','Templates'],
//	    ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
//	    ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
//	    ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
//	    '/',
//	    ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
//	    ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
//	    ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
//	    ['Link','Unlink','Anchor'],
//	    ['Image','Flash','Table'],
//	    ['Styles','Format','Font','FontSize'],
//	    ['TextColor','BGColor'],
//	    ['Maximize', 'ShowBlocks','-','About']
//	];
};