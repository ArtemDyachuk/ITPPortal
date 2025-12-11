import dataSources from '@repo/ui/data/dataSources.json';

type Agency = {
  id: string;
  name: string;
  category: string;
};

export default async function AgencyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agency = dataSources.find((a: Agency) => a.id === id);

  if (!agency) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Agency Not Found
        </h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <p className="text-slate-600 dark:text-slate-300">
            No agency found with ID: {id}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
        Agency Details
      </h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {agency.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Category: {agency.category.replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              ID: {agency.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}