import { Button, Toggle, CodeBlock, Card, BadgeStatus } from "@/components";

const codeExample = `function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 3);
console.log(result);`;

export default function ExamplesPage() {
	return (
		<div className="min-h-screen bg-gray-950 p-8">
			<div className="max-w-4xl mx-auto space-y-12">
				{/* Buttons Section */}
				<section>
					<h2 className="text-lg font-bold mb-6 font-jetbrains-mono text-gray-100">
						{`// `}
						<span className="text-emerald-500">buttons</span>
					</h2>

					<div className="space-y-6">
						{/* Main Button Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>main buttons</span>
							</h3>
							<div className="flex items-center gap-4 p-4 bg-gray-900 rounded">
								<Button variant="primary" size="md">
									$ roast_my_code
								</Button>

								<Button variant="secondary" size="md">
									$ share_roast
								</Button>

								<Button variant="link" size="md">
									$ view_all &gt;&gt;
								</Button>
							</div>
						</div>

						{/* All Variants */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>all variants</span>
							</h3>
							<div className="space-y-4 p-4 bg-gray-900 rounded">
								<div className="flex gap-4 flex-wrap">
									<Button variant="primary">Primary</Button>
									<Button variant="secondary">Secondary</Button>
									<Button variant="link">Link</Button>
									<Button variant="danger">Danger</Button>
									<Button variant="ghost">Ghost</Button>
								</div>

								<div className="border-t border-gray-700 pt-4">
									<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-400">sizes:</p>
									<div className="flex gap-4 flex-wrap">
										<Button variant="primary" size="sm">
											Small
										</Button>
										<Button variant="primary" size="md">
											Medium
										</Button>
										<Button variant="primary" size="lg">
											Large
										</Button>
									</div>
								</div>

								<div className="border-t border-gray-700 pt-4">
									<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-400">
										disabled:
									</p>
									<div className="flex gap-4 flex-wrap">
										<Button variant="primary" disabled>
											Disabled
										</Button>
										<Button variant="secondary" disabled>
											Disabled
										</Button>
										<Button variant="danger" disabled>
											Disabled
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Toggle Section */}
				<section className="border-t border-gray-700 pt-12">
					<h2 className="text-lg font-bold mb-6 font-jetbrains-mono text-gray-100">
						{`// `}
						<span className="text-emerald-500">toggle</span>
					</h2>

					<div className="space-y-6">
						{/* Main Toggle Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>main toggles</span>
							</h3>
							<div className="flex items-center gap-12 p-4 bg-gray-900 rounded">
								<Toggle defaultChecked label="roast mode" />
								<Toggle defaultChecked={false} label="roast mode" />
							</div>
						</div>

						{/* All Variants */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>all variants</span>
							</h3>
							<div className="space-y-4 p-4 bg-gray-900 rounded">
								<div className="flex gap-8 flex-wrap items-center">
									<Toggle defaultChecked size="sm" label="Small" />
									<Toggle defaultChecked size="md" label="Medium" />
									<Toggle defaultChecked size="lg" label="Large" />
								</div>

								<div className="border-t border-gray-700 pt-4">
									<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-400">
										off state:
									</p>
									<div className="flex gap-8 flex-wrap items-center">
										<Toggle defaultChecked={false} size="sm" label="Small" />
										<Toggle defaultChecked={false} size="md" label="Medium" />
										<Toggle defaultChecked={false} size="lg" label="Large" />
									</div>
								</div>

								<div className="border-t border-gray-700 pt-4">
									<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-400">
										disabled:
									</p>
									<div className="flex gap-8 flex-wrap items-center">
										<Toggle defaultChecked disabled label="On" />
										<Toggle defaultChecked={false} disabled label="Off" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* CodeBlock Section */}
				<section className="border-t border-gray-700 pt-12">
					<h2 className="text-lg font-bold mb-6 font-jetbrains-mono text-gray-100">
						{`// `}
						<span className="text-emerald-500">code_block</span>
					</h2>

					<div className="space-y-6">
						{/* JavaScript Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>javascript</span>
							</h3>
							<CodeBlock code={codeExample} language="javascript" filename="calculate.js" />
						</div>

						{/* TypeScript Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>typescript</span>
							</h3>
							<CodeBlock
								code={`interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com"
};`}
								language="typescript"
								filename="types.ts"
							/>
						</div>

						{/* Python Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-600">
								{`$ `}
								<span>python</span>
							</h3>
							<CodeBlock
								code={`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print(result)`}
								language="python"
								filename="fibonacci.py"
							/>
						</div>
					</div>
				</section>

				{/* Card Section */}
				<section className="border-t border-gray-700 pt-12">
					<h2 className="text-lg font-bold mb-6 font-jetbrains-mono text-gray-100">
						{`// `}
						<span className="text-emerald-500">cards</span>
					</h2>

					<div className="space-y-6">
						{/* Main Card Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>main card</span>
							</h3>
							<div className="p-4 bg-gray-900 rounded">
								<Card>
									<Card.Header>
										<Card.Badge variant="critical" />
										<Card.Label>critical</Card.Label>
									</Card.Header>
									<Card.Title>using var instead of const/let</Card.Title>
									<Card.Description>
										the var keyword is function-scoped rather than block-scoped, which can lead to
										unexpected behavior and bugs. modern javascript uses const for immutable
										bindings and let for mutable ones.
									</Card.Description>
								</Card>
							</div>
						</div>

						{/* All Variants */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>all variants</span>
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900 rounded">
								<Card>
									<Card.Header>
										<Card.Badge variant="critical" />
										<Card.Label>critical</Card.Label>
									</Card.Header>
									<Card.Title>Unsafe variable declaration</Card.Title>
									<Card.Description>
										Using var instead of const/let can lead to unexpected behavior due to
										function-scoping.
									</Card.Description>
								</Card>

								<Card>
									<Card.Header>
										<Card.Badge variant="warning" />
										<Card.Label>warning</Card.Label>
									</Card.Header>
									<Card.Title>Performance concern</Card.Title>
									<Card.Description>
										This operation has O(n²) complexity. Consider using a more efficient algorithm
										for better performance.
									</Card.Description>
								</Card>

								<Card>
									<Card.Header>
										<Card.Badge variant="info" />
										<Card.Label>info</Card.Label>
									</Card.Header>
									<Card.Title>Code style suggestion</Card.Title>
									<Card.Description>
										Following consistent naming conventions improves code readability and
										maintainability.
									</Card.Description>
								</Card>

								<Card>
									<Card.Header>
										<Card.Badge variant="success" />
										<Card.Label>success</Card.Label>
									</Card.Header>
									<Card.Title>Best practice applied</Card.Title>
									<Card.Description>
										Good use of functional programming paradigm. This approach is clean and
										maintainable.
									</Card.Description>
								</Card>
							</div>
						</div>
					</div>
				</section>

				{/* BadgeStatus Section */}
				<section className="border-t border-gray-700 pt-12">
					<h2 className="text-lg font-bold mb-6 font-jetbrains-mono text-gray-100">
						{`// `}
						<span className="text-emerald-500">badge_status</span>
					</h2>

					<div className="space-y-6">
						{/* Main Badge Examples */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>main badges</span>
							</h3>
							<div className="flex items-center gap-6 p-4 bg-gray-900 rounded flex-wrap">
								<BadgeStatus variant="critical">critical</BadgeStatus>
								<BadgeStatus variant="warning">warning</BadgeStatus>
								<BadgeStatus variant="good">good</BadgeStatus>
								<BadgeStatus variant="needs_serious_help">needs_serious_help</BadgeStatus>
							</div>
						</div>

						{/* All Variants */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-400">
								{`$ `}
								<span>all variants</span>
							</h3>
							<div className="space-y-4 p-4 bg-gray-900 rounded">
								<div className="flex items-center gap-8 flex-wrap">
									<div>
										<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-400">critical:</p>
										<BadgeStatus variant="critical">critical</BadgeStatus>
									</div>

									<div>
										<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-400">warning:</p>
										<BadgeStatus variant="warning">warning</BadgeStatus>
									</div>

									<div>
										<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-400">good:</p>
										<BadgeStatus variant="good">good</BadgeStatus>
									</div>

									<div>
										<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-400">needs help:</p>
										<BadgeStatus variant="needs_serious_help">needs_serious_help</BadgeStatus>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
