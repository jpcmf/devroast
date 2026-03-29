#!/usr/bin/env node

const dotenv = require("dotenv");
const path = require("path");

// Load .env.local explicitly FIRST
const envPath = path.join(__dirname, "../.env.local");
console.log(`Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });
if (result.error) {
	console.warn("Could not load .env.local:", result.error.message);
} else {
	console.log("✓ .env.local loaded");
	console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
}

const { faker } = require("@faker-js/faker");

async function seed() {
	try {
		console.log("\n🌱 Starting database seed...");

		// Import db client and schema after env is loaded
		const { db } = require("../src/db/client");
		const { submissions, feedback, roasts } = require("../src/db/schema");

		// Code snippets for different languages
		const CODE_SNIPPETS = {
			javascript: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i];
  }
  return total;
}`,
			typescript: `interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  // Missing error handling
  return users[id];
}`,
			python: `def process_data(data):
    result = []
    for i in range(len(data)):
        if data[i] > 10:
            result.append(data[i] * 2)
    return result`,
			rust: `fn process(data: Vec<i32>) -> Vec<i32> {
  let mut result = Vec::new();
  for item in data {
    result.push(item * 2);
  }
  result
}`,
			golang: `func Process(data []interface{}) {
  for i := 0; i < len(data); i++ {
    fmt.Println(data[i])
  }
}`,
			java: `public class Calculator {
  public int sum(int[] numbers) {
    int total = 0;
    for (int num : numbers) {
      total += num;
    }
    return total;
  }
}`,
			csharp: `public class DataProcessor {
  public static void Process(int[] data) {
    for (int i = 0; i < data.Length; i++) {
      Console.WriteLine(data[i]);
    }
  }
}`,
			php: `<?php
function process($data) {
  $result = array();
  foreach($data as $item) {
    array_push($result, $item * 2);
  }
  return $result;
}`,
			ruby: `def calculate_sum(numbers)
  sum = 0
  numbers.each { |n| sum += n }
  sum
end`,
			sql: `SELECT u.id, u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY order_count DESC`,
		};

		const LANGUAGES = [
			"javascript",
			"typescript",
			"python",
			"rust",
			"golang",
			"java",
			"csharp",
			"php",
			"ruby",
			"sql",
		];

		const FEEDBACK_TYPES = ["roast", "standard", "review"];
		const SEVERITY_LEVELS = ["critical", "high", "medium", "low", "minimal"];
		const ISSUE_CATEGORIES = [
			"naming",
			"performance",
			"security",
			"error_handling",
			"code_style",
			"logic",
			"complexity",
			"best_practices",
			"documentation",
			"dependency_management",
		];
		const BADGES = [
			"worst_naming",
			"missing_error_handling",
			"security_nightmare",
			"spaghetti_code",
			"no_documentation",
			"performance_disaster",
			"abandoned_variables",
			"magic_numbers",
			"cyclomatic_chaos",
			"regex_nightmare",
		];

		const feedbackMessages = {
			roast: [
				"This code is an absolute nightmare. Where do I even start?",
				"I've seen better code in a beginner's tutorial.",
				"This is what nightmares are made of.",
				"Your variable names are more cryptic than the Enigma machine.",
				"This function has more layers than an onion and none of them make sense.",
			],
			standard: [
				"Consider refactoring this logic into separate functions.",
				"This implementation could be more efficient.",
				"The error handling here is insufficient.",
				"You might want to add some documentation.",
				"This approach works but could be optimized.",
			],
			review: [
				"Good structure, but watch out for the edge cases.",
				"Nice implementation, just a couple of suggestions.",
				"Overall solid work, a few minor improvements.",
				"Well done, though this could be simplified.",
				"Good effort, consider these optimizations.",
			],
		};

		function generateSubmission() {
			const language = faker.helpers.arrayElement(LANGUAGES);
			const code = CODE_SNIPPETS[language] || CODE_SNIPPETS.javascript;

			return {
				id: faker.string.uuid(),
				code,
				language,
				title: faker.lorem.words({ min: 2, max: 4 }),
				description: faker.lorem.sentences({ min: 1, max: 3 }),
				roastMode: faker.datatype.boolean({ probability: 0.7 }),
				severityScore: faker.number.int({ min: 0, max: 100 }),
				viewCount: faker.number.int({ min: 10, max: 1000 }),
				createdAt: faker.date.past(),
				updatedAt: new Date(),
			};
		}

		function generateFeedback(submissionId, count) {
			const feedbackList = [];

			for (let i = 0; i < count; i++) {
				const type = faker.helpers.arrayElement(FEEDBACK_TYPES);
				const messages = feedbackMessages[type] || [];

				feedbackList.push({
					id: faker.string.uuid(),
					submissionId,
					feedbackType: type,
					content:
						messages.length > 0
							? faker.helpers.arrayElement(messages)
							: faker.lorem.sentences({ min: 2, max: 4 }),
					issuesFound: faker.number.int({ min: 0, max: 10 }),
					recommendationsCount: faker.number.int({ min: 0, max: 5 }),
					createdAt: faker.date.recent(),
					updatedAt: new Date(),
				});
			}

			return feedbackList;
		}

		function generateRoast(submissionId, feedbackCount, rank) {
			const selectedBadges = faker.helpers.arrayElements(BADGES, {
				min: 0,
				max: 3,
			});

			return {
				id: faker.string.uuid(),
				submissionId,
				rankPosition: rank,
				severityRating: faker.number.int({ min: 1, max: 100 }),
				criticalIssuesCount: faker.number.int({ min: 0, max: 5 }),
				badges: selectedBadges,
				lastRankedAt: faker.date.recent(),
				createdAt: faker.date.past(),
				updatedAt: new Date(),
			};
		}

		const submissionIds = [];
		let totalFeedback = 0;
		let totalRoasts = 0;

		// Generate 100 submissions with feedback and roasts
		for (let i = 0; i < 100; i++) {
			const submission = generateSubmission();
			submissionIds.push(submission.id);

			// Insert submission
			await db.insert(submissions).values({
				id: submission.id,
				code: submission.code,
				language: submission.language,
				title: submission.title,
				description: submission.description,
				roastMode: submission.roastMode,
				severityScore: submission.severityScore,
				viewCount: submission.viewCount,
				createdAt: submission.createdAt,
				updatedAt: submission.updatedAt,
			});

			// Generate feedback (2-6 items per submission)
			const feedbackCount = faker.number.int({ min: 2, max: 6 });
			const submissionFeedback = generateFeedback(submission.id, feedbackCount);
			totalFeedback += submissionFeedback.length;

			// Insert feedback
			for (const fb of submissionFeedback) {
				await db.insert(feedback).values({
					id: fb.id,
					submissionId: fb.submissionId,
					feedbackType: fb.feedbackType,
					content: fb.content,
					issuesFound: fb.issuesFound,
					recommendationsCount: fb.recommendationsCount,
					createdAt: fb.createdAt,
					updatedAt: fb.updatedAt,
				});
			}

			// Generate and insert roast
			const roast = generateRoast(submission.id, submissionFeedback.length, i + 1);
			totalRoasts++;

			await db.insert(roasts).values({
				id: roast.id,
				submissionId: roast.submissionId,
				rankPosition: roast.rankPosition,
				severityRating: roast.severityRating,
				criticalIssuesCount: roast.criticalIssuesCount,
				badges: roast.badges,
				lastRankedAt: roast.lastRankedAt,
				createdAt: roast.createdAt,
				updatedAt: roast.updatedAt,
			});

			if ((i + 1) % 10 === 0) {
				console.log(`✓ Seeded ${i + 1} submissions with feedback and roasts`);
			}
		}

		console.log("\n✅ Seed completed successfully!");
		console.log(`  - Submissions: ${submissionIds.length}`);
		console.log(`  - Feedback entries: ${totalFeedback}`);
		console.log(`  - Roasts: ${totalRoasts}`);

		process.exit(0);
	} catch (error) {
		console.error("❌ Seed failed:", error);
		process.exit(1);
	}
}

seed();
