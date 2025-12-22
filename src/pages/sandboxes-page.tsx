import { SandboxList } from '@/components/sandbox-list';

export function SandboxesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sandboxes</h1>
      </div>

      <SandboxList />
    </div>
  );
}
