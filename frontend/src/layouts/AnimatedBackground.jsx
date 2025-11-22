
const AnimatedBackground = ({ children }) => {
    return (
        <div className="min-h-screen relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-red-950 via-purple-950 to-gray-900"></div>

                {/* Circuit patterns */}
                <div className="absolute top-0 left-0 w-64 h-64 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                        <path d="M20,20 L60,20 L80,40 L120,40 M60,20 L60,60 L80,80 M120,40 L140,40 L140,80"
                            stroke="rgba(239,68,68,0.8)" strokeWidth="2" fill="none" />
                        <circle cx="20" cy="20" r="3" fill="rgba(239,68,68,0.8)" />
                        <circle cx="60" cy="20" r="3" fill="rgba(239,68,68,0.8)" />
                        <circle cx="60" cy="60" r="3" fill="rgba(239,68,68,0.8)" />
                        <circle cx="80" cy="40" r="3" fill="rgba(239,68,68,0.8)" />
                        <circle cx="120" cy="40" r="3" fill="rgba(239,68,68,0.8)" />
                        <circle cx="140" cy="40" r="3" fill="rgba(239,68,68,0.8)" />
                    </svg>
                </div>

                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30 rotate-180">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                        <path d="M20,20 L60,20 L80,40 L120,40 M60,20 L60,60 L80,80 M120,40 L140,40 L140,80"
                            stroke="rgba(168,85,247,0.8)" strokeWidth="2" fill="none" />
                        <circle cx="20" cy="20" r="3" fill="rgba(168,85,247,0.8)" />
                        <circle cx="60" cy="20" r="3" fill="rgba(168,85,247,0.8)" />
                        <circle cx="60" cy="60" r="3" fill="rgba(168,85,247,0.8)" />
                    </svg>
                </div>

                {/* Glowing dots grid */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 grid grid-cols-12 gap-2">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                            style={{
                                animation: `pulse 2s ease-in-out infinite`,
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 grid grid-cols-12 gap-2">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                            style={{
                                animation: `pulse 2s ease-in-out infinite`,
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>

                <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
            </div>

            {/* Content */}
            <div className="relative z-10 py-12">
                {children}
            </div>
        </div>
    );
}

export default AnimatedBackground