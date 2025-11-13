const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="rounded-2xl border border-dashed border-slate-300/70 bg-slate-50/70 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
    <p className="mt-3 text-sm">This section is coming soon. Check back later for full functionality.</p>
  </div>
);

export default PlaceholderPage;



