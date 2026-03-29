// Shared submissions data with roast feedback
// In production, this would come from a database

export interface RoastFeedback {
	severity: "critical" | "warning" | "good";
	line: number;
	message: string;
	suggestion: string;
}

export interface Submission {
	id: string;
	rank: number;
	score: string;
	code: string;
	language: string;
	roastFeedback: RoastFeedback[];
}

export const submissions: Submission[] = [
	{
		id: "1",
		rank: 1,
		score: "1.2",
		code: 'eval(prompt("enter code"))',
		language: "javascript",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "Using eval() is the security vulnerability hall of fame",
				suggestion: "Never use eval(). Use JSON.parse() for JSON or Function constructor with strict controls",
			},
			{
				severity: "critical",
				line: 1,
				message: "prompt() in production code suggests no security model exists",
				suggestion: "Use proper input validation and sanitization libraries",
			},
			{
				severity: "warning",
				line: 1,
				message: "No error handling whatsoever",
				suggestion: "Wrap in try-catch and validate user input before execution",
			},
		],
	},
	{
		id: "2",
		rank: 2,
		score: "1.8",
		code: "if (x == true) { return true; }",
		language: "javascript",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "Using == instead of === causes type coercion bugs",
				suggestion: "Always use === for strict equality comparison",
			},
			{
				severity: "warning",
				line: 1,
				message: "Comparing to boolean literal is redundant",
				suggestion: "Just use 'if (x) { return true; }' or 'return !!x'",
			},
			{
				severity: "good",
				line: 1,
				message: "At least you're returning a boolean consistently",
				suggestion: "Small victory, but the logic is still flawed",
			},
		],
	},
	{
		id: "3",
		rank: 3,
		score: "2.1",
		code: "SELECT * FROM users WHERE 1=1",
		language: "sql",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "Classic SQL injection vulnerability pattern",
				suggestion: "Use parameterized queries/prepared statements always",
			},
			{
				severity: "warning",
				line: 1,
				message: "SELECT * fetches all columns, many of which may be unnecessary",
				suggestion: "Explicitly specify only the columns you need",
			},
			{
				severity: "warning",
				line: 1,
				message: "No LIMIT clause could fetch millions of rows",
				suggestion: "Always paginate results with LIMIT and OFFSET",
			},
		],
	},
	{
		id: "4",
		rank: 4,
		score: "2.3",
		code: "var globalVar = 'bad practice'",
		language: "javascript",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "Using var pollutes global scope and has function-scoping issues",
				suggestion: "Use const by default, let if you need reassignment",
			},
			{
				severity: "warning",
				line: 1,
				message: "Variable name suggests you already know this is bad practice",
				suggestion: "Use meaningful names that reflect the variable's purpose",
			},
		],
	},
	{
		id: "5",
		rank: 5,
		score: "2.5",
		code: "catch (e) { }",
		language: "javascript",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "Empty catch block silently swallows errors",
				suggestion: "Always log errors or handle them properly: catch(e) { console.error(e); }",
			},
			{
				severity: "critical",
				line: 1,
				message: "Errors are now invisible and undebuggable",
				suggestion: "Use error monitoring tools like Sentry if you can't fix the underlying issue",
			},
		],
	},
	{
		id: "6",
		rank: 6,
		score: "2.7",
		code: 'setTimeout(() => {...}, 0)',
		language: "javascript",
		roastFeedback: [
			{
				severity: "warning",
				line: 1,
				message: "setTimeout(..., 0) doesn't execute immediately despite appearing that way",
				suggestion: "If you need immediate execution, just call the function. Use proper async/await patterns",
			},
			{
				severity: "warning",
				line: 1,
				message: "Creates a task instead of a microtask, affecting timing",
				suggestion: "Use Promise.resolve().then() if you need microtask queue behavior",
			},
		],
	},
	{
		id: "7",
		rank: 7,
		score: "2.9",
		code: "async function() { return }",
		language: "python",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "Function syntax is invalid - missing 'def' keyword",
				suggestion: "Correct syntax: async def function_name(): return",
			},
			{
				severity: "warning",
				line: 1,
				message: "Bare 'return' in async function returns None unnecessarily",
				suggestion: "Either return a value or omit the return statement",
			},
		],
	},
	{
		id: "8",
		rank: 8,
		score: "3.1",
		code: "document.write('<div>...</div>')",
		language: "javascript",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "document.write() after page load erases entire page",
				suggestion: "Use DOM APIs: document.body.appendChild() or innerHTML",
			},
			{
				severity: "warning",
				line: 1,
				message: "No escaping of HTML - XSS vulnerability if user input involved",
				suggestion: "Use textContent for text or createElement for safe DOM manipulation",
			},
		],
	},
	{
		id: "9",
		rank: 9,
		score: "3.3",
		code: "==== badly formatted ====",
		language: "javascript",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "This is not valid JavaScript syntax",
				suggestion: "What were you even trying to do here?",
			},
		],
	},
	{
		id: "10",
		rank: 10,
		score: "3.5",
		code: "var x = 1; var x = 2;",
		language: "javascript",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "Redeclaring var creates confusion about scope",
				suggestion: "Use const/let which prevent redeclaration",
			},
			{
				severity: "warning",
				line: 1,
				message: "No indication of why x is being reassigned",
				suggestion: "Use descriptive variable names and add comments if logic isn't obvious",
			},
		],
	},
	{
		id: "11",
		rank: 11,
		score: "3.7",
		code: "function deepCopy(obj) { ... }",
		language: "javascript",
		roastFeedback: [
			{
				severity: "critical",
				line: 1,
				message: "Function name is misleading - this is a shallow copy wrapper, not a deep copy",
				suggestion: "Rename to shallowCopy() or implement proper deep cloning with structured clone",
			},
			{
				severity: "warning",
				line: 1,
				message: "Modern JavaScript has structuredClone() - why reinvent the wheel?",
				suggestion: "Use const copy = structuredClone(obj) unless you need specific behavior",
			},
		],
	},
	{
		id: "12",
		rank: 12,
		score: "3.9",
		code: "for(let i=0;i<array.length;i++)",
		language: "javascript",
		roastFeedback: [
			{
				severity: "warning",
				line: 1,
				message: "Manual index loops are outdated - array.length is checked every iteration",
				suggestion: "Use array.forEach(), for...of loop, or array methods (map, filter, reduce)",
			},
			{
				severity: "good",
				line: 1,
				message: "At least you used let instead of var",
				suggestion: "Now take the next step and use modern iteration",
			},
		],
	},
	{
		id: "13",
		rank: 13,
		score: "4.1",
		code: "const fn = () => { ... }",
		language: "javascript",
		roastFeedback: [
			{
				severity: "warning",
				line: 1,
				message: "Variable name 'fn' is too vague - doesn't describe what the function does",
				suggestion: "Use descriptive names like handleClick, calculateTotal, etc.",
			},
			{
				severity: "good",
				line: 1,
				message: "Using const and arrow functions is modern best practice",
				suggestion: "Keep this pattern, just improve your naming",
			},
		],
	},
	{
		id: "14",
		rank: 14,
		score: "4.3",
		code: "if (condition) doSomething()",
		language: "python",
		roastFeedback: [
			{
				severity: "warning",
				line: 1,
				message: "This looks like JavaScript but is marked as Python - syntax mismatch",
				suggestion: "Use proper Python syntax: if condition: do_something()",
			},
		],
	},
	{
		id: "15",
		rank: 15,
		score: "4.5",
		code: "try { ... } catch(...) { ... }",
		language: "javascript",
		roastFeedback: [
			{
				severity: "warning",
				line: 1,
				message: "Bare catch(...) without error handling provides no information",
				suggestion: "At least log the error: catch(e) { console.error(e); }",
			},
			{
				severity: "good",
				line: 1,
				message: "You're attempting error handling which is better than nothing",
				suggestion: "Now make it meaningful",
			},
		],
	},
];

export function getSubmissionById(id: string): Submission | undefined {
	return submissions.find((sub) => sub.id === id);
}

export function getLeaderboardPreview(count: number = 3): Submission[] {
	return submissions.slice(0, count);
}
