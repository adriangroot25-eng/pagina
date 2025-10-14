import { HeartPulse, Dumbbell, Activity } from 'lucide-react';

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-10 floating-element animate-float">
        <HeartPulse className="w-12 h-12 text-white" />
      </div>
      <div className="absolute top-40 right-20 floating-element animate-float animation-delay-1000">
        <Dumbbell className="w-16 h-16 text-white" />
      </div>
      <div className="absolute bottom-40 left-20 floating-element animate-float animation-delay-200">
        <Activity className="w-14 h-14 text-white" />
      </div>
    </div>
  );
};

export default FloatingElements;