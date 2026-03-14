import { Button } from "@/components";

export default function ButtonsExample() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-white p-8">
			<div className="space-y-8">
				<div>
					<h2 className="text-lg font-bold mb-4 font-jetbrains-mono">
						{`// `}
						<span className="text-emerald-500">buttons</span>
					</h2>

					<div className="flex items-center gap-4">
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

				<div className="border-t pt-8">
					<h3 className="text-sm font-bold mb-4 font-jetbrains-mono">{`// All Variants`}</h3>
					<div className="space-y-4">
						<div className="flex gap-4">
							<Button variant="primary">Primary</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="link">Link</Button>
							<Button variant="danger">Danger</Button>
							<Button variant="ghost">Ghost</Button>
						</div>

						<div className="flex gap-4">
							<Button variant="primary" size="sm">
								Small
							</Button>
							<Button variant="secondary" size="sm">
								Small
							</Button>
							<Button variant="link" size="sm">
								Small
							</Button>
						</div>

						<div className="flex gap-4">
							<Button variant="primary" size="lg">
								Large
							</Button>
							<Button variant="secondary" size="lg">
								Large
							</Button>
							<Button variant="link" size="lg">
								Large
							</Button>
						</div>

						<div className="flex gap-4">
							<Button variant="primary" disabled>
								Disabled
							</Button>
							<Button variant="secondary" disabled>
								Disabled
							</Button>
							<Button variant="link" disabled>
								Disabled
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
