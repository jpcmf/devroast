"use client";

import { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { indentUnit } from "@codemirror/language";
import { detectLanguage, getLanguageExtension } from "@/utils/language";

// Custom Vesper-inspired theme for CodeMirror
const vesperTheme = EditorView.theme({
	".cm-content": {
		color: "#e4e4e7",
		backgroundColor: "#18181b",
		fontFamily: "var(--font-jetbrains-mono)",
		fontSize: "14px",
		lineHeight: "1.6",
	},
	".cm-gutters": {
		backgroundColor: "#27272a",
		color: "#71717a",
		borderRight: "1px solid #3f3f46",
	},
	".cm-linenumber": {
		color: "#71717a",
	},
	".cm-linenumber.cm-activeLineNumber": {
		color: "#a1a1a8",
		backgroundColor: "#3f3f46",
	},
	".cm-cursor": {
		borderLeftColor: "#10b981",
	},
	".cm-selection": {
		backgroundColor: "#374151 !important",
	},
	"&.cm-focused .cm-selection": {
		backgroundColor: "#4b5563 !important",
	},
	".cm-activeLine": {
		backgroundColor: "rgba(63, 63, 70, 0.3)",
	},
	".cm-keyword": {
		color: "#d084c1",
	},
	".cm-atom": {
		color: "#10b981",
	},
	".cm-number": {
		color: "#f59e0b",
	},
	".cm-def": {
		color: "#60a5fa",
	},
	".cm-variable": {
		color: "#e4e4e7",
	},
	".cm-variable-2": {
		color: "#60a5fa",
	},
	".cm-variable-3": {
		color: "#10b981",
	},
	".cm-property": {
		color: "#e4e4e7",
	},
	".cm-operator": {
		color: "#f97316",
	},
	".cm-comment": {
		color: "#6b7280",
	},
	".cm-string": {
		color: "#4ade80",
	},
	".cm-meta": {
		color: "#8b5cf6",
	},
	".cm-tag": {
		color: "#f87171",
	},
	".cm-attribute": {
		color: "#fbbf24",
	},
});

// Gray theme when language detection doesn't match selection
const grayTheme = EditorView.theme({
	".cm-content": {
		color: "#6b7280",
		backgroundColor: "#18181b",
		fontFamily: "var(--font-jetbrains-mono)",
		fontSize: "14px",
		lineHeight: "1.6",
	},
	".cm-gutters": {
		backgroundColor: "#27272a",
		color: "#71717a",
		borderRight: "1px solid #3f3f46",
	},
	".cm-linenumber": {
		color: "#71717a",
	},
	".cm-linenumber.cm-activeLineNumber": {
		color: "#a1a1a8",
		backgroundColor: "#3f3f46",
	},
	".cm-cursor": {
		borderLeftColor: "#10b981",
	},
	".cm-selection": {
		backgroundColor: "#374151 !important",
	},
	"&.cm-focused .cm-selection": {
		backgroundColor: "#4b5563 !important",
	},
	".cm-activeLine": {
		backgroundColor: "rgba(63, 63, 70, 0.3)",
	},
	".cm-keyword": {
		color: "#6b7280",
	},
	".cm-atom": {
		color: "#6b7280",
	},
	".cm-number": {
		color: "#6b7280",
	},
	".cm-def": {
		color: "#6b7280",
	},
	".cm-variable": {
		color: "#6b7280",
	},
	".cm-variable-2": {
		color: "#6b7280",
	},
	".cm-variable-3": {
		color: "#6b7280",
	},
	".cm-property": {
		color: "#6b7280",
	},
	".cm-operator": {
		color: "#6b7280",
	},
	".cm-comment": {
		color: "#6b7280",
	},
	".cm-string": {
		color: "#6b7280",
	},
	".cm-meta": {
		color: "#6b7280",
	},
	".cm-tag": {
		color: "#6b7280",
	},
	".cm-attribute": {
		color: "#6b7280",
	},
});

// Language detection utility

interface CodeEditorProps {
	value: string;
	onChange: (value: string) => void;
	language?: string;
	onLanguageChange?: (language: string) => void;
}

// Helper to select the appropriate theme based on language match
const getThemeForLanguageMatch = (detected: string, selected: string) => {
	return detected === selected ? vesperTheme : grayTheme;
};

export function CodeEditor({
	value,
	onChange,
	language: initialLanguage,
	onLanguageChange,
}: CodeEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<EditorView | null>(null);
	const [detectedLanguage, setDetectedLanguage] = useState<string>(initialLanguage || "javascript");
	const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage || "javascript");
	const [copied, setCopied] = useState(false);
	const callbacksRef = useRef({ onChange, onLanguageChange, detectedLanguage });

	// Keep callbacks in sync without causing re-renders
	useEffect(() => {
		callbacksRef.current = { onChange, onLanguageChange, detectedLanguage };
	}, [onChange, onLanguageChange, detectedLanguage]);

	// Initialize editor once on component mount
	// NOTE: We intentionally use empty deps here to run only once
	// External value changes are handled by the sync effect below
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!editorRef.current) return;
		if (viewRef.current) return; // Already initialized

		const initialState = EditorState.create({
			doc: value,
			extensions: [
				basicSetup,
				lineNumbers(),
				indentUnit.of("  "), // 2 spaces for tab
				getLanguageExtension(detectedLanguage),
				getThemeForLanguageMatch(detectedLanguage, selectedLanguage),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						const newValue = update.state.doc.toString();
						callbacksRef.current.onChange(newValue);

						// Auto-detect language on paste/input
						const newLanguage = detectLanguage(newValue);
						if (newLanguage !== callbacksRef.current.detectedLanguage) {
							setDetectedLanguage(newLanguage);
							setSelectedLanguage(newLanguage);
							callbacksRef.current.onLanguageChange?.(newLanguage);
						}
					}
				}),
			],
		});

		const view = new EditorView({
			state: initialState,
			parent: editorRef.current,
		});

		viewRef.current = view;

		return () => {
			view.destroy();
			viewRef.current = null;
		};
	}, []); // Empty deps - initialize only once

	// Sync external value changes to editor (when parent updates value)
	useEffect(() => {
		if (!viewRef.current) return;

		const view = viewRef.current;
		const currentValue = view.state.doc.toString();

		// Only update if the value has actually changed and doesn't match
		if (currentValue !== value) {
			view.dispatch({
				changes: {
					from: 0,
					to: currentValue.length,
					insert: value,
				},
			});

			// Auto-detect language when external value is pasted
			const newLanguage = detectLanguage(value);
			if (newLanguage !== detectedLanguage) {
				setDetectedLanguage(newLanguage);
				setSelectedLanguage(newLanguage);
				onLanguageChange?.(newLanguage);
			}
		}
	}, [value, detectedLanguage, onLanguageChange]);

	// Update language extension when manually changed or detected language changes
	useEffect(() => {
		if (!viewRef.current) return;

		const view = viewRef.current;
		const currentDoc = view.state.doc.toString();

		const newState = EditorState.create({
			doc: currentDoc,
			extensions: [
				basicSetup,
				lineNumbers(),
				indentUnit.of("  "), // 2 spaces for tab
				getLanguageExtension(detectedLanguage),
				getThemeForLanguageMatch(detectedLanguage, selectedLanguage),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						const newValue = update.state.doc.toString();
						callbacksRef.current.onChange(newValue);

						// Auto-detect language on paste/input
						const newLanguage = detectLanguage(newValue);
						if (newLanguage !== callbacksRef.current.detectedLanguage) {
							setDetectedLanguage(newLanguage);
							setSelectedLanguage(newLanguage);
							callbacksRef.current.onLanguageChange?.(newLanguage);
						}
					}
				}),
			],
		});

		view.setState(newState);
	}, [detectedLanguage, selectedLanguage]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const languages = ["javascript", "python", "css", "html", "json", "rust", "go"];

	return (
		<div className="flex flex-col gap-3">
			{/* Header with language selector and copy button */}
			<div className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3 border border-gray-700">
				<select
					value={selectedLanguage}
					onChange={(e) => {
						const newLang = e.target.value;
						setSelectedLanguage(newLang);
						onLanguageChange?.(newLang);
					}}
					className="bg-gray-800 text-gray-200 text-sm px-3 py-2 rounded border border-gray-600 outline-none cursor-pointer hover:border-gray-500 focus:border-emerald-500"
				>
					{languages.map((lang) => (
						<option key={lang} value={lang}>
							{lang.charAt(0).toUpperCase() + lang.slice(1)}
						</option>
					))}
				</select>

				<button
					type="button"
					onClick={handleCopy}
					className="ml-auto px-4 py-2 bg-gray-800 text-gray-200 text-sm rounded hover:bg-gray-700 border border-gray-600 transition-colors"
				>
					{copied ? "Copied!" : "Copy"}
				</button>
			</div>

			{/* CodeMirror Editor */}
			<div
				ref={editorRef}
				className="rounded-lg overflow-y-auto border border-gray-700 bg-gray-900"
				style={{ height: "300px" }}
			/>
		</div>
	);
}

export type { CodeEditorProps };
