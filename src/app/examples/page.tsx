import { Button, Toggle, CodeBlock } from "@/components";

const codeExample = `function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 3);
console.log(result);`;

export default function ExamplesPage() {
	return (
		<div className="min-h-screen bg-white p-8">
			<div className="max-w-4xl mx-auto space-y-12">
				{/* Buttons Section */}
				<section>
					<h2 className="text-lg font-bold mb-6 font-jetbrains-mono">
						{`// `}
						<span className="text-emerald-500">buttons</span>
					</h2>

					<div className="space-y-6">
						{/* Main Button Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-600">
								{`$ `}
								<span>main buttons</span>
							</h3>
							<div className="flex items-center gap-4 p-4 bg-gray-50 rounded">
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
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-600">
								{`$ `}
								<span>all variants</span>
							</h3>
							<div className="space-y-4 p-4 bg-gray-50 rounded">
								<div className="flex gap-4 flex-wrap">
									<Button variant="primary">Primary</Button>
									<Button variant="secondary">Secondary</Button>
									<Button variant="link">Link</Button>
									<Button variant="danger">Danger</Button>
									<Button variant="ghost">Ghost</Button>
								</div>

								<div className="border-t pt-4">
									<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-600">sizes:</p>
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

								<div className="border-t pt-4">
									<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-600">
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
				<section className="border-t pt-12">
					<h2 className="text-lg font-bold mb-6 font-jetbrains-mono">
						{`// `}
						<span className="text-emerald-500">toggle</span>
					</h2>

					<div className="space-y-6">
						{/* Main Toggle Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-600">
								{`$ `}
								<span>main toggles</span>
							</h3>
							<div className="flex items-center gap-12 p-4 bg-gray-50 rounded">
								<Toggle defaultChecked label="roast mode" />
								<Toggle defaultChecked={false} label="roast mode" />
							</div>
						</div>

						{/* All Variants */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-600">
								{`$ `}
								<span>all variants</span>
							</h3>
							<div className="space-y-4 p-4 bg-gray-50 rounded">
								<div className="flex gap-8 flex-wrap items-center">
									<Toggle defaultChecked size="sm" label="Small" />
									<Toggle defaultChecked size="md" label="Medium" />
									<Toggle defaultChecked size="lg" label="Large" />
								</div>

								<div className="border-t pt-4">
									<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-600">
										off state:
									</p>
									<div className="flex gap-8 flex-wrap items-center">
										<Toggle defaultChecked={false} size="sm" label="Small" />
										<Toggle defaultChecked={false} size="md" label="Medium" />
										<Toggle defaultChecked={false} size="lg" label="Large" />
									</div>
								</div>

								<div className="border-t pt-4">
									<p className="text-xs font-bold mb-3 font-jetbrains-mono text-gray-600">
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
				<section className="border-t pt-12">
					<h2 className="text-lg font-bold mb-6 font-jetbrains-mono">
						{`// `}
						<span className="text-emerald-500">code_block</span>
					</h2>

					<div className="space-y-6">
						{/* JavaScript Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-600">
								{`$ `}
								<span>javascript</span>
							</h3>
							<CodeBlock code={codeExample} language="javascript" filename="calculate.js" />
						</div>

						{/* TypeScript Example */}
						<div>
							<h3 className="text-sm font-bold mb-4 font-jetbrains-mono text-gray-600">
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
			</div>
		</div>
	);
}
