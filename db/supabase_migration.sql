--
-- PostgreSQL database dump
--


-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--



--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--



--
-- Name: badge; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.badge AS ENUM (
    'worst_naming',
    'missing_error_handling',
    'security_nightmare',
    'spaghetti_code',
    'no_documentation',
    'performance_disaster',
    'abandoned_variables',
    'magic_numbers',
    'cyclomatic_chaos',
    'regex_nightmare'
);


--
-- Name: feedback_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_type AS ENUM (
    'roast',
    'standard',
    'review'
);


--
-- Name: issue_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.issue_category AS ENUM (
    'naming',
    'performance',
    'security',
    'error_handling',
    'code_style',
    'logic',
    'complexity',
    'best_practices',
    'documentation',
    'dependency_management'
);


--
-- Name: programming_language; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.programming_language AS ENUM (
    'javascript',
    'typescript',
    'python',
    'rust',
    'golang',
    'java',
    'csharp',
    'php',
    'ruby',
    'kotlin',
    'sql',
    'html',
    'css',
    'json',
    'yaml',
    'bash',
    'other'
);


--
-- Name: severity_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.severity_level AS ENUM (
    'critical',
    'high',
    'medium',
    'low',
    'minimal'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    submission_id uuid NOT NULL,
    feedback_type public.feedback_type NOT NULL,
    content text NOT NULL,
    issues_found integer DEFAULT 0,
    recommendations_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: roasts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roasts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    submission_id uuid NOT NULL,
    rank_position integer,
    severity_rating integer NOT NULL,
    critical_issues_count integer DEFAULT 0,
    badges text[] DEFAULT '{}'::text[],
    last_ranked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    language public.programming_language NOT NULL,
    title text,
    description text,
    roast_mode boolean DEFAULT false,
    severity_score integer DEFAULT 0,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--



--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.feedback VALUES ('bd1f09e2-4350-42b1-9ae2-a97a9dbc2832', 'f4b97e0d-509c-4fe0-bed7-d302bf0698ac', 'roast', 'Oh look, it’s a "language detector." I’ve seen more sophisticated logic in a "Which Disney Princess Are You?" buzzfeed quiz. You’re iterating through `LANGUAGE_SIGNALS` and running regex tests on the entire input string for every single pattern? My CPU just sent me a suicide note. This is $O(N \cdot M)$ complexity where $N$ is the number of languages and $M$ is the number of regexes, meaning if someone feeds this a reasonably sized file, your server will have enough time to contemplate its own mortality before it finally returns a result. And the `MIN_SCORE` check? Brilliant. Nothing says "robust engineering" like a magic number threshold that probably works 40% of the time on a good day.

Then we get to the data structure gymnastics. You create a `Map`, fill it up, then immediately spread it into an array just to `reduce` it down to a single value. It’s like you’re allergic to efficiency. You could have tracked the `maxScore` and `bestLanguage` in two simple variables during the first loop and saved the garbage collector from having to clean up the mess of your unnecessary memory allocations. But no, you decided the heap needed more exercise. The final line is a chef’s kiss of unreadability—converting entries to an array just to perform a comparison that should have happened five lines ago is the programming equivalent of driving to the neighbor''s house by circumnavigating the entire globe.

And the pièce de résistance: `if (scores.size === 0) return "javascript";`. Of course. Because if the code is so utterly incomprehensible that your galaxy-brain regexes can''t identify it, it must be JavaScript. It’s the ultimate "I give up" fallback. Your code literally assumes that the bottom of the barrel is reserved for JS developers. It’s lazy, it’s biased, and it’s probably the most accurate line in this entire dumpster fire of a function.

SEVERITY: 7/10', 3, 3, '2026-04-07 15:49:51.016447+00', '2026-04-07 15:49:51.016447+00');
INSERT INTO public.feedback VALUES ('10872095-0435-4d6f-b26f-9e3cb6e784ff', 'd89e3a3f-507e-4b58-9e17-6735df2a0719', 'roast', 'Oh look, another "utility" function that’s exactly one line long and still manages to be a masterclass in architectural laziness. I see you’ve opted for the "Magic Number" approach to constants. `60000`? Really? I love having to pause and do mental math just to verify you know how many milliseconds are in a minute. It''s not like `const MS_PER_MINUTE = 60 * 1000` would have cost you any extra RAM, but I guess typing out descriptive variable names is a luxury your keyboard just can''t afford. 

And let’s talk about your "input validation," or the complete and utter lack thereof. Your `resetTime` parameter is a `number`, which is the TypeScript equivalent of "trust me, bro." Is it seconds? Milliseconds? The Unix epoch in dog years? Who knows! If `resetTime` happened five minutes ago, this function happily returns `-5`. I can’t wait to see the UI tell users their cooldown will reset in "negative five minutes." It’s bold of you to assume time only moves forward, or that the person calling this function won''t pass in `NaN`, `Infinity`, or the current population of Mars.

Finally, thanks for the hard-coded dependency on `Date.now()`. I’m sure the developers tasked with writing unit tests for this will absolutely love having to mock the global system clock just to verify your one line of mediocre math. It’s a pure function''s worst nightmare. This isn''t code; it''s a ticking time bomb of "edge cases" wrapped in a blanket of "it worked on my machine."

SEVERITY: 6/10', 0, 1, '2026-04-07 16:23:12.801065+00', '2026-04-07 16:23:12.801065+00');
INSERT INTO public.feedback VALUES ('e41a6fa2-eda9-4899-b3ba-6a242b4f7d82', 'a1e2f2a3-1f61-4093-84a6-f9d64941c211', 'standard', 'This CSS snippet contains several anti-patterns that impact maintainability and responsiveness. Using a fixed `height: 59px` on a heading is problematic for accessibility and responsive design; if the text wraps to a second line or if a user increases their browser''s font size, the content will likely overflow or be clipped. Similarly, the negative `margin-left` appears to be a "magic number" fix for a specific alignment issue, which is fragile and likely to break across different screen sizes or font-rendering engines.

The `z-index: 99999` is excessively high, indicating a lack of structured stacking context management and potentially triggering "z-index wars" with other components. Furthermore, `z-index` is ignored on elements with the default `position: static`; unless this `h1` is a flex/grid child or has an explicit `position` property, this rule is ineffective. Finally, applying these specific layout styles directly to the global `h1` tag is risky, as it will force these rigid constraints on every primary heading across the entire application. I recommend using a descriptive class name and replacing fixed units with relative ones (like `rem` or `min-height`).', 0, 1, '2026-04-07 02:29:15.919171+00', '2026-04-07 02:29:15.919171+00');
INSERT INTO public.feedback VALUES ('ebe16aed-12f4-4fdc-b3c2-96937d226440', '892b4273-2b96-4ce9-ab55-843d412b56a8', 'roast', 'Oh look, it’s the Great Wall of Specificity. Did you think you were writing a CSS selector or a genealogical map tracing this link''s ancestry back to the Big Bang? Writing `body div#container ul.navigation li.item a.link` just to turn a piece of text red is like hiring a private investigator, a SWAT team, and the ghost of Sherlock Holmes just to find a TV remote that was sitting on your lap the whole time. You’ve created a selector so bloated it probably has its own gravitational pull, ensuring that if anyone ever dares to change that `div` to a `main` tag, your entire UI will crumble faster than your dignity.

Let’s talk about performance, or the absolute lack thereof. Browsers read selectors from right to left, meaning you’re forcing the engine to crawl through every single `<a>` tag on the page, verify its class, then check its parent, then its grandparent, and keep climbing all the way up to the `body` tag—as if the link might accidentally be living in a different dimension instead of a standard HTML document. You used an ID (`#container`)—which already has enough specificity to override almost anything—and then decided to surround it with five other qualifiers. Who hurt you? Did a global style once overwrite your precious link, leaving you with such deep-seated trust issues that you felt the need to lock this color down with the digital equivalent of ten deadbolts and a moat?

And all this architectural overkill for... `color: red;`. Not a hex code, not a variable, not even a sophisticated HSL value—just the default, eye-searing, "I-just-started-learning-web-dev-ten-minutes-ago" red. This code is the CSS equivalent of building a high-security vault out of reinforced titanium just to store a half-eaten ham sandwich. It’s brittle, it’s inefficient, and it’s a maintenance nightmare that screams, "I don''t understand how the cascade works."

SEVERITY: 9/10', 3, 2, '2026-04-07 02:35:42.263845+00', '2026-04-07 02:35:42.263845+00');
INSERT INTO public.feedback VALUES ('f8abe144-b682-4e0c-aace-707d9edd03e3', '987ddde7-fb79-4d27-8add-4502563d66a6', 'standard', 'The provided snippet is not functional HTML code, but rather a specific runtime error message from the Next.js framework. This error indicates a fundamental architectural violation in a React application: a component marked with the `''use client''` directive has been defined as an `async` function. In the current React Server Components (RSC) implementation, Client Components must be synchronous functions; only Server Components are permitted to be `async`.

To resolve this, you must identify the component causing the error and choose one of two paths: if the component requires interactivity or browser APIs (hooks), remove the `async` keyword and manage data fetching using hooks like `useEffect` or libraries like SWR/React Query. Alternatively, if the component was intended to fetch data on the server, remove the `''use client''` directive. Failing to address this will prevent the application from rendering and block the build process.', 3, 2, '2026-04-07 02:37:18.546939+00', '2026-04-07 02:37:18.546939+00');
INSERT INTO public.feedback VALUES ('34916697-fc2d-4c19-b7b3-4575e83d390e', 'fced1f7f-dd29-4705-be2d-d4204a2bce2f', 'roast', 'Oh look, another "elegant" one-liner from the school of *I-Just-Learned-Recursion-And-Now-I-Want-To-Watch-The-World-Burn*. You really thought you were being clever, didn''t you? This isn''t a function; it''s a digital suicide note for your CPU. By using an $O(2^n)$ complexity, you’ve managed to write a program that takes longer to calculate `fibonacci(50)` than it took for humans to evolve from single-celled organisms. You’re literally forcing the computer to re-calculate the same values billions of times because you’re apparently too "minimalist" to implement memoization or, God forbid, an actual loop that doesn''t treat RAM like an open buffet.

And let’s talk about your "safety" features—mostly because they don''t exist. If some poor soul accidentally passes `-1` into this architectural war crime, the call stack will explode faster than your career prospects. There’s no input validation, no sanity checks, and no respect for the user''s time. You’ve essentially built a space heater that occasionally outputs a number before crashing the browser. This code is the programming equivalent of trying to build a skyscraper out of wet napkins—it looks vaguely like the right shape for about three seconds before collapsing into a pathetic, soggy heap of `Maximum call stack size exceeded`.

SEVERITY: 9/10 (The only reason it''s not a 10 is because it technically "works" for n < 10, assuming you have the patience of a Zen monk and the hardware of a supercomputer.)', 3, 3, '2026-04-07 02:39:08.495643+00', '2026-04-07 02:39:08.495643+00');
INSERT INTO public.feedback VALUES ('62d3bcac-0a49-4c09-a6f4-2b7b6b4fce4c', '9c6f3608-bb15-44e5-b3ed-5e1773bb0202', 'standard', 'The code is syntactically correct and utilizes modern ES6+ standards by using `const` for immutable values, which is a best practice that prevents accidental reassignment and ensures block-scoping. The logic is simple, bug-free, and performs efficiently for its intended purpose.

However, the primary issue is the use of non-descriptive variable names (`x`, `y`, `z`). In a production environment, you should use semantic naming (e.g., `basePrice`, `taxAmount`, `totalCost`) to improve maintainability and help other developers understand the context of the calculations. Additionally, while `console.log` is useful for local debugging, ensure that such statements are removed or replaced with a dedicated logging utility before deploying to production to avoid polluting the console and leaking internal data.', 1, 3, '2026-04-07 02:41:00.207757+00', '2026-04-07 02:41:00.207757+00');
INSERT INTO public.feedback VALUES ('dc156325-a90f-4457-9a23-d5077e6c1b9a', '35aa609f-1741-4748-9a3f-8f7afb665e00', 'roast', 'Oh look, we’ve managed to exhume a script from a 2005 GeoCities tutorial. Using `var` in the year of our lord 2024 is a bold lifestyle choice; I assume you also still use a dial-up modem and think MySpace is the "next big thing." By polluting the global namespace with this garbage, you’ve ensured that if any other script on the page dares to use the letter ''a'', the whole thing will collapse like a house of cards—which, honestly, would be a mercy killing for this codebase.

And let’s talk about these variable names. `a`, `b`, `c`, and `d`? Truly visionary. It’s like you’re trying to write code that even an Enigma machine would find needlessly cryptic. Are these representing apples? The number of regrets your parents have? The count of brain cells you lost while typing this? We’ll never know, because you’ve opted for the "I want to be unhireable" naming convention. Then there’s the formatting—cramming it all onto one line with semicolons makes it look less like "efficient code" and more like a ransom note written by someone who forgot how the ''Enter'' key works.

Finally, we arrive at the grand finale: `alert(d)`. Nothing screams "professional software engineer" like hijacking the user’s entire browser UI to display the number 6. It is the digital equivalent of walking into a library and screaming the result of a first-grade math problem at the top of your lungs. This isn''t programming; it''s a cry for help. If you ever feel the urge to write JavaScript again, please, just go outside and stare at the sun instead—it’ll be less painful for everyone involved.

SEVERITY: 8/10 (It''s five lines of code and somehow contains every bad habit known to man.)', 2, 4, '2026-04-07 02:42:01.074468+00', '2026-04-07 02:42:01.074468+00');
INSERT INTO public.feedback VALUES ('55a8f83a-a6d7-4653-a120-7c40e358bd40', '5824e1b7-bbbd-41a0-9629-4432a7957ebd', 'roast', 'Oh, I see. You woke up today and decided that the last forty years of progress in language design and structured programming were simply "suggestions" you could ignore. This isn’t code; it’s a hostage situation. Using `$$` as a variable name tells me everything I need to know about your mental state—specifically, that you’ve spent way too much time huffing the fumes of 2008-era jQuery while simultaneously trying to summon a demon. And then we have `___location___`. Why the triple underscores? Are you trying to make it look like a secret government project, or are you just allergic to self-documenting code? Also, wrapping your state in a single-element array just so your DIY `goto` function can mutate it is the kind of "big brain" over-engineering that makes senior developers contemplate a career in sheep farming.

But let’s talk about the real war crime here: this "State Machine from Hell." You’ve managed to reinvent the most hated control flow mechanism in the history of computing—the `GOTO` statement—and you did it using a `while(true)` loop and a `switch` statement. It’s like you saw a clean, modern language and thought, "You know what this needs? To feel more like assembly code written by a sleep-deprived toddler on a Commodore 64." The `continue` keywords are just the icing on this garbage cake, ensuring that anyone trying to trace the execution logic will suffer an immediate migraine. This code doesn''t "do stuff"; it creates technical debt at a rate that would make the US Treasury blush. 

If I saw this in a Pull Request, I wouldn''t just reject it; I’d call an exorcist. You’ve bypassed functions, loops, and basic logic to create a recursive loop of sadness. The fact that the `switch` even has a `default` case that just breaks is the ultimate white flag of surrender—you don''t even trust your own manual state management to work. Delete this, apologize to your keyboard, and go read a book on how to write code that doesn''t look like a cry for help.

SEVERITY: 9/10 (The only reason it''s not a 10 is because it technically executes, though it really shouldn''t.)', 3, 1, '2026-04-07 02:44:07.181922+00', '2026-04-07 02:44:07.181922+00');
INSERT INTO public.feedback VALUES ('f74591aa-8764-4c06-92f9-33b9366218e9', '7715459a-d1a9-4110-8357-1594db9c978b', 'roast', 'Oh look, we’ve found it: the "I don''t trust the language I''m using" pattern. This code is the digital equivalent of buying a pre-made sandwich, taking it apart ingredient by ingredient, and then reassembling it on a different plate just to feel "involved" in the process. `value.split(",")` literally returns an array. That’s its job. That is its only purpose in life. But no, you decided that wasn''t good enough. You felt the need to manually iterate through that array and push each element into *another* array, as if the first one was somehow contaminated by the ghosts of Netscape Navigator.

And can we talk about these variable names? `a`, `i`, `ret`, `len`—it’s like you’re being billed by the character and you''re currently living on a diet of ramen and desperation. Using `var` in the year of our lord 2024 tells me everything I need to know about your commitment to modern standards; I assume you also still use a rotary phone and think MySpace is the next big thing. You even cached the length of the array in `len`, which is a "performance optimization" from an era when browsers were powered by steam engines, yet you completely ignored the fact that your entire function is a massive, redundant performance sink.

If this function were any more useless, it would be running for political office. It takes a perfectly functional built-in method and wraps it in a layer of boilerplate so thick I’m surprised it didn''t trigger a memory leak just out of pure spite. Next time, just `return value.split(",")` and spend the time you saved reflecting on why you felt the need to torture those CPU cycles. Or better yet, add a single check to see if `value` is actually a string before you inevitably call this on `null` and blow up the entire stack.

SEVERITY: 8/10', 3, 1, '2026-04-07 02:48:47.556885+00', '2026-04-07 02:48:47.556885+00');
INSERT INTO public.feedback VALUES ('6457b44f-5269-4a21-8f6d-a39cc9e4929c', '93bd1299-3d0b-4305-9fd7-c00f8fa6c588', 'roast', 'Oh look, another masterpiece named `test()`. I’m sure your colleagues absolutely love playing "Guess what this function does" while they search through a codebase filled with 5,000 other identically named pieces of trash. And `var`? Did you write this on a dusty typewriter in 2005? Welcome to the era of `let` and `const`, though given the stagnant nature of your logic, I suppose it makes sense that you’d prefer a declaration style that’s as outdated as your programming instincts.

Let''s talk about that `if (x == 1)` statement. You assigned the value on the line immediately preceding it. Are you worried that cosmic rays might flip a bit in the nanosecond it takes for the CPU to reach the next line? Or is your short-term memory so shot that you''ve already forgotten what you did half a second ago? It’s a bold choice to use loose equality (`==`) too—just in case `x` decides to identify as the string "1" out of sheer boredom. This isn''t a logic flow; it’s a logic puddle.

The grand finale is a `console.log` that prints "test". Revolutionary. You’ve successfully managed to consume electricity, processor cycles, and the precious seconds of my life I spent reading this, all to achieve the same result as a static string. If this is the "test," I’m terrified to see what the "production" code looks like—I assume it''s just a 400-line function named `doStuff()` that calculates 1+1 five million times. Delete this, then delete your text editor.

SEVERITY: 8/10 (For being fundamentally useless and aggressively redundant)', 3, 1, '2026-04-07 03:06:39.995847+00', '2026-04-07 03:06:39.995847+00');
INSERT INTO public.feedback VALUES ('a211d347-8c7e-4826-a79a-245b2bad8dd4', '69d6a755-4b52-4c59-897e-4aa0ebd29c6b', 'roast', 'Oh, look at you naming the function `bad`. How refreshingly self-aware. It’s rare to see a developer accurately label their work as a dumpster fire before I even have to point it out. This function is the programming equivalent of a "This Space Intentionally Left Blank" sign—it exists purely to consume oxygen and remind us all that life is finite. Why did you bother declaring a variable? Was your keyboard feeling lonely? Did you think that assigning `1` to `x` before immediately returning it would somehow make the CPU feel important? 

And `var`? Seriously? What’s it like living in 2005? I bet you’re reading this on a browser that still supports Flash while listening to Nickelback. Using `var` in modern JavaScript is a cry for help, or at the very least, an admission that you haven''t read a single line of documentation since the Bush administration. This entire function could be replaced by the number `1`, yet you chose to wrap it in a layer of pointless complexity and outdated syntax. It’s not even "code"; it’s a digital paperweight.

SEVERITY: 9/10 (The simplicity of the failure is what makes it so majestic.)', 3, 5, '2026-04-07 03:07:25.627302+00', '2026-04-07 03:07:25.627302+00');
INSERT INTO public.feedback VALUES ('4c38450e-e5eb-470f-82eb-1f48b8a5f770', 'ef5bb31b-3771-4c03-9aa5-dcc145eb3b4c', 'standard', 'This code is functional but contains significant redundancies and outdated practices. The `for` loop and manual array building are unnecessary because `String.prototype.split()` already returns an array; copying it manually into `ret` adds overhead without any benefit. Additionally, using `var` is discouraged in modern JavaScript; `const` or `let` should be used instead to ensure proper scoping and prevent accidental redeclarations.

From a reliability standpoint, the function lacks input validation. If `value` is `null`, `undefined`, or a type other than a string, the code will throw a runtime error. To improve maintainability and performance, you should refactor this to a single line using defensive programming. A modern implementation would be: `return typeof value === ''string'' ? value.split('','') : [];`. This handles edge cases gracefully and improves readability by removing non-descriptive variable names like `a` and `ret`.', 0, 4, '2026-04-07 03:08:16.853813+00', '2026-04-07 03:08:16.853813+00');
INSERT INTO public.feedback VALUES ('73de2f09-b371-4e91-b016-581060497c76', '40ed5bf1-2f49-416f-9d0c-1bfc15cef649', 'roast', 'Oh look, another masterpiece of redundant engineering. This function is the software equivalent of hiring a professional moving company to carry your groceries from the front door to the kitchen table, one grape at a time. Do you realize that `String.prototype.split()` already returns an array? No, of course you don''t. You decided that your CPU was feeling far too relaxed and needed some manual labor to justify its existence. You are literally taking an array, creating a *second* empty array, and then painstakingly pushing every element across the border like you’re running a digital refugee camp for data that was already home.

And can we talk about these variable names? `a`, `ret`, `len`, `i`. I haven''t seen this much creative effort since the last time I stared at a blank wall. Using `var` in modern JavaScript is a bold choice—bold in the sense that you clearly haven’t updated your knowledge base since the Netscape Navigator era. If `value` happens to be `null`, `undefined`, or anything other than a string, this entire house of cards collapses faster than a crypto exchange, but I suppose basic error handling is for people who actually want their code to work in production. Just `return value.split(",")` and delete the rest of this visual pollution. My eyes are bleeding.

SEVERITY: 8/10', 1, 1, '2026-04-07 03:08:57.196712+00', '2026-04-07 03:08:57.196712+00');


--
-- Data for Name: roasts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.roasts VALUES ('1912341a-2e78-4e21-97d3-dd793a791d0c', 'f4b97e0d-509c-4fe0-bed7-d302bf0698ac', 1, 70, 3, '{}', '2026-04-07 15:49:51.054+00', '2026-04-07 15:49:51.058364+00', '2026-04-07 15:49:51.058364+00');
INSERT INTO public.roasts VALUES ('196d5b6a-ecec-4a49-b91e-13a583a43afd', 'd89e3a3f-507e-4b58-9e17-6735df2a0719', 1, 60, 0, '{}', '2026-04-07 16:23:12.836+00', '2026-04-07 16:23:12.838871+00', '2026-04-07 16:23:12.838871+00');
INSERT INTO public.roasts VALUES ('a1c9bbb0-dafd-4c13-b56a-3294b76f5493', '892b4273-2b96-4ce9-ab55-843d412b56a8', 1, 90, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('ac07f763-747f-4e95-9549-070799687104', '987ddde7-fb79-4d27-8add-4502563d66a6', 2, 90, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('de1a4481-0494-4ea9-8842-484757d7916f', '5824e1b7-bbbd-41a0-9629-4432a7957ebd', 3, 90, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('2434e1d4-a7b5-484e-b938-b1d0f993f7e4', '69d6a755-4b52-4c59-897e-4aa0ebd29c6b', 4, 90, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('a5aca29f-d088-4103-9135-851549a6f678', 'fced1f7f-dd29-4705-be2d-d4204a2bce2f', 5, 90, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('e2d18d12-d4a1-493c-b55a-6b4da4b12f3d', '7715459a-d1a9-4110-8357-1594db9c978b', 6, 80, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('874a3291-4fa4-4aed-9b3b-80b9407d9dc6', '93bd1299-3d0b-4305-9fd7-c00f8fa6c588', 7, 80, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('abdcb120-ad7a-4c8f-a29c-200bc64b8bcb', '35aa609f-1741-4748-9a3f-8f7afb665e00', 8, 80, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('07be12cb-f39e-4b34-9ef4-794576965b7c', '40ed5bf1-2f49-416f-9d0c-1bfc15cef649', 9, 80, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('c15d56fd-8070-4acd-be1c-836f419bca43', 'a1e2f2a3-1f61-4093-84a6-f9d64941c211', 10, 60, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('d6b32f3d-6e84-4d63-a853-7640e28d55ba', 'ef5bb31b-3771-4c03-9aa5-dcc145eb3b4c', 11, 30, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('5e2cde1f-9a05-4666-a082-7634039ae62d', '9c6f3608-bb15-44e5-b3ed-5e1773bb0202', 12, 10, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('36ff58e6-82cb-4395-bcdf-00e1fb91a762', 'f6879591-5674-466f-90a2-c6ad2aa591c8', 13, 0, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('619dc42c-c8d9-4735-ab1f-0e3911a6cabc', '6b132f95-0495-45a0-b823-28bccd4fdbf2', 14, 0, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');
INSERT INTO public.roasts VALUES ('930345e1-1dee-4806-a314-b6894ce1a021', '20d048da-276d-47af-84e7-3c9398b5dc21', 15, 0, 0, '{}', NULL, '2026-04-07 15:29:40.134468+00', '2026-04-07 15:29:40.134468+00');


--
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.submissions VALUES ('f4b97e0d-509c-4fe0-bed7-d302bf0698ac', 'export function detectLanguage(code: string): Language {
	const scores = new Map<Language, number>();

	for (const { language, patterns } of LANGUAGE_SIGNALS) {
		const score = patterns.reduce(
			(sum, { regex, weight }) => sum + (regex.test(code) ? weight : 0),
			0,
		);
		if (score >= MIN_SCORE) {
			scores.set(language, score);
		}
	}

	if (scores.size === 0) return "javascript";

	return [...scores.entries()].reduce((best, curr) => (curr[1] > best[1] ? curr : best))[0];
}', 'typescript', NULL, NULL, true, 70, 4, '2026-04-07 15:49:12.425683+00', '2026-04-07 16:09:53.684+00');
INSERT INTO public.submissions VALUES ('d89e3a3f-507e-4b58-9e17-6735df2a0719', 'export function getMinutesUntilReset(resetTime: number): number {
  return Math.ceil((resetTime - Date.now()) / 60000);
}', 'typescript', NULL, NULL, true, 60, 3, '2026-04-07 16:23:02.0383+00', '2026-04-07 16:24:49.554+00');
INSERT INTO public.submissions VALUES ('a1e2f2a3-1f61-4093-84a6-f9d64941c211', 'h1 {margin-left: -3px; z-index: 99999; height: 59px;}', 'css', NULL, NULL, false, 60, 4, '2026-04-07 02:29:03.257762+00', '2026-04-07 15:34:50.657+00');
INSERT INTO public.submissions VALUES ('fced1f7f-dd29-4705-be2d-d4204a2bce2f', 'function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }', 'javascript', NULL, NULL, true, 90, 9, '2026-04-07 02:39:00.442313+00', '2026-04-07 15:35:10.885+00');
INSERT INTO public.submissions VALUES ('5824e1b7-bbbd-41a0-9629-4432a7957ebd', 'const $$ = {
    start: 0,
    end: 1,
    doStuff: 2,
}

const ___location___ = [$$.start];

function goto(x){
    ___location___[0] = x;
}

while(true) {
    switch(___location___[0]) {
        case $$.start:
            ...
            goto($$.doStuff);
            continue;
        case $$.doStuff:
            ...
            goto($$.end);
            continue;
        case $$.end: {
            break;
        }

        default: break;
    }
    break;
}', 'javascript', NULL, NULL, true, 90, 4, '2026-04-07 02:43:32.1167+00', '2026-04-07 15:45:31.739+00');
INSERT INTO public.submissions VALUES ('7715459a-d1a9-4110-8357-1594db9c978b', 'splitString(value){    
        var ret = [];
        var a = value.split(",");
        var len = a.length;
        for(var i=0; i<len; i++){
            ret.push(a[i]);
        }
        return ret;
    }', 'javascript', NULL, NULL, true, 80, 3, '2026-04-07 02:48:22.102929+00', '2026-04-07 02:53:31.297+00');
INSERT INTO public.submissions VALUES ('69d6a755-4b52-4c59-897e-4aa0ebd29c6b', 'function bad() { var x=1; return x; }', 'javascript', NULL, NULL, true, 90, 2, '2026-04-07 03:07:19.560356+00', '2026-04-07 15:59:46.495+00');
INSERT INTO public.submissions VALUES ('f6879591-5674-466f-90a2-c6ad2aa591c8', 'body div#container ul.navigation li.item a.link { color: red; }', 'javascript', NULL, NULL, false, 0, 2, '2026-04-07 02:30:20.671548+00', '2026-04-07 02:33:08.753+00');
INSERT INTO public.submissions VALUES ('93bd1299-3d0b-4305-9fd7-c00f8fa6c588', 'function test() {
  var x = 1;
  if (x == 1) {
    console.log("test");
  }
}', 'javascript', NULL, NULL, true, 80, 0, '2026-04-07 03:06:17.914561+00', '2026-04-07 03:06:40.01+00');
INSERT INTO public.submissions VALUES ('20d048da-276d-47af-84e7-3c9398b5dc21', '  splitString(value){    
        var ret = [];
        var a = value.split(",");
        var len = a.length;
        for(var i=0; i<len; i++){
            ret.push(a[i]);
        }
        return ret;
    }', 'javascript', NULL, NULL, false, 0, 4, '2026-04-07 03:02:19.940605+00', '2026-04-07 03:07:11.32+00');
INSERT INTO public.submissions VALUES ('9c6f3608-bb15-44e5-b3ed-5e1773bb0202', 'const x = 1;
const y = 2;
const z = x + y;
console.log(z);', 'javascript', NULL, NULL, false, 10, 4, '2026-04-07 02:40:54.812491+00', '2026-04-07 02:47:27.17+00');
INSERT INTO public.submissions VALUES ('35aa609f-1741-4748-9a3f-8f7afb665e00', 'var a = 1; var b = 2; var c = 3; var d = a+b+c; alert(d);', 'javascript', NULL, NULL, true, 80, 1, '2026-04-07 02:41:52.478528+00', '2026-04-07 02:47:30.716+00');
INSERT INTO public.submissions VALUES ('6b132f95-0495-45a0-b823-28bccd4fdbf2', 'splitString(value){    
        var ret = [];
        var a = value.split(",");
        var len = a.length;
        for(var i=0; i<len; i++){
            ret.push(a[i]);
        }
        return ret;
    }', 'javascript', NULL, NULL, false, 0, 7, '2026-04-07 02:55:14.734352+00', '2026-04-07 02:59:28.208+00');
INSERT INTO public.submissions VALUES ('ef5bb31b-3771-4c03-9aa5-dcc145eb3b4c', '  splitString(value){    
        var ret = [];
        var a = value.split(",");
        var len = a.length;
        for(var i=0; i<len; i++){
            ret.push(a[i]);
        }
        return ret;
    }', 'javascript', NULL, NULL, false, 30, 1, '2026-04-07 03:08:09.825372+00', '2026-04-07 03:08:16.861+00');
INSERT INTO public.submissions VALUES ('40ed5bf1-2f49-416f-9d0c-1bfc15cef649', '  splitString(value){    
        var ret = [];
        var a = value.split(",");
        var len = a.length;
        for(var i=0; i<len; i++){
            ret.push(a[i]);
        }
        return ret;
    }', 'javascript', NULL, NULL, true, 80, 3, '2026-04-07 03:08:46.141582+00', '2026-04-07 16:01:04.966+00');
INSERT INTO public.submissions VALUES ('987ddde7-fb79-4d27-8add-4502563d66a6', '<html>is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `''use client''` to a module that was originally written for the server.', 'html', NULL, NULL, false, 90, 6, '2026-04-07 02:37:07.627703+00', '2026-04-07 16:24:59.138+00');
INSERT INTO public.submissions VALUES ('892b4273-2b96-4ce9-ab55-843d412b56a8', 'body div#container ul.navigation li.item a.link {
  color: red;
}', 'css', NULL, NULL, true, 90, 5, '2026-04-07 02:35:31.431681+00', '2026-04-07 16:25:04.289+00');


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: roasts roasts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roasts
    ADD CONSTRAINT roasts_pkey PRIMARY KEY (id);


--
-- Name: roasts roasts_submission_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roasts
    ADD CONSTRAINT roasts_submission_id_unique UNIQUE (submission_id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_submission_id_submissions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_submission_id_submissions_id_fk FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: roasts roasts_submission_id_submissions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roasts
    ADD CONSTRAINT roasts_submission_id_submissions_id_fk FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

