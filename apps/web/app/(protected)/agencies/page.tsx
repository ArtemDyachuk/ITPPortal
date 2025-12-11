import Link from 'next/link';
import dataSources from '@repo/ui/data/dataSources.json';

type Agency = {
  id: string;
  name: string;
  category: string;
};

function AgencyCard({ agency }: { agency: Agency }) {
  return (
    <Link href={`/agencies/${agency.id}`}>
      <div className="p-6 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
            🏢
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {agency.name}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {agency.category.replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AgenciesPage() {
  const agencies: Agency[] = dataSources;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
        Agencies
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Agency management content will be displayed here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {agencies.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))}
        </div>
      </div>
    </div>
  );
}
