const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary orb */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-float" />
      
      {/* Secondary orb */}
      <div 
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-accent rounded-full blur-3xl opacity-15 animate-float"
        style={{ animationDelay: '2s' }}
      />
      
      {/* Accent orb */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-glow rounded-full blur-2xl opacity-10 animate-glow-pulse"
        style={{ animationDelay: '1s' }}
      />
      
      {/* Small decorative orbs */}
      <div className="absolute top-32 right-1/3 w-32 h-32 bg-accent-glow rounded-full blur-xl opacity-20 animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-32 left-1/3 w-24 h-24 bg-primary-glow rounded-full blur-lg opacity-15 animate-float" style={{ animationDelay: '4s' }} />
    </div>
  );
};

export default FloatingOrbs;