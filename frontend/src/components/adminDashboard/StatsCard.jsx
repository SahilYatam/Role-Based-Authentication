import Card from "../ui/Card.jsx"
import IconGradient from "../ui/IconGradient.jsx"


const StatsCard = ({ icon, title, value, gradient }) => {
    return (
        <Card hover className="p-6">
            <div className="flex items-center gap-4">
                <IconGradient icon={icon} gradient={gradient} />
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-white text-3xl font-bold">{value}</p>
                </div>
            </div>
        </Card>
    );
};

export default StatsCard