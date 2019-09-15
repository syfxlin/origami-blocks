/* eslint-disable operator-linebreak */
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
    title: __('Origami Notebox', 'origami'),
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
                    label={__('Origami Notebox块', 'origami')}
                    value={attributes.content}
                    onChange={val => {
                        setAttributes({ content: val });
                    }}
                />
                <SelectControl
                    label={__('选择样式', 'origami')}
                    value={attributes.color_select}
                    options={[
                        { label: __('请设置颜色', 'origami'), value: null },
                        { label: __('blue', 'origami'), value: 'blue' },
                        { label: __('green', 'origami'), value: 'green' },
                        { label: __('yellow', 'origami'), value: 'yellow' },
                        { label: __('red', 'origami'), value: 'red' }
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
    title: __('Origami代码', 'origami'),
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
        },
        height: {
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
        let setHeight = val => {
            if (parseInt(val) > 100) {
                val = '100';
            }
            if (parseInt(val) <= 0) {
                val = '1';
            }
            if (window.origami[attributes.hash].resizeTimer) {
                clearTimeout(window.origami[attributes.hash].resizeTimer);
            }
            window.origami[attributes.hash].resizeTimer = setTimeout(() => {
                document.getElementById(
                    'ace-editor-' + attributes.hash
                ).style.height = val + 'vh';
                window.origami[attributes.hash].ace.resize();
            }, 1000);
        };
        if (window.origami[attributes.hash]) {
            item = window.origami[attributes.hash];
            let timer1 = setInterval(() => {
                if (document.getElementById('ace-editor-' + attributes.hash)) {
                    clearInterval(timer1);
                    if (
                        document.getElementById('ace-editor-' + attributes.hash)
                            .innerHTML === ''
                    ) {
                        item.ace = window.ace.edit(
                            'ace-editor-' + attributes.hash,
                            item.setting
                        );
                        if (attributes.content) {
                            item.ace.setValue(attributes.content);
                        }
                        item.ace.gotoLine(1);
                        setHeight(attributes.height);
                        item.ace.session.on('change', () => {
                            setAttributes({ content: item.ace.getValue() });
                        });
                    }
                }
            }, 50);
        } else {
            window.origami[attributes.hash] = item;
            let listItem = langList.find(
                o => o.ace === attributes.lang || o.prism === attributes.lang
            );
            let lang = listItem ? listItem.value : 'clike';
            item.setting = {
                minLines: 10,
                fontSize: 17,
                theme: 'ace/theme/solarized_light',
                mode: 'ace/mode/' + lang,
                tabSize: 4,
                wrap: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                enableBasicAutocompletion: true
            };
            item.showSettingMenu = () => {
                item.ace.commands.commands.showSettingsMenu.exec(item.ace);
            };
            let timer1 = setInterval(() => {
                if (document.getElementById('ace-editor-' + attributes.hash)) {
                    clearInterval(timer1);
                    item.ace = window.ace.edit(
                        'ace-editor-' + attributes.hash,
                        item.setting
                    );
                    if (attributes.content) {
                        item.ace.setValue(attributes.content);
                    }
                    item.ace.gotoLine(1);
                    setHeight(attributes.height);
                    item.ace.session.on('change', () => {
                        setAttributes({ content: item.ace.getValue() });
                    });
                }
            }, 50);
            item.resizeTimer = null;
        }
        return (
            <div className={className}>
                <div
                    className="ace-editor"
                    id={'ace-editor-' + attributes.hash}
                />
                <SelectControl
                    label={__('代码语言', 'origami')}
                    value={
                        langList.find(
                            o =>
                                o.ace === attributes.lang ||
                                o.prism === attributes.lang
                        )
                            ? langList.find(
                                  o =>
                                      o.ace === attributes.lang ||
                                      o.prism === attributes.lang
                              ).value
                            : 'clike'
                    }
                    options={langList}
                    onChange={val => {
                        setAttributes({
                            lang:
                                langList[val].prism === null
                                    ? langList[val].ace
                                    : langList[val].prism
                        });
                        window.origami[attributes.hash].ace.session.setMode(
                            'ace/mode/' + langList[val].ace
                        );
                    }}
                />
                <Button
                    isDefault={true}
                    onClick={() => {
                        item.showSettingMenu();
                    }}
                >
                    {__('编辑器菜单', 'origami')}
                </Button>
                <TextControl
                    label={__('编辑器高度(延迟一秒生效[1-100])', 'origami')}
                    value={attributes.height}
                    placeholder="30"
                    onChange={val => {
                        if (parseInt(val) > 100) {
                            val = '100';
                        }
                        if (parseInt(val) <= 0) {
                            val = '1';
                        }
                        setHeight(val);
                        setAttributes({ height: val });
                    }}
                    onKeyDown={e => {
                        if (e.key === 'ArrowDown') {
                            let val = parseInt(attributes.height) - 1;
                            if (val <= 0) {
                                val = '1';
                            }
                            setAttributes({
                                height: val + ''
                            });
                            setHeight(attributes.height);
                            e.preventDefault();
                        } else if (e.key === 'ArrowUp') {
                            let val = parseInt(attributes.height) + 1;
                            if (val > 100) {
                                val = '100';
                            }
                            setAttributes({
                                height: val
                            });
                            setHeight(attributes.height);
                            e.preventDefault();
                        }
                    }}
                />
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
    title: __('Origami图片', 'origami'),
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
        return (
            <div className={className}>
                <CheckboxControl
                    label={__('是否设置为特色图片', 'origami')}
                    checked={attributes.isThum}
                    onChange={val => {
                        setAttributes({ isThum: val });
                    }}
                />
                <CheckboxControl
                    label={__('是否设置为显示', 'origami')}
                    checked={attributes.isShow}
                    onChange={val => {
                        setAttributes({ isShow: val });
                    }}
                />
                <TextControl
                    label={__('图片URL', 'origami')}
                    value={attributes.url}
                    onChange={val => {
                        setAttributes({ url: val });
                    }}
                />
            </div>
        );
    },
    save: ({ attributes, className }) => {
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
    title: __('Origami Markdown', 'origami'),
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
        },
        height: {
            type: 'string'
        }
    },
    edit: ({ attributes, className, setAttributes }) => {
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
        let setHeight = val => {
            if (parseInt(val) > 100) {
                val = '100';
            }
            if (parseInt(val) <= 0) {
                val = '1';
            }
            if (window.origami[attributes.hash].resizeTimer) {
                clearTimeout(window.origami[attributes.hash].resizeTimer);
            }
            window.origami[attributes.hash].resizeTimer = setTimeout(() => {
                document.getElementById(
                    'ace-editor-' + attributes.hash
                ).style.height = val + 'vh';
                window.origami[attributes.hash].ace.resize();
            }, 1000);
        };
        if (window.origami[attributes.hash]) {
            item = window.origami[attributes.hash];
            let timer1 = setInterval(() => {
                if (document.getElementById('ace-editor-' + attributes.hash)) {
                    clearInterval(timer1);
                    if (
                        document.getElementById('ace-editor-' + attributes.hash)
                            .innerHTML === ''
                    ) {
                        item.ace = window.ace.edit(
                            'ace-editor-' + attributes.hash,
                            item.setting
                        );
                        if (attributes.content) {
                            item.ace.setValue(attributes.content);
                        }
                        item.ace.gotoLine(1);
                        setHeight(attributes.height);
                        item.ace.session.on('change', () => {
                            setAttributes({ content: item.ace.getValue() });
                        });
                    }
                }
            }, 50);
        } else {
            window.origami[attributes.hash] = item;
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
                    setHeight(attributes.height);
                    item.ace.session.on('change', () => {
                        let val = item.ace.getValue();
                        setAttributes({
                            content: val,
                            htmlContent: toHtml(val, false)
                        });
                    });
                }
            }, 50);
            item.resizeTimer = null;
        }
        let preview = false;
        return (
            <div className={className}>
                <div
                    className="ace-editor"
                    id={'ace-editor-' + attributes.hash}
                />
                <div
                    className="markdown-preview"
                    id={'markdown-preview-' + attributes.hash}
                    dangerouslySetInnerHTML={{
                        __html: attributes.htmlContent
                    }}
                />
                <Button
                    isDefault={true}
                    onClick={() => {
                        item.showSettingMenu();
                    }}
                >
                    {__('编辑器菜单', 'origami')}
                </Button>
                <Button
                    isDefault={true}
                    onClick={() => {
                        if (!preview) {
                            document.querySelector(
                                '#markdown-preview-' + attributes.hash
                            ).style.display = 'block';
                            document.querySelector(
                                '#ace-editor-' + attributes.hash
                            ).style.display = 'none';
                            window.Prism.highlightAll();
                            window.renderMathInElement(
                                document.querySelector(
                                    '#markdown-preview-' + attributes.hash
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
                                '#markdown-preview-' + attributes.hash
                            ).style.display = 'none';
                            document.querySelector(
                                '#ace-editor-' + attributes.hash
                            ).style.display = 'block';
                        }
                        preview = !preview;
                    }}
                >
                    {__('预览/编辑', 'origami')}
                </Button>
                <TextControl
                    label={__('编辑器高度(延迟一秒生效[1-100])', 'origami')}
                    value={attributes.height}
                    placeholder="30"
                    onChange={val => {
                        if (parseInt(val) > 100) {
                            val = '100';
                        }
                        if (parseInt(val) <= 0) {
                            val = '1';
                        }
                        setHeight(val);
                        setAttributes({ height: val });
                    }}
                    onKeyDown={e => {
                        if (e.key === 'ArrowDown') {
                            let val = parseInt(attributes.height) - 1;
                            if (val <= 0) {
                                val = '1';
                            }
                            setAttributes({
                                height: val + ''
                            });
                            setHeight(attributes.height);
                            e.preventDefault();
                        } else if (e.key === 'ArrowUp') {
                            let val = parseInt(attributes.height) + 1;
                            if (val > 100) {
                                val = '100';
                            }
                            setAttributes({
                                height: val
                            });
                            setHeight(attributes.height);
                            e.preventDefault();
                        }
                    }}
                />
            </div>
        );
    },
    save: ({ className, attributes }) => {
        return (
            <div
                className={'markdown-body ' + className}
                dangerouslySetInnerHTML={{
                    __html: attributes.htmlContent
                }}
            />
        );
    }
});

registerBlockType('origami/gitcard', {
    title: __('Origami Git卡片', 'origami'),
    icon: 'networking',
    category: 'common',
    keywords: [__('git'), __('card'), __('origami')],
    attributes: {
        repo: {
            type: 'string'
        },
        platform: {
            type: 'string'
        }
    },
    edit: ({ attributes, setAttributes, className }) => {
        return (
            <div className={className}>
                <TextControl
                    label={__('Git仓库名, ex:(syfxlin/origami)', 'origami')}
                    value={attributes.repo}
                    onChange={val => {
                        setAttributes({ repo: val });
                    }}
                />
                <SelectControl
                    label={__('选择平台', 'origami')}
                    value={attributes.platform}
                    options={[
                        { label: __('请选择平台', 'origami'), value: null },
                        { label: __('GitHub', 'origami'), value: 'github' },
                        { label: __('GitLab', 'origami'), value: 'gitlab' },
                        { label: __('Gitea', 'origami'), value: 'gitea' },
                        { label: __('Coding', 'origami'), value: 'coding' },
                        { label: __('Gitee', 'origami'), value: 'gitee' }
                    ]}
                    onChange={val => {
                        setAttributes({ platform: val });
                    }}
                />
            </div>
        );
    },
    save: ({ attributes, className }) => {
        return (
            <div
                className={className + ' gitcard'}
                data-repo={attributes.repo}
                data-platform={attributes.platform}
            >
                <div className="gitcard-head"></div>
                <div className="gitcard-body loading"></div>
                <div className="gitcard-footer">
                    <div className="gitcard-star"></div>
                    <div className="gitcard-to"></div>
                </div>
            </div>
        );
    }
});