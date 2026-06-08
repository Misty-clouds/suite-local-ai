import StatsCards from "../../components/StatsCards";
import RevenueChart from "../../components/RevenueChart";
import ProjectPipeline from "../../components/ProjectPipeline";
import RightPanel from "../../components/RightPanel";
import Header from "../../components/Header";

// Toggle this to true to simulate the zero state across the dashboard
const SIMULATE_ZERO_STATE = false;

export default function Home() {
  return (
    <>
      <Header />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-track-app-bg scrollbar-thumb-app-border">
        <div className="flex w-full max-w-full flex-col gap-6 lg:flex-row">
          {/* Main Dashboard Column */}
          <div className="flex-1 min-w-0">
            {/* Stats Row */}
            <StatsCards isEmpty={SIMULATE_ZERO_STATE} />

            {/* Chart Row */}
            <RevenueChart isEmpty={SIMULATE_ZERO_STATE} />

            {/* Pipeline Row */}
            <div className="rounded-2xl border border-app-border bg-app-card h-[500px] shadow-lg flex flex-col overflow-hidden relative">
              <div className="absolute inset-0">
                <ProjectPipelineWrapper isEmpty={SIMULATE_ZERO_STATE} />
              </div>
            </div>
          </div>

          {/* Right Panel Column */}
          <div className="shrink-0 w-full lg:w-72 flex flex-col">
            <RightPanel isEmpty={SIMULATE_ZERO_STATE} />
          </div>
        </div>
      </div>
    </>
  );
}

// Wrapper to adjust styles of ProjectPipeline without deep refactoring right now
function ProjectPipelineWrapper({ isEmpty }: { isEmpty?: boolean }) {
  return (
    <div className="h-full w-full [&>div]:bg-transparent [&>div]:p-4 [&>div>div:first-child]:mb-2">
      <ProjectPipeline isEmpty={isEmpty} />
    </div>
  );
}
