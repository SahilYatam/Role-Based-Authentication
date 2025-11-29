export const Alert = ({ type, message }) => {
    const styles = type === "success"
        ? "bg-green-500/10 text-green-400 border-green-500/30"
        : "bg-red-500/10 text-red-400 border-red-500/30";

    return (
        <div className={`mb-4 p-3 rounded border ${styles}`}>
            {message}
        </div>
    );
};