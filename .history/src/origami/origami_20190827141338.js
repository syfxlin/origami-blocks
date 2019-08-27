/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
/* eslint-disable computed-property-spacing */
/* eslint-disable prefer-const */
/* eslint-disable space-unary-ops */
/* eslint-disable no-console */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable react/jsx-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable array-bracket-spacing */
/* eslint-disable space-in-parens */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import './style.scss';
import './editor.scss';
import langList from './utils/langList';
import { toHtml, toMarkdown } from './utils/switchContent';
import {
    TextControl,
    SelectControl,
    Button,
    CheckboxControl
} from '@wordpress/components';

const { __ } = wp.i18n;
const { registerBlockType, query } = wp.blocks;

registerBlockType('origami/notebox', {
    title: __('Origami Notebox'),
    icon: 'format-aside',
    category: 'common',
    keywords: [__('notebox'), __('Notebox'), __('origami')],
    attributes: {
        content: {
            type: 'string',
            source: 'html',
            selector: 'p'
        },
        color_select: {
            type: 'string'
        }
    },
    edit: ({ attributes, setAttributes, className }) => {
        return (
            <div className={className}>
                <TextControl
                    label="Origami Notebox块"
                    value={attributes.content}
                    onChange={val => {
                        setAttributes({ content: val });
                    }}
                />
                <SelectControl
                    label="选择样式"
                    value={attributes.color_select}
                    options={[
                        { label: '请设置颜色', value: null },
                        { label: 'blue', value: 'blue' },
                        { label: 'green', value: 'green' },
                        { label: 'yellow', value: 'yellow' },
                        { label: 'red', value: 'red' }
                    ]}
                    onChange={val => {
                        setAttributes({ color_select: val });
                    }}
                />
            </div>
        );
    },
    save: ({ attributes }) => {
        const className = 'message-box ' + attributes.color_select;
        return (
            <div>
                <div className={className}>
                    <p>{attributes.content}</p>
                </div>
            </div>
        );
    }
});

registerBlockType('origami/prism', {
    title: __('Origami代码'),
    icon: 'editor-code',
    category: 'common',
    keywords: [__('code'), __('prism'), __('origami')],
    attributes: {
        content: {
            type: 'string'
        },
        lang: {
            type: 'string'
        },
        hash: {
            type: 'string'
        }
    },
    edit: ({ attributes, setAttributes, className }) => {
        if (!attributes.hash || attributes.hash === '') {
            setAttributes({
                hash: Math.random()
                    .toString(36)
                    .substring(2, 8)
            });
        }
        if (!window.origami) {
            window.origami = {};
            window.ace.config.set(
                'basePath',
                'https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/'
            );
        }
        let item = {};
        if (window.origami[attributes.hash]) {
            item = window.origami[attributes.hash];
        } else {
            window.origami[attributes.hash] = item;
            item.setting = {
                minLines: 10,
                fontSize: 17,
                theme: 'ace/theme/solarized_light',
                mode: 'ace/mode/' + attributes.lang,
                tabSize: 4,
                wrap: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                enableBasicAutocompletion: true
            };
            item.showSettingMenu = () => {
                item.ace.commands.commands.showSettingsMenu.exec(item.ace);
            };
            let timer = setInterval(() => {
                if (document.getElementById('ace-editor-' + attributes.hash)) {
                    clearInterval(timer);
                    item.ace = window.ace.edit(
                        'ace-editor-' + attributes.hash,
                        item.setting
                    );
                    if (attributes.content) {
                        item.ace.setValue(attributes.content);
                    }
                    item.ace.gotoLine(1);
                    item.ace.session.on('change', () => {
                        setAttributes({ content: item.ace.getValue() });
                    });
                }
            }, 50);
        }
        // const langEle = wp.element.createElement(wp.components.SelectControl, {
        //     label: '代码语言',
        //     value: attributes.lang,
        //     options: langList,
        //     onChange: val => {
        //         setAttributes({ lang: val });
        //         window.origami[attributes.hash].ace.session.setMode(
        //             'ace/mode/' + val
        //         );
        //     }
        // });
        const showMenuEle = wp.element.createElement(
            wp.components.Button,
            {
                isDefault: true,
                onClick: () => {
                    item.showSettingMenu();
                }
            },
            '编辑器菜单'
        );
        return (
            <div className={className}>
                <div
                    className="ace-editor"
                    id={'ace-editor-' + attributes.hash}
                />
                <SelectControl
                    label="代码语言"
                    value={attributes.lang}
                    options={langList}
                    onChange={val => {
                        setAttributes({ lang: val });
                        window.origami[attributes.hash].ace.session.setMode(
                            'ace/mode/' + val
                        );
                    }}
                />
                <Button
                    isDefault={true}
                    onClick={() => {
                        item.showSettingMenu();
                    }}
                >
                    编辑器菜单
                </Button>
            </div>
        );
    },
    save: ({ attributes }) => {
        const className1 = 'line-numbers language-' + attributes.lang;
        const className2 = 'language-' + attributes.lang;
        return (
            <div>
                <pre className={className1}>
                    <code className={className2}>{attributes.content}</code>
                </pre>
            </div>
        );
    }
});

registerBlockType('origami/image', {
    title: __('Origami图片'),
    icon: 'format-image',
    category: 'common',
    keywords: [__('image'), __('thum'), __('origami')],
    attributes: {
        isThum: {
            type: 'boolean'
        },
        isShow: {
            type: 'boolean'
        },
        url: {
            type: 'string'
        }
    },
    edit: ({ attributes, setAttributes, className }) => {
        const isThumEle = wp.element.createElement(
            wp.components.CheckboxControl,
            {
                label: __('是否设置为特色图片'),
                checked: attributes.isThum,
                onChange: val => {
                    setAttributes({ isThum: val });
                }
            }
        );
        const isShowEle = wp.element.createElement(
            wp.components.CheckboxControl,
            {
                label: __('是否设置为显示'),
                checked: attributes.isShow,
                onChange: val => {
                    setAttributes({ isShow: val });
                }
            }
        );
        const urlEle = wp.element.createElement(wp.components.TextControl, {
            label: __('图片URL'),
            value: attributes.url,
            onChange: val => {
                setAttributes({ url: val });
            }
        });
        return (
            <div className={className}>
                {isThumEle}
                {isShowEle}
                {urlEle}
            </div>
        );
    },
    save: function({ attributes, className }) {
        const styleStr = attributes.isShow ? '' : 'display:none';
        return (
            <img
                className={className}
                src={attributes.url}
                alt=""
                data-is-thum={attributes.isThum}
                style={styleStr}
            />
        );
    }
});

registerBlockType('origami/markdown', {
    title: __('Origami Markdown'),
    icon: 'format-aside',
    category: 'common',
    keywords: [__('markdown'), __('editor'), __('origami')],
    attributes: {
        content: {
            type: 'string'
        },
        htmlContent: {
            type: 'string'
        },
        hash: {
            type: 'string'
        }
    },
    edit: function(props) {
        if (!props.attributes.hash || props.attributes.hash === '') {
            props.setAttributes({
                hash: Math.random()
                    .toString(36)
                    .substring(2, 8)
            });
        }
        if (!window.origami) {
            window.origami = {};
            window.ace.config.set(
                'basePath',
                'https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/'
            );
        }
        let item = {};
        if (window.origami[props.attributes.hash]) {
            item = window.origami[props.attributes.hash];
        } else {
            window.origami[props.attributes.hash] = item;
            item.setting = {
                minLines: 10,
                fontSize: 17,
                theme: 'ace/theme/solarized_light',
                mode: 'ace/mode/markdown',
                tabSize: 4,
                wrap: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                enableBasicAutocompletion: true
            };
            item.showSettingMenu = () => {
                item.ace.commands.commands.showSettingsMenu.exec(item.ace);
            };
            let timer = setInterval(() => {
                if (
                    document.getElementById(
                        'ace-editor-' + props.attributes.hash
                    )
                ) {
                    clearInterval(timer);
                    item.ace = window.ace.edit(
                        'ace-editor-' + props.attributes.hash,
                        item.setting
                    );
                    if (props.attributes.content) {
                        item.ace.setValue(props.attributes.content);
                    }
                    item.ace.gotoLine(1);
                    item.ace.session.on('change', () => {
                        let val = item.ace.getValue();
                        props.setAttributes({
                            content: val,
                            htmlContent: toHtml(val, false)
                        });
                    });
                }
            }, 50);
        }
        const showMenuBtn = wp.element.createElement(
            wp.components.Button,
            {
                isDefault: true,
                onClick: () => {
                    item.showSettingMenu();
                }
            },
            '编辑器菜单'
        );
        let preview = false;
        const showPreviewBtn = wp.element.createElement(
            wp.components.Button,
            {
                isDefault: true,
                onClick: () => {
                    if (!preview) {
                        document.querySelector(
                            '#markdown-preview-' + props.attributes.hash
                        ).style.display = 'block';
                        document.querySelector(
                            '#ace-editor-' + props.attributes.hash
                        ).style.display = 'none';
                        window.Prism.highlightAll();
                        window.renderMathInElement(
                            document.querySelector(
                                '#markdown-preview-' + props.attributes.hash
                            ),
                            {
                                delimiters: [
                                    {
                                        left: '$$',
                                        right: '$$'
                                    },
                                    {
                                        left: '```math',
                                        right: '```'
                                    },
                                    {
                                        left: '```tex',
                                        right: '```'
                                    }
                                ],
                                ignoredTags: [
                                    'script',
                                    'noscript',
                                    'style',
                                    'textarea',
                                    'code'
                                ]
                            }
                        );
                        try {
                            window.mermaid.init(
                                { noteMargin: 10 },
                                '.xkeditor-mermaid'
                            );
                        } catch (error) {
                            console.log('May have errors');
                        }
                    } else {
                        document.querySelector(
                            '#markdown-preview-' + props.attributes.hash
                        ).style.display = 'none';
                        document.querySelector(
                            '#ace-editor-' + props.attributes.hash
                        ).style.display = 'block';
                    }
                    preview = !preview;
                }
            },
            '预览/编辑'
        );
        return (
            <div className={props.className}>
                <div
                    className="ace-editor"
                    id={'ace-editor-' + props.attributes.hash}
                />
                <div
                    className="markdown-preview"
                    id={'markdown-preview-' + props.attributes.hash}
                    dangerouslySetInnerHTML={{
                        __html: props.attributes.htmlContent
                    }}
                />
                {showMenuBtn}
                {showPreviewBtn}
            </div>
        );
    },
    save: function(props) {
        return (
            <div
                className={'markdown-body ' + props.className}
                dangerouslySetInnerHTML={{
                    __html: props.attributes.htmlContent
                }}
            />
        );
    }
});
