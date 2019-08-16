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
            onChange: function(val) {
                props.setAttributes({ content: val });
            }
        });
        const selectedEle = wp.element.createElement(
            wp.components.SelectControl,
            {
                label: "选择样式",
                value: props.attributes.color_select,
                onChange: function(val) {
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
        }
    },
    edit: function(props) {
        // const contentEle = wp.element.createElement(
        //     wp.components.TextareaControl,
        //     {
        //         label: "Origami 代码块",
        //         value: props.attributes.content,
        //         onChange: function(val) {
        //             props.setAttributes({ content: val });
        //         }
        //     }
        // );
        const langEle = wp.element.createElement(wp.components.TextControl, {
            label: "代码语言",
            value: props.attributes.lang,
            onChange: function(val) {
                props.setAttributes({ lang: val });
            }
        });
        // return (
        //     <div className={props.className}>
        //         {contentEle}
        //         {langEle}
        //     </div>
        // );
        const hash = Math.random()
            .toString(36)
            .substring(2, 8);
        if (!window.prism) {
            window.prism = [];
        }
        window.ace.config.set(
            "basePath",
            "https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/"
        );
        let item = {};
        window.prism.push(item);
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
        const timer = setInterval(() => {
            if (document.getElementById("ace-editor-" + hash)) {
                clearInterval(timer);
                item.ace = window.ace.edit("ace-editor-" + hash, item.setting);
                item.ace.setValue(props.attributes.content);
                item.ace.gotoLine(1);
            }
        }, 50);
        return (
            <div className={props.className}>
                <div className="ace-editor" id={"ace-editor-" + hash} />
                {langEle}
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
                onChange: function(val) {
                    props.setAttributes({ isThum: val });
                }
            }
        );
        const isShowEle = wp.element.createElement(
            wp.components.CheckboxControl,
            {
                label: __("是否设置为显示"),
                checked: props.attributes.isShow,
                onChange: function(val) {
                    props.setAttributes({ isShow: val });
                }
            }
        );
        const urlEle = wp.element.createElement(wp.components.TextControl, {
            label: __("图片URL"),
            value: props.attributes.url,
            onChange: function(val) {
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

registerBlockType("origami/aceeditor", {
    title: __("Origami ACE"),
    icon: "format-image",
    category: "common",
    keywords: [__("code"), __("ace"), __("origami")],
    attributes: {},
    edit: function(props) {
        window.aceEditor = {};
        window.ace.config.set(
            "basePath",
            "https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/"
        );
        window.aceEditor.setting = {
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
        window.aceEditor.showSettingMenu = () => {
            window.aceEditor.ace.commands.commands.showSettingsMenu.exec(
                window.aceEditor.ace
            );
        };
        const timer = setInterval(() => {
            if (document.getElementById("ace-editor")) {
                clearInterval(timer);
                window.aceEditor.ace = window.ace.edit(
                    "ace-editor",
                    window.aceEditor.setting
                );
            }
        }, 50);
        return <div className={props.className} id="ace-editor" />;
    },
    save: function(props) {
        return <div />;
    }
});
