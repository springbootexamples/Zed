'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var Settings = /** @class */ (function () {
    function Settings() {
        this.mode = 'popovers';
    }
    return Settings;
}());

var JumpToLink = /** @class */ (function (_super) {
    __extends(JumpToLink, _super);
    function JumpToLink() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isLinkHintActive = false;
        _this.prefixInfo = undefined;
        _this.handleJumpToLink = function () {
            if (_this.isLinkHintActive) {
                return;
            }
            var currentView = _this.app.workspace.activeLeaf.view;
            if (currentView.getState().mode === 'preview') {
                var previewViewEl = currentView.previewMode.containerEl.querySelector('div.markdown-preview-view');
                _this.managePreviewLinkHints(previewViewEl);
            }
            else if (currentView.getState().mode === 'source') {
                var cmEditor = currentView.sourceMode.cmEditor;
                _this.manageSourceLinkHints(cmEditor);
            }
        };
        _this.managePreviewLinkHints = function (previewViewEl) {
            var linkHints = _this.getPreviewLinkHints(previewViewEl);
            if (linkHints.length) {
                if (_this.settings.mode === 'modal') {
                    _this.displayModal(linkHints);
                }
                else if (_this.settings.mode === 'popovers') {
                    _this.displayPreviewPopovers(previewViewEl, linkHints);
                }
                _this.activateLinkHints(linkHints);
            }
        };
        _this.manageSourceLinkHints = function (cmEditor) {
            var linkHints = _this.getSourceLinkHints(cmEditor);
            if (linkHints.length) {
                if (_this.settings.mode === 'modal') {
                    _this.displayModal(linkHints);
                }
                else if (_this.settings.mode === 'popovers') {
                    _this.displaySourcePopovers(cmEditor, linkHints);
                }
                _this.activateLinkHints(linkHints);
            }
        };
        _this.activateLinkHints = function (linkHints) {
            var linkHintMap = {};
            linkHints.forEach(function (x) { return linkHintMap[x.letter] = x; });
            var handleHotkey = function (newLeaf, link) {
                if (link.type === 'internal') {
                    // not sure why the second argument in openLinkText is necessary.
                    _this.app.workspace.openLinkText(link.linkText, '', newLeaf, { active: true });
                }
                else if (link.type === 'external') {
                    // todo
                    require('electron').shell.openExternal(link.linkText);
                }
            };
            var removePopovers = function () {
                document.removeEventListener('click', removePopovers);
                document.querySelectorAll('.jl.popover').forEach(function (e) { return e.remove(); });
                document.querySelectorAll('#jl-modal').forEach(function (e) { return e.remove(); });
                _this.prefixInfo = undefined;
                _this.isLinkHintActive = false;
            };
            var handleKeyDown = function (event) {
                var _a;
                if (event.key === 'Shift') {
                    return;
                }
                var eventKey = event.key.toUpperCase();
                var prefixes = new Set(Object.keys(linkHintMap).filter(function (x) { return x.length > 1; }).map(function (x) { return x[0]; }));
                var linkHint;
                if (_this.prefixInfo) {
                    linkHint = linkHintMap[_this.prefixInfo.prefix + eventKey];
                }
                else {
                    linkHint = linkHintMap[eventKey];
                    if (!linkHint && prefixes && prefixes.has(eventKey)) {
                        _this.prefixInfo = { prefix: eventKey, shiftKey: event.shiftKey };
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        return;
                    }
                }
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                var newLeaf = ((_a = _this.prefixInfo) === null || _a === void 0 ? void 0 : _a.shiftKey) || event.shiftKey;
                linkHint && handleHotkey(newLeaf, linkHint);
                document.removeEventListener('keydown', handleKeyDown);
                removePopovers();
            };
            document.addEventListener('click', removePopovers);
            document.addEventListener('keydown', handleKeyDown);
            _this.isLinkHintActive = true;
        };
        _this.getPreviewLinkHints = function (previewViewEl) {
            var anchorEls = previewViewEl.querySelectorAll('a');
            var embedEls = previewViewEl.querySelectorAll('.internal-embed');
            var linkHints = [];
            anchorEls.forEach(function (anchorEl, i) {
                var linkType = anchorEl.hasClass('internal-link')
                    ? 'internal'
                    : 'external';
                var linkText = linkType === 'internal'
                    ? anchorEl.dataset['href']
                    : anchorEl.href;
                var offsetParent = anchorEl.offsetParent;
                var top = anchorEl.offsetTop;
                var left = anchorEl.offsetLeft;
                while (offsetParent) {
                    if (offsetParent == previewViewEl) {
                        offsetParent = undefined;
                    }
                    else {
                        top += offsetParent.offsetTop;
                        left += offsetParent.offsetLeft;
                        offsetParent = offsetParent.offsetParent;
                    }
                }
                linkHints.push({
                    letter: '',
                    linkText: linkText,
                    type: linkType,
                    top: top,
                    left: left,
                });
            });
            embedEls.forEach(function (embedEl, i) {
                var linkText = embedEl.getAttribute('src');
                var linkEl = embedEl.querySelector('.markdown-embed-link');
                if (linkText && linkEl) {
                    var offsetParent = linkEl.offsetParent;
                    var top_1 = linkEl.offsetTop;
                    var left = linkEl.offsetLeft;
                    while (offsetParent) {
                        if (offsetParent == previewViewEl) {
                            offsetParent = undefined;
                        }
                        else {
                            top_1 += offsetParent.offsetTop;
                            left += offsetParent.offsetLeft;
                            offsetParent = offsetParent.offsetParent;
                        }
                    }
                    linkHints.push({
                        letter: '',
                        linkText: linkText,
                        type: 'internal',
                        top: top_1,
                        left: left,
                    });
                }
            });
            var sortedLinkHints = linkHints.sort(function (a, b) {
                if (a.top > b.top) {
                    return 1;
                }
                else if (a.top === b.top) {
                    if (a.left > b.left) {
                        return 1;
                    }
                    else if (a.left === b.left) {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                }
                else {
                    return -1;
                }
            });
            var linkHintLetters = _this.getLinkHintLetters(sortedLinkHints.length);
            sortedLinkHints.forEach(function (linkHint, i) {
                linkHint.letter = linkHintLetters[i];
            });
            return sortedLinkHints;
        };
        _this.getSourceLinkHints = function (cmEditor) {
            // expecting either [[Link]] or [[Link|Title]]
            var regExInternal = /\[\[(.+?)(\|.+?)?\]\]/g;
            // expecting [Title](link)
            var regExExternal = /\[.+?\]\((.+?)\)/g;
            // expecting http://hogehoge or https://hogehoge
            var regExUrl = /(?<= |\n|^)(https?:\/\/[^ \n]+)/g;
            var strs = cmEditor.getValue();
            var linksWithIndex = [];
            var regExResult;
            while (regExResult = regExInternal.exec(strs)) {
                var linkText = regExResult[1];
                linksWithIndex.push({ index: regExResult.index, type: 'internal', linkText: linkText });
            }
            while (regExResult = regExExternal.exec(strs)) {
                var linkText = regExResult[1];
                linksWithIndex.push({ index: regExResult.index, type: 'external', linkText: linkText });
            }
            while (regExResult = regExUrl.exec(strs)) {
                var linkText = regExResult[1];
                linksWithIndex.push({ index: regExResult.index, type: 'external', linkText: linkText });
            }
            var linkHintLetters = _this.getLinkHintLetters(linksWithIndex.length);
            var linksWithLetter = [];
            linksWithIndex
                .sort(function (x, y) { return x.index - y.index; })
                .forEach(function (linkHint, i) {
                linksWithLetter.push(__assign({ letter: linkHintLetters[i] }, linkHint));
            });
            return linksWithLetter;
        };
        _this.getLinkHintLetters = function (numLinkHints) {
            var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var prefixCount = Math.ceil((numLinkHints - alphabet.length) / (alphabet.length - 1));
            // ensure 0 <= prefixCount <= alphabet.length
            prefixCount = Math.max(prefixCount, 0);
            prefixCount = Math.min(prefixCount, alphabet.length);
            var prefixes = __spreadArrays([''], Array.from(alphabet.slice(0, prefixCount)));
            var linkHintLetters = [];
            for (var i = 0; i < prefixes.length; i++) {
                var prefix = prefixes[i];
                for (var j = 0; j < alphabet.length; j++) {
                    if (linkHintLetters.length < numLinkHints) {
                        var letter = alphabet[j];
                        if (prefix === '') {
                            if (!prefixes.includes(letter)) {
                                linkHintLetters.push(letter);
                            }
                        }
                        else {
                            linkHintLetters.push(prefix + letter);
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            return linkHintLetters;
        };
        _this.displayModal = function (linkHints) {
            var modalEl = document.createElement('div');
            modalEl.innerHTML = "\n\t\t\t<div class=\"modal-container\" id=\"jl-modal\">\n\t\t\t\t<div class=\"modal-bg\"></div>\n\t\t\t\t<div class=\"modal\">\n\t\t\t\t\t<div class=\"modal-close-button\"></div>\n\t\t\t\t\t<div class=\"modal-title\">Jump to links</div>\n\t\t\t\t\t<div class=\"modal-content\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t";
            modalEl.querySelector('.modal-close-button').addEventListener('click', modalEl.remove);
            document.body.appendChild(modalEl);
            var linkEl = function (content) {
                var el = document.createElement('div');
                el.innerHTML = content;
                return el;
            };
            var modalContentEl = modalEl.querySelector('.modal-content');
            linkHints.forEach(function (linkHint) {
                return modalContentEl.appendChild(linkEl(linkHint.letter + ' ' + linkHint.linkText));
            });
        };
        _this.displayPreviewPopovers = function (markdownPreviewViewEl, linkHints) {
            for (var _i = 0, linkHints_1 = linkHints; _i < linkHints_1.length; _i++) {
                var linkHint = linkHints_1[_i];
                var linkHintEl = markdownPreviewViewEl.createEl('div');
                linkHintEl.style.top = linkHint.top + 'px';
                linkHintEl.style.left = linkHint.left + 'px';
                linkHintEl.textContent = linkHint.letter;
                linkHintEl.addClass('jl');
                linkHintEl.addClass('popover');
            }
        };
        _this.displaySourcePopovers = function (cmEditor, linkKeyMap) {
            var createWidgetElement = function (content) {
                var linkHintEl = document.createElement('div');
                linkHintEl.addClass('jl');
                linkHintEl.addClass('popover');
                linkHintEl.innerHTML = content;
                return linkHintEl;
            };
            var drawWidget = function (cmEditor, linkHint) {
                var pos = cmEditor.posFromIndex(linkHint.index);
                // the fourth parameter is undocumented. it specifies where the widget should be place
                return cmEditor.addWidget(pos, createWidgetElement(linkHint.letter), false, 'over');
            };
            linkKeyMap.forEach(function (x) { return drawWidget(cmEditor, x); });
        };
        return _this;
    }
    JumpToLink.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('loading jump to links plugin');
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = (_b.sent()) || new Settings();
                        this.addSettingTab(new SettingTab(this.app, this));
                        this.addCommand({
                            id: 'activate-jump-to-link',
                            name: 'Jump to Link',
                            callback: this.handleJumpToLink,
                            hotkeys: [{ modifiers: ['Ctrl'], key: '\'' }]
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    JumpToLink.prototype.onunload = function () {
        console.log('unloading jump to links plugin');
        console.log('Jump to links plugin is off');
    };
    return JumpToLink;
}(obsidian.Plugin));
var SettingTab = /** @class */ (function (_super) {
    __extends(SettingTab, _super);
    function SettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    SettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Jump To Link.' });
        new obsidian.Setting(containerEl)
            .setName('Presentation')
            .setDesc('How to show links')
            .addDropdown(function (cb) {
            cb
                .addOptions({
                "popovers": 'Popovers',
                "modal": 'Modal'
            })
                .setValue(_this.plugin.settings.mode)
                .onChange(function (value) {
                _this.plugin.settings.mode = value;
                _this.plugin.saveData(_this.plugin.settings);
            });
        });
    };
    return SettingTab;
}(obsidian.PluginSettingTab));

module.exports = JumpToLink;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInR5cGVzLnRzIiwibWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gZ2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByaXZhdGVNYXAuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHByaXZhdGVNYXAsIHZhbHVlKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZU1hcC5zZXQocmVjZWl2ZXIsIHZhbHVlKTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG4iLCJpbXBvcnQgeyBFZGl0b3IgfSBmcm9tICdjb2RlbWlycm9yJztcclxuXHJcbmV4cG9ydCB0eXBlIExpbmtIaW50VHlwZSA9ICdpbnRlcm5hbCcgfCAnZXh0ZXJuYWwnO1xyXG5leHBvcnQgdHlwZSBMaW5rSGludE1vZGUgPSAnbW9kYWwnIHwgJ3BvcG92ZXJzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGlua0hpbnRCYXNlIHtcclxuXHRsZXR0ZXI6IHN0cmluZztcclxuXHR0eXBlOiBMaW5rSGludFR5cGU7XHJcblx0bGlua1RleHQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQcmV2aWV3TGlua0hpbnQgZXh0ZW5kcyBMaW5rSGludEJhc2Uge1xyXG5cdGxlZnQ6IG51bWJlcjtcclxuXHR0b3A6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VMaW5rSGludCBleHRlbmRzIExpbmtIaW50QmFzZSB7XHJcblx0aW5kZXg6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0dGluZ3Mge1xyXG5cdG1vZGU6IExpbmtIaW50TW9kZSA9ICdwb3BvdmVycyc7XHJcbn0iLCJpbXBvcnQgeyBBcHAsIFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSAnY29kZW1pcnJvcic7XHJcbmltcG9ydCB7IExpbmtIaW50QmFzZSwgTGlua0hpbnRNb2RlLCBMaW5rSGludFR5cGUsIFByZXZpZXdMaW5rSGludCwgU2V0dGluZ3MsIFNvdXJjZUxpbmtIaW50IH0gZnJvbSAndHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSnVtcFRvTGluayBleHRlbmRzIFBsdWdpbiB7XHJcblx0aXNMaW5rSGludEFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHNldHRpbmdzOiBTZXR0aW5ncztcclxuXHRwcmVmaXhJbmZvOiB7IHByZWZpeDogc3RyaW5nLCBzaGlmdEtleTogYm9vbGVhbiB9IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG5cclxuXHRhc3luYyBvbmxvYWQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnbG9hZGluZyBqdW1wIHRvIGxpbmtzIHBsdWdpbicpO1xyXG5cclxuXHRcdHRoaXMuc2V0dGluZ3MgPSBhd2FpdCB0aGlzLmxvYWREYXRhKCkgfHwgbmV3IFNldHRpbmdzKCk7XHJcblxyXG5cdFx0dGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuXHRcdFx0aWQ6ICdhY3RpdmF0ZS1qdW1wLXRvLWxpbmsnLFxyXG5cdFx0XHRuYW1lOiAnSnVtcCB0byBMaW5rJyxcclxuXHRcdFx0Y2FsbGJhY2s6IHRoaXMuaGFuZGxlSnVtcFRvTGluayxcclxuXHRcdFx0aG90a2V5czogW3ttb2RpZmllcnM6IFsnQ3RybCddLCBrZXk6ICdcXCcnfV1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRvbnVubG9hZCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCd1bmxvYWRpbmcganVtcCB0byBsaW5rcyBwbHVnaW4nKTtcclxuXHRcdGNvbnNvbGUubG9nKCdKdW1wIHRvIGxpbmtzIHBsdWdpbiBpcyBvZmYnKTtcclxuXHR9XHJcblxyXG5cdGhhbmRsZUp1bXBUb0xpbmsgPSAoKSA9PiB7XHJcblx0XHRpZiAodGhpcy5pc0xpbmtIaW50QWN0aXZlKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjdXJyZW50VmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXc7XHJcblxyXG5cdFx0aWYgKGN1cnJlbnRWaWV3LmdldFN0YXRlKCkubW9kZSA9PT0gJ3ByZXZpZXcnKSB7XHJcblx0XHRcdGNvbnN0IHByZXZpZXdWaWV3RWw6IEhUTUxFbGVtZW50ID0gKGN1cnJlbnRWaWV3IGFzIGFueSkucHJldmlld01vZGUuY29udGFpbmVyRWwucXVlcnlTZWxlY3RvcignZGl2Lm1hcmtkb3duLXByZXZpZXctdmlldycpO1xyXG5cdFx0XHR0aGlzLm1hbmFnZVByZXZpZXdMaW5rSGludHMocHJldmlld1ZpZXdFbCk7XHJcblx0XHR9IGVsc2UgaWYgKGN1cnJlbnRWaWV3LmdldFN0YXRlKCkubW9kZSA9PT0gJ3NvdXJjZScpIHtcclxuXHRcdFx0Y29uc3QgY21FZGl0b3I6IEVkaXRvciA9IChjdXJyZW50VmlldyBhcyBhbnkpLnNvdXJjZU1vZGUuY21FZGl0b3I7XHJcblx0XHRcdHRoaXMubWFuYWdlU291cmNlTGlua0hpbnRzKGNtRWRpdG9yKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRtYW5hZ2VQcmV2aWV3TGlua0hpbnRzID0gKHByZXZpZXdWaWV3RWw6IEhUTUxFbGVtZW50KTogdm9pZCA9PiB7XHJcblx0XHRjb25zdCBsaW5rSGludHMgPSB0aGlzLmdldFByZXZpZXdMaW5rSGludHMocHJldmlld1ZpZXdFbCk7XHJcblx0XHRpZiAobGlua0hpbnRzLmxlbmd0aCkge1xyXG5cdFx0XHRpZiAodGhpcy5zZXR0aW5ncy5tb2RlID09PSAnbW9kYWwnKSB7XHJcblx0XHRcdFx0dGhpcy5kaXNwbGF5TW9kYWwobGlua0hpbnRzKTtcclxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLm1vZGUgPT09ICdwb3BvdmVycycpIHtcclxuXHRcdFx0XHR0aGlzLmRpc3BsYXlQcmV2aWV3UG9wb3ZlcnMocHJldmlld1ZpZXdFbCwgbGlua0hpbnRzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmFjdGl2YXRlTGlua0hpbnRzKGxpbmtIaW50cyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtYW5hZ2VTb3VyY2VMaW5rSGludHMgPSAoY21FZGl0b3I6IEVkaXRvcik6IHZvaWQgPT4ge1xyXG5cdFx0Y29uc3QgbGlua0hpbnRzID0gdGhpcy5nZXRTb3VyY2VMaW5rSGludHMoY21FZGl0b3IpO1xyXG5cdFx0aWYgKGxpbmtIaW50cy5sZW5ndGgpIHtcclxuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MubW9kZSA9PT0gJ21vZGFsJykge1xyXG5cdFx0XHRcdHRoaXMuZGlzcGxheU1vZGFsKGxpbmtIaW50cyk7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5zZXR0aW5ncy5tb2RlID09PSAncG9wb3ZlcnMnKSB7XHJcblx0XHRcdFx0dGhpcy5kaXNwbGF5U291cmNlUG9wb3ZlcnMoY21FZGl0b3IsIGxpbmtIaW50cyk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5hY3RpdmF0ZUxpbmtIaW50cyhsaW5rSGludHMpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdGFjdGl2YXRlTGlua0hpbnRzID0gKGxpbmtIaW50czogTGlua0hpbnRCYXNlW10pOiB2b2lkID0+IHtcclxuXHRcdGNvbnN0IGxpbmtIaW50TWFwOiB7IFtsZXR0ZXI6IHN0cmluZ106IExpbmtIaW50QmFzZSB9ID0ge307XHJcblx0XHRsaW5rSGludHMuZm9yRWFjaCh4ID0+IGxpbmtIaW50TWFwW3gubGV0dGVyXSA9IHgpO1xyXG5cclxuXHRcdGNvbnN0IGhhbmRsZUhvdGtleSA9IChuZXdMZWFmOiBib29sZWFuLCBsaW5rOiBMaW5rSGludEJhc2UpID0+IHtcclxuXHRcdFx0aWYgKGxpbmsudHlwZSA9PT0gJ2ludGVybmFsJykge1xyXG5cdFx0XHRcdC8vIG5vdCBzdXJlIHdoeSB0aGUgc2Vjb25kIGFyZ3VtZW50IGluIG9wZW5MaW5rVGV4dCBpcyBuZWNlc3NhcnkuXHJcblx0XHRcdFx0dGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dChsaW5rLmxpbmtUZXh0LCAnJywgbmV3TGVhZiwgeyBhY3RpdmU6IHRydWUgfSk7XHJcblx0XHRcdH0gZWxzZSBpZiAobGluay50eXBlID09PSAnZXh0ZXJuYWwnKSB7XHJcblx0XHRcdFx0Ly8gdG9kb1xyXG5cdFx0XHRcdHJlcXVpcmUoJ2VsZWN0cm9uJykuc2hlbGwub3BlbkV4dGVybmFsKGxpbmsubGlua1RleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcmVtb3ZlUG9wb3ZlcnMgPSAoKSA9PiB7XHJcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlUG9wb3ZlcnMpXHJcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qbC5wb3BvdmVyJykuZm9yRWFjaChlID0+IGUucmVtb3ZlKCkpO1xyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjamwtbW9kYWwnKS5mb3JFYWNoKGUgPT4gZS5yZW1vdmUoKSk7XHJcblx0XHRcdHRoaXMucHJlZml4SW5mbyA9IHVuZGVmaW5lZDtcclxuXHRcdFx0dGhpcy5pc0xpbmtIaW50QWN0aXZlID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaGFuZGxlS2V5RG93biA9IChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRpZiAoZXZlbnQua2V5ID09PSAnU2hpZnQnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBldmVudEtleSA9IGV2ZW50LmtleS50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0XHRjb25zdCBwcmVmaXhlcyA9IG5ldyBTZXQoT2JqZWN0LmtleXMobGlua0hpbnRNYXApLmZpbHRlcih4ID0+IHgubGVuZ3RoID4gMSkubWFwKHggPT4geFswXSkpO1xyXG5cclxuXHRcdFx0bGV0IGxpbmtIaW50OiBMaW5rSGludEJhc2U7XHJcblx0XHRcdGlmICh0aGlzLnByZWZpeEluZm8pIHtcclxuXHRcdFx0XHRsaW5rSGludCA9IGxpbmtIaW50TWFwW3RoaXMucHJlZml4SW5mby5wcmVmaXggKyBldmVudEtleV07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGlua0hpbnQgPSBsaW5rSGludE1hcFtldmVudEtleV07XHJcblx0XHRcdFx0aWYgKCFsaW5rSGludCAmJiBwcmVmaXhlcyAmJiBwcmVmaXhlcy5oYXMoZXZlbnRLZXkpKSB7XHJcblx0XHRcdFx0XHR0aGlzLnByZWZpeEluZm8gPSB7IHByZWZpeDogZXZlbnRLZXksIHNoaWZ0S2V5OiBldmVudC5zaGlmdEtleSB9O1xyXG5cclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0ZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHRjb25zdCBuZXdMZWFmID0gdGhpcy5wcmVmaXhJbmZvPy5zaGlmdEtleSB8fCBldmVudC5zaGlmdEtleTtcclxuXHJcblx0XHRcdGxpbmtIaW50ICYmIGhhbmRsZUhvdGtleShuZXdMZWFmLCBsaW5rSGludCk7XHJcblxyXG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XHJcblx0XHRcdHJlbW92ZVBvcG92ZXJzKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlUG9wb3ZlcnMpXHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XHJcblx0XHR0aGlzLmlzTGlua0hpbnRBY3RpdmUgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0Z2V0UHJldmlld0xpbmtIaW50cyA9IChwcmV2aWV3Vmlld0VsOiBIVE1MRWxlbWVudCk6IFByZXZpZXdMaW5rSGludFtdID0+IHtcclxuXHRcdGNvbnN0IGFuY2hvckVscyA9IHByZXZpZXdWaWV3RWwucXVlcnlTZWxlY3RvckFsbCgnYScpO1xyXG5cdFx0Y29uc3QgZW1iZWRFbHMgPSBwcmV2aWV3Vmlld0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnRlcm5hbC1lbWJlZCcpO1xyXG5cclxuXHRcdGNvbnN0IGxpbmtIaW50czogUHJldmlld0xpbmtIaW50W10gPSBbXTtcclxuXHRcdGFuY2hvckVscy5mb3JFYWNoKChhbmNob3JFbCwgaSkgPT4ge1xyXG5cdFx0XHRjb25zdCBsaW5rVHlwZTogTGlua0hpbnRUeXBlID0gYW5jaG9yRWwuaGFzQ2xhc3MoJ2ludGVybmFsLWxpbmsnKSBcclxuXHRcdFx0XHQ/ICdpbnRlcm5hbCdcclxuXHRcdFx0XHQ6ICdleHRlcm5hbCc7XHJcblxyXG5cdFx0XHRjb25zdCBsaW5rVGV4dCA9IGxpbmtUeXBlID09PSAnaW50ZXJuYWwnXHJcblx0XHRcdFx0PyBhbmNob3JFbC5kYXRhc2V0WydocmVmJ11cclxuXHRcdFx0XHQ6IGFuY2hvckVsLmhyZWY7XHJcblxyXG5cdFx0XHRsZXQgb2Zmc2V0UGFyZW50ID0gYW5jaG9yRWwub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50O1xyXG5cdFx0XHRsZXQgdG9wID0gYW5jaG9yRWwub2Zmc2V0VG9wO1xyXG5cdFx0XHRsZXQgbGVmdCA9IGFuY2hvckVsLm9mZnNldExlZnQ7XHJcblxyXG5cdFx0XHR3aGlsZSAob2Zmc2V0UGFyZW50KSB7XHJcblx0XHRcdFx0aWYgKG9mZnNldFBhcmVudCA9PSBwcmV2aWV3Vmlld0VsKSB7XHJcblx0XHRcdFx0XHRvZmZzZXRQYXJlbnQgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRvcCArPSBvZmZzZXRQYXJlbnQub2Zmc2V0VG9wO1xyXG5cdFx0XHRcdFx0bGVmdCArPSBvZmZzZXRQYXJlbnQub2Zmc2V0TGVmdDtcclxuXHRcdFx0XHRcdG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsaW5rSGludHMucHVzaCh7XHJcblx0XHRcdFx0bGV0dGVyOiAnJyxcclxuXHRcdFx0XHRsaW5rVGV4dDogbGlua1RleHQsXHJcblx0XHRcdFx0dHlwZTogbGlua1R5cGUsXHJcblx0XHRcdFx0dG9wOiB0b3AsXHJcblx0XHRcdFx0bGVmdDogbGVmdCxcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRlbWJlZEVscy5mb3JFYWNoKChlbWJlZEVsLCBpKSA9PiB7XHJcblx0XHRcdGNvbnN0IGxpbmtUZXh0ID0gZW1iZWRFbC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xyXG5cdFx0XHRjb25zdCBsaW5rRWwgPSBlbWJlZEVsLnF1ZXJ5U2VsZWN0b3IoJy5tYXJrZG93bi1lbWJlZC1saW5rJykgYXMgSFRNTEVsZW1lbnQ7XHJcblxyXG5cdFx0XHRpZiAobGlua1RleHQgJiYgbGlua0VsKSB7XHJcblx0XHRcdFx0bGV0IG9mZnNldFBhcmVudCA9IGxpbmtFbC5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHRcdFx0bGV0IHRvcCA9IGxpbmtFbC5vZmZzZXRUb3A7XHJcblx0XHRcdFx0bGV0IGxlZnQgPSBsaW5rRWwub2Zmc2V0TGVmdDtcclxuXHJcblx0XHRcdFx0d2hpbGUgKG9mZnNldFBhcmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKG9mZnNldFBhcmVudCA9PSBwcmV2aWV3Vmlld0VsKSB7XHJcblx0XHRcdFx0XHRcdG9mZnNldFBhcmVudCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRvcCArPSBvZmZzZXRQYXJlbnQub2Zmc2V0VG9wO1xyXG5cdFx0XHRcdFx0XHRsZWZ0ICs9IG9mZnNldFBhcmVudC5vZmZzZXRMZWZ0O1xyXG5cdFx0XHRcdFx0XHRvZmZzZXRQYXJlbnQgPSBvZmZzZXRQYXJlbnQub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGlua0hpbnRzLnB1c2goe1xyXG5cdFx0XHRcdFx0bGV0dGVyOiAnJyxcclxuXHRcdFx0XHRcdGxpbmtUZXh0OiBsaW5rVGV4dCxcclxuXHRcdFx0XHRcdHR5cGU6ICdpbnRlcm5hbCcsXHJcblx0XHRcdFx0XHR0b3A6IHRvcCxcclxuXHRcdFx0XHRcdGxlZnQ6IGxlZnQsXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGNvbnN0IHNvcnRlZExpbmtIaW50cyA9IGxpbmtIaW50cy5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdGlmIChhLnRvcCA+IGIudG9wKSB7XHJcblx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdH0gZWxzZSBpZiAoYS50b3AgPT09IGIudG9wKSB7XHJcblx0XHRcdFx0aWYgKGEubGVmdCA+IGIubGVmdCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChhLmxlZnQgPT09IGIubGVmdCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIDA7IFxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gLTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y29uc3QgbGlua0hpbnRMZXR0ZXJzID0gdGhpcy5nZXRMaW5rSGludExldHRlcnMoc29ydGVkTGlua0hpbnRzLmxlbmd0aCk7XHJcblxyXG5cdFx0c29ydGVkTGlua0hpbnRzLmZvckVhY2goKGxpbmtIaW50LCBpKSA9PiB7XHJcblx0XHRcdGxpbmtIaW50LmxldHRlciA9IGxpbmtIaW50TGV0dGVyc1tpXTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBzb3J0ZWRMaW5rSGludHM7XHJcblx0fVxyXG5cdFxyXG5cdGdldFNvdXJjZUxpbmtIaW50cyA9IChjbUVkaXRvcjogRWRpdG9yKTogU291cmNlTGlua0hpbnRbXSA9PiB7XHJcblx0XHQvLyBleHBlY3RpbmcgZWl0aGVyIFtbTGlua11dIG9yIFtbTGlua3xUaXRsZV1dXHJcblx0XHRjb25zdCByZWdFeEludGVybmFsID0gL1xcW1xcWyguKz8pKFxcfC4rPyk/XFxdXFxdL2c7XHJcblx0XHQvLyBleHBlY3RpbmcgW1RpdGxlXShsaW5rKVxyXG5cdFx0Y29uc3QgcmVnRXhFeHRlcm5hbCA9IC9cXFsuKz9cXF1cXCgoLis/KVxcKS9nO1xyXG5cdFx0Ly8gZXhwZWN0aW5nIGh0dHA6Ly9ob2dlaG9nZSBvciBodHRwczovL2hvZ2Vob2dlXHJcblx0XHRjb25zdCByZWdFeFVybCA9IC8oPzw9IHxcXG58XikoaHR0cHM/OlxcL1xcL1teIFxcbl0rKS9nO1xyXG5cclxuXHRcdGNvbnN0IHN0cnMgPSBjbUVkaXRvci5nZXRWYWx1ZSgpO1xyXG5cclxuXHRcdGxldCBsaW5rc1dpdGhJbmRleDogeyBpbmRleDogbnVtYmVyLCB0eXBlOiAnaW50ZXJuYWwnIHwgJ2V4dGVybmFsJywgbGlua1RleHQ6IHN0cmluZyB9W10gPSBbXTtcclxuXHRcdGxldCByZWdFeFJlc3VsdDtcclxuXHJcblx0XHR3aGlsZShyZWdFeFJlc3VsdCA9IHJlZ0V4SW50ZXJuYWwuZXhlYyhzdHJzKSkge1xyXG5cdFx0XHRjb25zdCBsaW5rVGV4dCA9IHJlZ0V4UmVzdWx0WzFdO1xyXG5cdFx0XHRsaW5rc1dpdGhJbmRleC5wdXNoKHsgaW5kZXg6IHJlZ0V4UmVzdWx0LmluZGV4LCB0eXBlOiAnaW50ZXJuYWwnLCBsaW5rVGV4dCB9KTtcclxuXHRcdH1cclxuXHJcblx0XHR3aGlsZShyZWdFeFJlc3VsdCA9IHJlZ0V4RXh0ZXJuYWwuZXhlYyhzdHJzKSkge1xyXG5cdFx0XHRjb25zdCBsaW5rVGV4dCA9IHJlZ0V4UmVzdWx0WzFdO1xyXG5cdFx0XHRsaW5rc1dpdGhJbmRleC5wdXNoKHsgaW5kZXg6IHJlZ0V4UmVzdWx0LmluZGV4LCB0eXBlOiAnZXh0ZXJuYWwnLCBsaW5rVGV4dCB9KVxyXG5cdFx0fVxyXG5cclxuXHRcdHdoaWxlKHJlZ0V4UmVzdWx0ID0gcmVnRXhVcmwuZXhlYyhzdHJzKSkge1xyXG5cdFx0XHRjb25zdCBsaW5rVGV4dCA9IHJlZ0V4UmVzdWx0WzFdO1xyXG5cdFx0XHRsaW5rc1dpdGhJbmRleC5wdXNoKHsgaW5kZXg6IHJlZ0V4UmVzdWx0LmluZGV4LCB0eXBlOiAnZXh0ZXJuYWwnLCBsaW5rVGV4dCB9KVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGxpbmtIaW50TGV0dGVycyA9IHRoaXMuZ2V0TGlua0hpbnRMZXR0ZXJzKGxpbmtzV2l0aEluZGV4Lmxlbmd0aCk7XHJcblxyXG5cdFx0Y29uc3QgbGlua3NXaXRoTGV0dGVyOiBTb3VyY2VMaW5rSGludFtdID0gW107XHJcblx0XHRsaW5rc1dpdGhJbmRleFxyXG5cdFx0XHQuc29ydCgoeCx5KSA9PiB4LmluZGV4IC0geS5pbmRleClcclxuXHRcdFx0LmZvckVhY2goKGxpbmtIaW50LCBpKSA9PiB7XHJcblx0XHRcdFx0bGlua3NXaXRoTGV0dGVyLnB1c2goeyBsZXR0ZXI6IGxpbmtIaW50TGV0dGVyc1tpXSwgLi4ubGlua0hpbnR9KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGxpbmtzV2l0aExldHRlcjtcclxuXHR9XHJcblxyXG5cdGdldExpbmtIaW50TGV0dGVycyA9IChudW1MaW5rSGludHM6IG51bWJlcik6IHN0cmluZ1tdID0+IHtcclxuXHRcdGNvbnN0IGFscGhhYmV0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiXHJcblxyXG5cdFx0bGV0IHByZWZpeENvdW50ID0gTWF0aC5jZWlsKChudW1MaW5rSGludHMgLSBhbHBoYWJldC5sZW5ndGgpIC8gKGFscGhhYmV0Lmxlbmd0aCAtIDEpKVxyXG5cclxuXHRcdC8vIGVuc3VyZSAwIDw9IHByZWZpeENvdW50IDw9IGFscGhhYmV0Lmxlbmd0aFxyXG5cdFx0cHJlZml4Q291bnQgPSBNYXRoLm1heChwcmVmaXhDb3VudCwgMCk7XHJcblx0XHRwcmVmaXhDb3VudCA9IE1hdGgubWluKHByZWZpeENvdW50LCBhbHBoYWJldC5sZW5ndGgpO1xyXG5cclxuXHRcdGNvbnN0IHByZWZpeGVzID0gWycnLCAuLi5BcnJheS5mcm9tKGFscGhhYmV0LnNsaWNlKDAsIHByZWZpeENvdW50KSldO1xyXG5cclxuXHRcdGNvbnN0IGxpbmtIaW50TGV0dGVycyA9IFtdXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHByZWZpeCA9IHByZWZpeGVzW2ldXHJcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgYWxwaGFiZXQubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRpZiAobGlua0hpbnRMZXR0ZXJzLmxlbmd0aCA8IG51bUxpbmtIaW50cykge1xyXG5cdFx0XHRcdFx0Y29uc3QgbGV0dGVyID0gYWxwaGFiZXRbal07XHJcblx0XHRcdFx0XHRpZiAocHJlZml4ID09PSAnJykge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXByZWZpeGVzLmluY2x1ZGVzKGxldHRlcikpIHtcclxuXHRcdFx0XHRcdFx0XHRsaW5rSGludExldHRlcnMucHVzaChsZXR0ZXIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsaW5rSGludExldHRlcnMucHVzaChwcmVmaXggKyBsZXR0ZXIpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBsaW5rSGludExldHRlcnM7XHJcblx0fVxyXG5cclxuXHRkaXNwbGF5TW9kYWwgPSAobGlua0hpbnRzOiBMaW5rSGludEJhc2VbXSk6IHZvaWQgPT4ge1xyXG5cdFx0Y29uc3QgbW9kYWxFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0bW9kYWxFbC5pbm5lckhUTUwgPSAgYFxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtY29udGFpbmVyXCIgaWQ9XCJqbC1tb2RhbFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1iZ1wiPjwvZGl2PlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbFwiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWNsb3NlLWJ1dHRvblwiPjwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+SnVtcCB0byBsaW5rczwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj48L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRgO1xyXG5cdFx0bW9kYWxFbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2xvc2UtYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtb2RhbEVsLnJlbW92ZSk7XHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsRWwpO1xyXG5cclxuXHRcdGNvbnN0IGxpbmtFbCA9IChjb250ZW50OiBzdHJpbmcpID0+IHtcclxuXHRcdFx0Y29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0ZWwuaW5uZXJIVE1MID0gY29udGVudDtcclxuXHRcdFx0cmV0dXJuIGVsO1xyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdCBtb2RhbENvbnRlbnRFbCA9IG1vZGFsRWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWNvbnRlbnQnKTtcclxuXHRcdGxpbmtIaW50cy5mb3JFYWNoKChsaW5rSGludDogTGlua0hpbnRCYXNlKSA9PlxyXG5cdFx0XHRtb2RhbENvbnRlbnRFbC5hcHBlbmRDaGlsZChsaW5rRWwobGlua0hpbnQubGV0dGVyICsgJyAnICsgbGlua0hpbnQubGlua1RleHQpKVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdGRpc3BsYXlQcmV2aWV3UG9wb3ZlcnMgPSAobWFya2Rvd25QcmV2aWV3Vmlld0VsOiBIVE1MRWxlbWVudCwgbGlua0hpbnRzOiBQcmV2aWV3TGlua0hpbnRbXSk6IHZvaWQgPT4ge1xyXG5cdFx0Zm9yICh2YXIgbGlua0hpbnQgb2YgbGlua0hpbnRzKSB7XHJcblx0XHRcdGNvbnN0IGxpbmtIaW50RWwgPSBtYXJrZG93blByZXZpZXdWaWV3RWwuY3JlYXRlRWwoJ2RpdicpO1xyXG5cdFx0XHRsaW5rSGludEVsLnN0eWxlLnRvcCA9IGxpbmtIaW50LnRvcCArICdweCc7XHJcblx0XHRcdGxpbmtIaW50RWwuc3R5bGUubGVmdCA9IGxpbmtIaW50LmxlZnQgKyAncHgnO1xyXG5cclxuXHRcdFx0bGlua0hpbnRFbC50ZXh0Q29udGVudCA9IGxpbmtIaW50LmxldHRlcjtcclxuXHRcdFx0bGlua0hpbnRFbC5hZGRDbGFzcygnamwnKTtcclxuXHRcdFx0bGlua0hpbnRFbC5hZGRDbGFzcygncG9wb3ZlcicpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZGlzcGxheVNvdXJjZVBvcG92ZXJzID0gKGNtRWRpdG9yOiBFZGl0b3IsIGxpbmtLZXlNYXA6IFNvdXJjZUxpbmtIaW50W10pOiB2b2lkID0+IHtcclxuXHRcdGNvbnN0IGNyZWF0ZVdpZGdldEVsZW1lbnQgPSAoY29udGVudDogc3RyaW5nKSA9PiB7XHJcblx0XHRcdGNvbnN0IGxpbmtIaW50RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0bGlua0hpbnRFbC5hZGRDbGFzcygnamwnKTtcclxuXHRcdFx0bGlua0hpbnRFbC5hZGRDbGFzcygncG9wb3ZlcicpO1xyXG5cdFx0XHRsaW5rSGludEVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblx0XHRcdHJldHVybiBsaW5rSGludEVsO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGRyYXdXaWRnZXQgPSAoY21FZGl0b3I6IEVkaXRvciwgbGlua0hpbnQ6IFNvdXJjZUxpbmtIaW50KSA9PiB7XHJcblx0XHRcdGNvbnN0IHBvcyA9IGNtRWRpdG9yLnBvc0Zyb21JbmRleChsaW5rSGludC5pbmRleCk7XHJcblx0XHRcdC8vIHRoZSBmb3VydGggcGFyYW1ldGVyIGlzIHVuZG9jdW1lbnRlZC4gaXQgc3BlY2lmaWVzIHdoZXJlIHRoZSB3aWRnZXQgc2hvdWxkIGJlIHBsYWNlXHJcblx0XHRcdHJldHVybiAoY21FZGl0b3IgYXMgYW55KS5hZGRXaWRnZXQocG9zLCBjcmVhdGVXaWRnZXRFbGVtZW50KGxpbmtIaW50LmxldHRlciksIGZhbHNlLCAnb3ZlcicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxpbmtLZXlNYXAuZm9yRWFjaCh4ID0+IGRyYXdXaWRnZXQoY21FZGl0b3IsIHgpKTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuXHRwbHVnaW46IEp1bXBUb0xpbmtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBKdW1wVG9MaW5rKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pXHJcblxyXG5cdFx0dGhpcy5wbHVnaW4gPSBwbHVnaW5cclxuXHR9XHJcblxyXG5cdGRpc3BsYXkoKTogdm9pZCB7XHJcblx0XHRsZXQge2NvbnRhaW5lckVsfSA9IHRoaXM7XHJcblxyXG5cdFx0Y29udGFpbmVyRWwuZW1wdHkoKTtcclxuXHJcblx0XHRjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7dGV4dDogJ1NldHRpbmdzIGZvciBKdW1wIFRvIExpbmsuJ30pO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnUHJlc2VudGF0aW9uJylcclxuXHRcdFx0LnNldERlc2MoJ0hvdyB0byBzaG93IGxpbmtzJylcclxuXHRcdFx0LmFkZERyb3Bkb3duKGNiID0+IHsgY2JcclxuXHRcdFx0XHQuYWRkT3B0aW9ucyh7XHJcblx0XHRcdFx0XHRcInBvcG92ZXJzXCI6ICdQb3BvdmVycycsXHJcblx0XHRcdFx0XHRcIm1vZGFsXCI6ICdNb2RhbCdcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb2RlKVxyXG5cdFx0XHRcdC5vbkNoYW5nZSgodmFsdWU6IExpbmtIaW50TW9kZSkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pO1xyXG5cdH1cclxufVxyXG4iXSwibmFtZXMiOlsiUGx1Z2luIiwiU2V0dGluZyIsIlBsdWdpblNldHRpbmdUYWIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQUNEO0FBQ08sSUFBSSxRQUFRLEdBQUcsV0FBVztBQUNqQyxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNyRCxRQUFRLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdELFlBQVksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixZQUFZLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pGLFNBQVM7QUFDVCxRQUFRLE9BQU8sQ0FBQyxDQUFDO0FBQ2pCLE1BQUs7QUFDTCxJQUFJLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDM0MsRUFBQztBQTRCRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENB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
