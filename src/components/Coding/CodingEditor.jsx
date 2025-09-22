import React from "react";
import Editor from "@monaco-editor/react";

const CodingEditor = ({
    code = "",
    onChange,
    onMount,
    language = "javascript",
    isDarkMode = false,
    isEditorReady = true,
    heading = "Code Editor", // Optional: allow custom heading via props
}) => {
    return (
        <div className="relative flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
            {/* Heading */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{heading}</h2>
            </div>
            <div className="flex-1 flex flex-col relative py-1">
                <Editor
                    height="100%"
                    width="100%"
                    language={language}
                    value={code}
                    onChange={onChange}
                    onMount={onMount}
                    theme={isDarkMode ? "vs-dark" : "vs-light"}
                    options={{
                        selectOnLineNumbers: true,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        fontSize: 14,
                        fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                        tabSize: 2,
                        insertSpaces: true,
                        wordWrap: "on",
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollbar: {
                            vertical: "visible",
                            horizontal: "visible",
                        },
                        contextmenu: true,
                        folding: true,
                        renderWhitespace: "selection",
                        renderControlCharacters: false,
                        quickSuggestions: true,
                        suggestOnTriggerCharacters: true,
                        acceptSuggestionOnEnter: "on",
                        tabCompletion: "on",
                        wordBasedSuggestions: true,
                        parameterHints: { enabled: true },
                        hover: { enabled: true },
                        colorDecorators: true,
                        lightbulb: { enabled: true },
                        find: { addExtraSpaceOnTop: false },
                    }}
                    loading={
                        <div
                            className={`flex items-center justify-center h-full ${
                                isDarkMode ? "bg-gray-900" : "bg-white"
                            } transition-colors`}
                        >
                            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="font-medium">Loading Monaco Editor...</span>
                            </div>
                        </div>
                    }
                />

           
            </div>
        </div>
    );
};

export default CodingEditor;
