import StatsCard from "./StatsCard.jsx";
const StatsSection = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          gradient={stat.gradient}
        />
      ))}
    </div>
  );
};

export default StatsSection;