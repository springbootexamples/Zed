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
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var HotkeysPlus = /** @class */ (function (_super) {
    __extends(HotkeysPlus, _super);
    function HotkeysPlus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HotkeysPlus.prototype.onInit = function () { };
    HotkeysPlus.prototype.onload = function () {
        var _this = this;
        console.log("Loading Hotkeys++ plugin");
        this.addCommand({
            id: "better-toggle-todo",
            name: "Toggle to-do lists",
            callback: function () { return _this.toggleTodos(); },
            hotkeys: [
                {
                    modifiers: ["Mod"],
                    key: "m",
                },
            ],
        });
        this.addCommand({
            id: "toggle-bullet-number",
            name: "Toggle line to bulleted or numbered lists",
            callback: function () { return _this.toggleLists(); },
            hotkeys: [
                {
                    modifiers: ["Mod", "Shift"],
                    key: "m",
                },
            ],
        });
        this.addCommand({
            id: "toggle-block-quote",
            name: "Toggle line to block quote",
            callback: function () { return _this.toggleBlockQuote(); },
            hotkeys: [
                {
                    modifiers: ["Mod"],
                    key: "<",
                },
            ],
        });
        this.addCommand({
            id: "toggle-embed",
            name: "Toggle line to embed internal links",
            callback: function () { return _this.toggleEmbed(); },
            hotkeys: [
                {
                    modifiers: ["Mod", "Shift"],
                    key: "1",
                },
            ],
        });
        this.addCommand({
            id: "duplicate-lines",
            name: "Duplicate the current line or selected lines",
            callback: function () { return _this.duplicateLines(); },
        });
        this.addCommand({
            id: 'insert-line-above',
            name: 'Insert line above current line',
            callback: function () { return _this.insertLine("above"); },
        });
        this.addCommand({
            id: 'insert-line-below',
            name: 'Insert line below current line',
            callback: function () { return _this.insertLine("below"); },
        });
    };
    HotkeysPlus.prototype.insertLine = function (mode) {
        var view = this.app.workspace.activeLeaf.view;
        var editor = view.sourceMode.cmEditor;
        var lineNumber = editor.getCursor().line;
        var currentLineText = editor.getLine(lineNumber);
        var newLineText = "";
        if (currentLineText.trim().startsWith("- ")) {
            newLineText = currentLineText.substring(0, currentLineText.indexOf("- ") + 2);
        }
        for (var i = 1; i < 30; i++) {
            if (currentLineText.trim().startsWith(i.toString() + ". ")) {
                var correction = void 0;
                if (mode == "above")
                    correction = -1;
                else
                    correction = 1;
                newLineText = currentLineText.substring(0, currentLineText.indexOf(i.toString() + ". ")) + (i + correction).toString() + ". ";
            }
        }
        if (mode == "above") {
            editor.replaceRange(newLineText + "\n", { line: lineNumber, ch: 0 });
            editor.setCursor({ line: lineNumber, ch: newLineText.length });
        }
        else {
            editor.replaceRange("\n" + newLineText, { line: lineNumber, ch: currentLineText.length });
            editor.setCursor({ line: lineNumber + 1, ch: newLineText.length });
        }
    };
    HotkeysPlus.prototype.duplicateLines = function () {
        var activeLeaf = this.app.workspace.activeLeaf;
        var editor = activeLeaf.view.sourceMode.cmEditor;
        var selectedText = this.getSelectedText(editor);
        var newString = selectedText.content + "\n";
        editor.replaceRange(newString, selectedText.start, selectedText.start);
    };
    HotkeysPlus.prototype.onunload = function () {
        console.log("Unloading Hotkeys++ plugin");
    };
    HotkeysPlus.prototype.getSelectedText = function (editor) {
        if (editor.somethingSelected()) {
            // Toggle to-dos under the selection
            var cursorStart = editor.getCursor(true);
            var cursorEnd = editor.getCursor(false);
            var content = editor.getRange({ line: cursorStart.line, ch: 0 }, { line: cursorEnd.line, ch: editor.getLine(cursorEnd.line).length });
            return {
                start: { line: cursorStart.line, ch: 0 },
                end: {
                    line: cursorEnd.line,
                    ch: editor.getLine(cursorEnd.line).length,
                },
                content: content,
            };
        }
        else {
            // Toggle the todo in the line
            var lineNr = editor.getCursor().line;
            var contents = editor.getDoc().getLine(lineNr);
            var cursorStart = {
                line: lineNr,
                ch: 0,
            };
            var cursorEnd = {
                line: lineNr,
                ch: contents.length,
            };
            var content = editor.getRange(cursorStart, cursorEnd);
            return { start: cursorStart, end: cursorEnd, content: content };
        }
    };
    HotkeysPlus.prototype.toggleElement = function (re, subst) {
        var activeLeaf = this.app.workspace.activeLeaf;
        var editor = activeLeaf.view.sourceMode.cmEditor;
        var selection = editor.somethingSelected();
        var selectedText = this.getSelectedText(editor);
        var newString = selectedText.content.replace(re, subst);
        editor.replaceRange(newString, selectedText.start, selectedText.end);
        // Keep cursor in the same place
        if (selection) {
            editor.setSelection(selectedText.start, {
                line: selectedText.end.line,
                ch: editor.getLine(selectedText.end.line).length,
            });
        }
    };
    HotkeysPlus.prototype.toggleTodos = function () {
        var re = /-\s\[ \]\s|-\s\[x\]\s|\*\s|-\s|\d+\.\s|^/gim;
        return this.toggleElement(re, this.replaceTodoElement);
    };
    HotkeysPlus.prototype.toggleLists = function () {
        var re = /-\s\[ \]\s|-\s\[x\]\s|\*\s|-\s|\d+\.\s|^/gim;
        return this.toggleElement(re, this.replaceListElement);
    };
    HotkeysPlus.prototype.toggleBlockQuote = function () {
        var re = />\s|^/gim;
        return this.toggleElement(re, this.replaceBlockQuote);
    };
    HotkeysPlus.prototype.toggleEmbed = function () {
        var re = /\S*\[\[/gim;
        return this.toggleElement(re, this.replaceEmbed);
    };
    HotkeysPlus.prototype.replaceListElement = function (startText) {
        if (startText === "- ") {
            return "1. ";
        }
        else if (startText === "") {
            return "- ";
        }
        else if (startText === "1. ") {
            return "";
        }
        else {
            return "- ";
        }
    };
    HotkeysPlus.prototype.replaceBlockQuote = function (startText) {
        if (startText === "> ") {
            return "";
        }
        else if (startText === "") {
            return "> ";
        }
        else {
            return "> ";
        }
    };
    HotkeysPlus.prototype.replaceEmbed = function (startText) {
        if (startText === "![[") {
            return "[[";
        }
        else if (startText === "[[") {
            return "![[";
        }
        else {
            return "";
        }
    };
    HotkeysPlus.prototype.replaceTodoElement = function (startText) {
        if (startText === "- [ ] ") {
            return "- [x] ";
        }
        else if (startText === "- [x] ") {
            return "- ";
        }
        else {
            return "- [ ] ";
        }
    };
    return HotkeysPlus;
}(obsidian.Plugin));

module.exports = HotkeysPlus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICBNYXJrZG93blZpZXcsXHJcbiAgUGx1Z2luXHJcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3RrZXlzUGx1cyBleHRlbmRzIFBsdWdpbiB7XHJcbiAgb25Jbml0KCkgeyB9XHJcblxyXG4gIG9ubG9hZCgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBIb3RrZXlzKysgcGx1Z2luXCIpO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiBcImJldHRlci10b2dnbGUtdG9kb1wiLFxyXG4gICAgICBuYW1lOiBcIlRvZ2dsZSB0by1kbyBsaXN0c1wiLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy50b2dnbGVUb2RvcygpLFxyXG4gICAgICBob3RrZXlzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXHJcbiAgICAgICAgICBrZXk6IFwibVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogXCJ0b2dnbGUtYnVsbGV0LW51bWJlclwiLFxyXG4gICAgICBuYW1lOiBcIlRvZ2dsZSBsaW5lIHRvIGJ1bGxldGVkIG9yIG51bWJlcmVkIGxpc3RzXCIsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnRvZ2dsZUxpc3RzKCksXHJcbiAgICAgIGhvdGtleXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLFxyXG4gICAgICAgICAga2V5OiBcIm1cIixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6IFwidG9nZ2xlLWJsb2NrLXF1b3RlXCIsXHJcbiAgICAgIG5hbWU6IFwiVG9nZ2xlIGxpbmUgdG8gYmxvY2sgcXVvdGVcIixcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMudG9nZ2xlQmxvY2tRdW90ZSgpLFxyXG4gICAgICBob3RrZXlzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXHJcbiAgICAgICAgICBrZXk6IFwiPFwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogXCJ0b2dnbGUtZW1iZWRcIixcclxuICAgICAgbmFtZTogXCJUb2dnbGUgbGluZSB0byBlbWJlZCBpbnRlcm5hbCBsaW5rc1wiLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy50b2dnbGVFbWJlZCgpLFxyXG4gICAgICBob3RrZXlzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSxcclxuICAgICAgICAgIGtleTogXCIxXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgIGlkOiBcImR1cGxpY2F0ZS1saW5lc1wiLFxyXG4gICAgICBuYW1lOiBcIkR1cGxpY2F0ZSB0aGUgY3VycmVudCBsaW5lIG9yIHNlbGVjdGVkIGxpbmVzXCIsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLmR1cGxpY2F0ZUxpbmVzKCksXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ2luc2VydC1saW5lLWFib3ZlJyxcclxuICAgICAgbmFtZTogJ0luc2VydCBsaW5lIGFib3ZlIGN1cnJlbnQgbGluZScsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLmluc2VydExpbmUoXCJhYm92ZVwiKSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6ICdpbnNlcnQtbGluZS1iZWxvdycsXHJcbiAgICAgIG5hbWU6ICdJbnNlcnQgbGluZSBiZWxvdyBjdXJyZW50IGxpbmUnLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5pbnNlcnRMaW5lKFwiYmVsb3dcIiksXHJcbiAgICB9KTtcclxuICB9XHJcbiAgaW5zZXJ0TGluZShtb2RlOiBcImFib3ZlXCIgfCBcImJlbG93XCIpIHtcclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3IGFzIE1hcmtkb3duVmlldztcclxuICAgIGNvbnN0IGVkaXRvciA9IHZpZXcuc291cmNlTW9kZS5jbUVkaXRvciBhcyBDb2RlTWlycm9yLkVkaXRvcjtcclxuICAgIGNvbnN0IGxpbmVOdW1iZXIgPSBlZGl0b3IuZ2V0Q3Vyc29yKCkubGluZTtcclxuICAgIGNvbnN0IGN1cnJlbnRMaW5lVGV4dCA9IGVkaXRvci5nZXRMaW5lKGxpbmVOdW1iZXIpO1xyXG4gICAgbGV0IG5ld0xpbmVUZXh0ID0gXCJcIjtcclxuICAgIGlmIChjdXJyZW50TGluZVRleHQudHJpbSgpLnN0YXJ0c1dpdGgoXCItIFwiKSkge1xyXG4gICAgICBuZXdMaW5lVGV4dCA9IGN1cnJlbnRMaW5lVGV4dC5zdWJzdHJpbmcoMCwgY3VycmVudExpbmVUZXh0LmluZGV4T2YoXCItIFwiKSArIDIpO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCAzMDsgaSsrKSB7XHJcbiAgICAgIGlmIChjdXJyZW50TGluZVRleHQudHJpbSgpLnN0YXJ0c1dpdGgoaS50b1N0cmluZygpICsgXCIuIFwiKSkge1xyXG4gICAgICAgIGxldCBjb3JyZWN0aW9uOiBudW1iZXI7XHJcbiAgICAgICAgaWYgKG1vZGUgPT0gXCJhYm92ZVwiKVxyXG4gICAgICAgICAgY29ycmVjdGlvbiA9IC0xO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGNvcnJlY3Rpb24gPSAxO1xyXG4gICAgICAgIG5ld0xpbmVUZXh0ID0gY3VycmVudExpbmVUZXh0LnN1YnN0cmluZygwLCBjdXJyZW50TGluZVRleHQuaW5kZXhPZihpLnRvU3RyaW5nKCkgKyBcIi4gXCIpKSArIChpICsgY29ycmVjdGlvbikudG9TdHJpbmcoKSArIFwiLiBcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG1vZGUgPT0gXCJhYm92ZVwiKSB7XHJcbiAgICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UobmV3TGluZVRleHQgKyBcIlxcblwiLCB7IGxpbmU6IGxpbmVOdW1iZXIsIGNoOiAwIH0pO1xyXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHsgbGluZTogbGluZU51bWJlciwgY2g6IG5ld0xpbmVUZXh0Lmxlbmd0aCB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UoXCJcXG5cIiArIG5ld0xpbmVUZXh0LCB7IGxpbmU6IGxpbmVOdW1iZXIsIGNoOiBjdXJyZW50TGluZVRleHQubGVuZ3RoIH0pO1xyXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHsgbGluZTogbGluZU51bWJlciArIDEsIGNoOiBuZXdMaW5lVGV4dC5sZW5ndGggfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkdXBsaWNhdGVMaW5lcygpIHtcclxuICAgIHZhciBhY3RpdmVMZWFmOiBhbnkgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcclxuICAgIHZhciBlZGl0b3IgPSBhY3RpdmVMZWFmLnZpZXcuc291cmNlTW9kZS5jbUVkaXRvcjtcclxuICAgIHZhciBzZWxlY3RlZFRleHQgPSB0aGlzLmdldFNlbGVjdGVkVGV4dChlZGl0b3IpO1xyXG4gICAgdmFyIG5ld1N0cmluZyA9IHNlbGVjdGVkVGV4dC5jb250ZW50ICsgXCJcXG5cIjtcclxuICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UobmV3U3RyaW5nLCBzZWxlY3RlZFRleHQuc3RhcnQsIHNlbGVjdGVkVGV4dC5zdGFydCk7XHJcbiAgfVxyXG5cclxuICBvbnVubG9hZCgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiVW5sb2FkaW5nIEhvdGtleXMrKyBwbHVnaW5cIik7XHJcbiAgfVxyXG5cclxuICBnZXRTZWxlY3RlZFRleHQoZWRpdG9yOiBhbnkpIHtcclxuICAgIGlmIChlZGl0b3Iuc29tZXRoaW5nU2VsZWN0ZWQoKSkge1xyXG4gICAgICAvLyBUb2dnbGUgdG8tZG9zIHVuZGVyIHRoZSBzZWxlY3Rpb25cclxuICAgICAgbGV0IGN1cnNvclN0YXJ0ID0gZWRpdG9yLmdldEN1cnNvcih0cnVlKTtcclxuICAgICAgbGV0IGN1cnNvckVuZCA9IGVkaXRvci5nZXRDdXJzb3IoZmFsc2UpO1xyXG4gICAgICBsZXQgY29udGVudCA9IGVkaXRvci5nZXRSYW5nZShcclxuICAgICAgICB7IGxpbmU6IGN1cnNvclN0YXJ0LmxpbmUsIGNoOiAwIH0sXHJcbiAgICAgICAgeyBsaW5lOiBjdXJzb3JFbmQubGluZSwgY2g6IGVkaXRvci5nZXRMaW5lKGN1cnNvckVuZC5saW5lKS5sZW5ndGggfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdGFydDogeyBsaW5lOiBjdXJzb3JTdGFydC5saW5lLCBjaDogMCB9LFxyXG4gICAgICAgIGVuZDoge1xyXG4gICAgICAgICAgbGluZTogY3Vyc29yRW5kLmxpbmUsXHJcbiAgICAgICAgICBjaDogZWRpdG9yLmdldExpbmUoY3Vyc29yRW5kLmxpbmUpLmxlbmd0aCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnQsXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBUb2dnbGUgdGhlIHRvZG8gaW4gdGhlIGxpbmVcclxuICAgICAgdmFyIGxpbmVOciA9IGVkaXRvci5nZXRDdXJzb3IoKS5saW5lO1xyXG4gICAgICB2YXIgY29udGVudHMgPSBlZGl0b3IuZ2V0RG9jKCkuZ2V0TGluZShsaW5lTnIpO1xyXG4gICAgICBsZXQgY3Vyc29yU3RhcnQgPSB7XHJcbiAgICAgICAgbGluZTogbGluZU5yLFxyXG4gICAgICAgIGNoOiAwLFxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgY3Vyc29yRW5kID0ge1xyXG4gICAgICAgIGxpbmU6IGxpbmVOcixcclxuICAgICAgICBjaDogY29udGVudHMubGVuZ3RoLFxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgY29udGVudCA9IGVkaXRvci5nZXRSYW5nZShjdXJzb3JTdGFydCwgY3Vyc29yRW5kKTtcclxuICAgICAgcmV0dXJuIHsgc3RhcnQ6IGN1cnNvclN0YXJ0LCBlbmQ6IGN1cnNvckVuZCwgY29udGVudDogY29udGVudCB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlRWxlbWVudChyZTogUmVnRXhwLCBzdWJzdDogYW55KSB7XHJcbiAgICB2YXIgYWN0aXZlTGVhZjogYW55ID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XHJcbiAgICB2YXIgZWRpdG9yID0gYWN0aXZlTGVhZi52aWV3LnNvdXJjZU1vZGUuY21FZGl0b3I7XHJcbiAgICB2YXIgc2VsZWN0aW9uID0gZWRpdG9yLnNvbWV0aGluZ1NlbGVjdGVkKCk7XHJcbiAgICB2YXIgc2VsZWN0ZWRUZXh0ID0gdGhpcy5nZXRTZWxlY3RlZFRleHQoZWRpdG9yKTtcclxuXHJcbiAgICB2YXIgbmV3U3RyaW5nID0gc2VsZWN0ZWRUZXh0LmNvbnRlbnQucmVwbGFjZShyZSwgc3Vic3QpO1xyXG4gICAgZWRpdG9yLnJlcGxhY2VSYW5nZShuZXdTdHJpbmcsIHNlbGVjdGVkVGV4dC5zdGFydCwgc2VsZWN0ZWRUZXh0LmVuZCk7XHJcblxyXG4gICAgLy8gS2VlcCBjdXJzb3IgaW4gdGhlIHNhbWUgcGxhY2VcclxuICAgIGlmIChzZWxlY3Rpb24pIHtcclxuICAgICAgZWRpdG9yLnNldFNlbGVjdGlvbihzZWxlY3RlZFRleHQuc3RhcnQsIHtcclxuICAgICAgICBsaW5lOiBzZWxlY3RlZFRleHQuZW5kLmxpbmUsXHJcbiAgICAgICAgY2g6IGVkaXRvci5nZXRMaW5lKHNlbGVjdGVkVGV4dC5lbmQubGluZSkubGVuZ3RoLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRvZ2dsZVRvZG9zKCkge1xyXG4gICAgdmFyIHJlID0gLy1cXHNcXFsgXFxdXFxzfC1cXHNcXFt4XFxdXFxzfFxcKlxcc3wtXFxzfFxcZCtcXC5cXHN8Xi9naW07XHJcbiAgICByZXR1cm4gdGhpcy50b2dnbGVFbGVtZW50KHJlLCB0aGlzLnJlcGxhY2VUb2RvRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVMaXN0cygpIHtcclxuICAgIHZhciByZSA9IC8tXFxzXFxbIFxcXVxcc3wtXFxzXFxbeFxcXVxcc3xcXCpcXHN8LVxcc3xcXGQrXFwuXFxzfF4vZ2ltO1xyXG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlRWxlbWVudChyZSwgdGhpcy5yZXBsYWNlTGlzdEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQmxvY2tRdW90ZSgpIHtcclxuICAgIHZhciByZSA9IC8+XFxzfF4vZ2ltO1xyXG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlRWxlbWVudChyZSwgdGhpcy5yZXBsYWNlQmxvY2tRdW90ZSk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVFbWJlZCgpIHtcclxuICAgIHZhciByZSA9IC9cXFMqXFxbXFxbL2dpbTtcclxuICAgIHJldHVybiB0aGlzLnRvZ2dsZUVsZW1lbnQocmUsIHRoaXMucmVwbGFjZUVtYmVkKTtcclxuICB9XHJcblxyXG4gIHJlcGxhY2VMaXN0RWxlbWVudChzdGFydFRleHQ6IHN0cmluZykge1xyXG4gICAgaWYgKHN0YXJ0VGV4dCA9PT0gXCItIFwiKSB7XHJcbiAgICAgIHJldHVybiBcIjEuIFwiO1xyXG4gICAgfSBlbHNlIGlmIChzdGFydFRleHQgPT09IFwiXCIpIHtcclxuICAgICAgcmV0dXJuIFwiLSBcIjtcclxuICAgIH0gZWxzZSBpZiAoc3RhcnRUZXh0ID09PSBcIjEuIFwiKSB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFwiLSBcIjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlcGxhY2VCbG9ja1F1b3RlKHN0YXJ0VGV4dDogc3RyaW5nKSB7XHJcbiAgICBpZiAoc3RhcnRUZXh0ID09PSBcIj4gXCIpIHtcclxuICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXJ0VGV4dCA9PT0gXCJcIikge1xyXG4gICAgICByZXR1cm4gXCI+IFwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFwiPiBcIjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlcGxhY2VFbWJlZChzdGFydFRleHQ6IHN0cmluZykge1xyXG4gICAgaWYgKHN0YXJ0VGV4dCA9PT0gXCIhW1tcIikge1xyXG4gICAgICByZXR1cm4gXCJbW1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoc3RhcnRUZXh0ID09PSBcIltbXCIpIHtcclxuICAgICAgcmV0dXJuIFwiIVtbXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXBsYWNlVG9kb0VsZW1lbnQoc3RhcnRUZXh0OiBzdHJpbmcpIHtcclxuICAgIGlmIChzdGFydFRleHQgPT09IFwiLSBbIF0gXCIpIHtcclxuICAgICAgcmV0dXJuIFwiLSBbeF0gXCI7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXJ0VGV4dCA9PT0gXCItIFt4XSBcIikge1xyXG4gICAgICByZXR1cm4gXCItIFwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFwiLSBbIF0gXCI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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
