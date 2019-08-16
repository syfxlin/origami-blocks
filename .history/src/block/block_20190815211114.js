import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType, query } = wp.blocks;

registerBlockType( 'origami/notebox', {
	title: __( 'Origami Notebox' ),
	icon: 'format-aside',
	category: 'common',
	keywords: [
		__( 'notebox' ),
		__( 'Notebox' ),
		__( 'origami' ),
	],
	attributes: {
        content: {
            type: 'string',
            source: 'html',
            selector: 'p'
        },
        color_select: {
            type: 'string',
        }
    },
	edit: function( props ) {
        var content_ele = wp.element.createElement(
            wp.components.TextControl,
            {
                label: 'Origami Notebox块',
                value: props.attributes.content,
                onChange: function( val ) {
                    props.setAttributes( { content: val } );
                }
            }
        );
        var selected_ele = wp.element.createElement(
            wp.components.SelectControl,
            {
                label: '选择样式',
                value: props.attributes.color_select,
                onChange: function( val ) {
                    props.setAttributes( { color_select: val } );
                },
                options: [
                    { label: '请设置颜色', value: null },
                    { label: 'blue', value: 'blue' },
                    { label: 'green', value: 'green' },
                    { label: 'yellow', value: 'yellow' },
                    { label: 'red', value: 'red' },
                ]
            }
        );
		return (
            <div className={ props.className }>
                { content_ele }
                { selected_ele }
            </div>
        );
	},
	save: function( props ) {
	    var class_name = "message-box "+props.attributes.color_select;
		return (
		    <div>
    			<div class={ class_name }>
    				<p>{ props.attributes.content }</p>
    			</div>
			</div>
		);
	},
} );

registerBlockType( 'origami/prism', {
	title: __( 'Origami代码' ),
	icon: 'editor-code',
	category: 'common',
	keywords: [
		__( 'code' ),
		__( 'prism' ),
		__( 'origami' ),
	],
	attributes: {
        content: {
            type: 'string',
        },
        lang: {
            type: 'string',
        }
    },
	edit: function( props ) {
        var content_ele = wp.element.createElement(
            wp.components.TextareaControl,
            {
                label: 'Origami 代码块',
                value: props.attributes.content,
                onChange: function( val ) {
                    props.setAttributes( { content: val } );
                }
            }
        );
        var lang_ele = wp.element.createElement(
            wp.components.TextControl,
            {
                label: '代码语言',
                value: props.attributes.lang,
                onChange: function( val ) {
                    props.setAttributes( { lang: val } );
                }
            }
        );
		return (
            <div className={ props.className }>
                { content_ele }
                { lang_ele }
            </div>
        );
	},
	save: function( props ) {
	    var class_name1 = "line-numbers language-"+props.attributes.lang;
	    var class_name2 = "language-"+props.attributes.lang;
		return (
		    <div>
    			<pre class={ class_name1 }>
    			    <code class={ class_name2 }>{ props.attributes.content }</code>
    			</pre>
			</div>
		);
	},
} );