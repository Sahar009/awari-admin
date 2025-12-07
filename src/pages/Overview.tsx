import StatCards from '../components/dashboard/StatCards';
import QuickActions from '../components/dashboard/QuickActions';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import ModerationQueue from '../components/dashboard/ModerationQueue';

const OverviewPage = () => (
  <>
    <StatCards />
    <section className="mt-12 grid gap-6 lg:grid-cols-3">
      <QuickActions />
      <ActivityFeed />
    </section>
    <ModerationQueue />
  </>
);

export default OverviewPage;

















