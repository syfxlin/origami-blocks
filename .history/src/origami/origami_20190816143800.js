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
import "./style.scss";
import "./editor.scss";
import langList from "./utils/lang-list";
// import { toHtml, toMarkdown } from "./utils/switchContent";
import marked from "marked";

const { __ } = wp.i18n;
const { registerBlockType, query } = wp.blocks;

registerBlockType("origami/notebox", {
    title: __("Origami Notebox"),
    icon: "format-aside",
    category: "common",
    keywords: [__("notebox"), __("Notebox"), __("origami")],
    attributes: {
        content: {
            type: "string",
            source: "html",
            selector: "p"
        },
        color_select: {
            type: "string"
        }
    },
    edit: function(props) {
        const contentEle = wp.element.createElement(wp.components.TextControl, {
            label: "Origami Notebox块",
            value: props.attributes.content,
            onChange: val => {
                props.setAttributes({ content: val });
            }
        });
        const selectedEle = wp.element.createElement(
            wp.components.SelectControl,
            {
                label: "选择样式",
                value: props.attributes.color_select,
                onChange: val => {
                    props.setAttributes({ color_select: val });
                },
                options: [
                    { label: "请设置颜色", value: null },
                    { label: "blue", value: "blue" },
                    { label: "green", value: "green" },
                    { label: "yellow", value: "yellow" },
                    { label: "red", value: "red" }
                ]
            }
        );
        return (
            <div className={props.className}>
                {contentEle}
                {selectedEle}
            </div>
        );
    },
    save: function(props) {
        const className = "message-box " + props.attributes.color_select;
        return (
            <div>
                <div className={className}>
                    <p>{props.attributes.content}</p>
                </div>
            </div>
        );
    }
});

registerBlockType("origami/prism", {
    title: __("Origami代码"),
    icon: "editor-code",
    category: "common",
    keywords: [__("code"), __("prism"), __("origami")],
    attributes: {
        content: {
            type: "string"
        },
        lang: {
            type: "string"
        },
        hash: {
            type: "string"
        }
    },
    edit: function(props) {
        if (!props.attributes.hash || props.attributes.hash === "") {
            props.setAttributes({
                hash: Math.random()
                    .toString(36)
                    .substring(2, 8)
            });
        }
        if (!window.origami) {
            window.origami = {};
            window.ace.config.set(
                "basePath",
                "https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/"
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
                theme: "ace/theme/solarized_light",
                mode: "ace/mode/" + props.attributes.lang,
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
                        "ace-editor-" + props.attributes.hash
                    )
                ) {
                    clearInterval(timer);
                    item.ace = window.ace.edit(
                        "ace-editor-" + props.attributes.hash,
                        item.setting
                    );
                    if (props.attributes.content) {
                        item.ace.setValue(props.attributes.content);
                    }
                    item.ace.gotoLine(1);
                    item.ace.session.on("change", () => {
                        props.setAttributes({ content: item.ace.getValue() });
                    });
                }
            }, 50);
        }
        const langEle = wp.element.createElement(wp.components.SelectControl, {
            label: "代码语言",
            value: props.attributes.lang,
            options: langList,
            onChange: val => {
                props.setAttributes({ lang: val });
                window.origami[props.attributes.hash].ace.session.setMode(
                    "ace/mode/" + val
                );
            }
        });
        const showMenuEle = wp.element.createElement(
            wp.components.Button,
            {
                isDefault: true,
                onClick: () => {
                    item.showSettingMenu();
                }
            },
            "编辑器菜单"
        );
        return (
            <div className={props.className}>
                <div
                    className="ace-editor"
                    id={"ace-editor-" + props.attributes.hash}
                />
                {langEle}
                {showMenuEle}
            </div>
        );
    },
    save: function(props) {
        const className1 = "line-numbers language-" + props.attributes.lang;
        const className2 = "language-" + props.attributes.lang;
        return (
            <div>
                <pre className={className1}>
                    <code className={className2}>
                        {props.attributes.content}
                    </code>
                </pre>
            </div>
        );
    }
});

registerBlockType("origami/image", {
    title: __("Origami图片"),
    icon: "format-image",
    category: "common",
    keywords: [__("image"), __("thum"), __("origami")],
    attributes: {
        isThum: {
            type: "boolean"
        },
        isShow: {
            type: "boolean"
        },
        url: {
            type: "string"
        }
    },
    edit: function(props) {
        const isThumEle = wp.element.createElement(
            wp.components.CheckboxControl,
            {
                label: __("是否设置为特色图片"),
                checked: props.attributes.isThum,
                onChange: val => {
                    props.setAttributes({ isThum: val });
                }
            }
        );
        const isShowEle = wp.element.createElement(
            wp.components.CheckboxControl,
            {
                label: __("是否设置为显示"),
                checked: props.attributes.isShow,
                onChange: val => {
                    props.setAttributes({ isShow: val });
                }
            }
        );
        const urlEle = wp.element.createElement(wp.components.TextControl, {
            label: __("图片URL"),
            value: props.attributes.url,
            onChange: val => {
                props.setAttributes({ url: val });
            }
        });
        return (
            <div className={props.className}>
                {isThumEle}
                {isShowEle}
                {urlEle}
            </div>
        );
    },
    save: function(props) {
        const styleStr = props.attributes.isShow ? "" : "display:none";
        return (
            <img
                src={props.attributes.url}
                alt=""
                data-is-thum={props.attributes.isThum}
                style={styleStr}
            />
        );
    }
});

registerBlockType("origami/markdown", {
    title: __("Origami Markdown"),
    icon: "format-aside",
    category: "common",
    keywords: [__("markdown"), __("editor"), __("origami")],
    attributes: {
        content: {
            type: "string"
        },
        htmlContent: {
            type: "string"
        },
        hash: {
            type: "string"
        }
    },
    edit: function(props) {
        marked.setOptions({
            langPrefix: "line-numbers language-"
        });
        if (!props.attributes.hash || props.attributes.hash === "") {
            props.setAttributes({
                hash: Math.random()
                    .toString(36)
                    .substring(2, 8)
            });
        }
        if (!window.origami) {
            window.origami = {};
            window.ace.config.set(
                "basePath",
                "https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/"
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
                theme: "ace/theme/solarized_light",
                mode: "ace/mode/markdown",
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
                        "ace-editor-" + props.attributes.hash
                    )
                ) {
                    clearInterval(timer);
                    item.ace = window.ace.edit(
                        "ace-editor-" + props.attributes.hash,
                        item.setting
                    );
                    if (props.attributes.content) {
                        item.ace.setValue(props.attributes.content);
                    }
                    item.ace.gotoLine(1);
                    item.ace.session.on("change", () => {
                        let val = item.ace.getValue();
                        props.setAttributes({
                            content: val,
                            htmlContent: marked(val)
                        });
                    });
                }
            }, 50);
        }
        const showMenuEle = wp.element.createElement(
            wp.components.Button,
            {
                isDefault: true,
                onClick: () => {
                    item.showSettingMenu();
                }
            },
            "编辑器菜单"
        );
        return (
            <div className={props.className}>
                <div
                    className="ace-editor"
                    id={"ace-editor-" + props.attributes.hash}
                />
                {showMenuEle}
            </div>
        );
    },
    save: function(props) {
        return (
            <div
                className="markdown-body"
                dangerouslySetInnerHTML={{
                    __html: props.attributes.htmlContent
                }}
            />
        );
    }
});
