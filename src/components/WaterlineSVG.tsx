import React from 'react';

interface WaterlineSVGProps {
  className?: string;
}

export const WaterlineSVG: React.FC<WaterlineSVGProps> = ({ className = '' }) => {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="460"
        height="60"
        viewBox="0 0 460 60"
        className="w-full max-w-[460px] h-auto"
      >
        <line x1="0" y1="8" x2="400" y2="8" stroke="#C1732B" strokeWidth="2.6" />
        <line x1="34" y1="24" x2="340" y2="24" stroke="#14504B" strokeWidth="1.8" strokeOpacity="0.35" />
        <line x1="78" y1="38" x2="290" y2="38" stroke="#14504B" strokeWidth="1.3" strokeOpacity="0.20" />
        <line x1="120" y1="50" x2="250" y2="50" stroke="#14504B" strokeWidth="1" strokeOpacity="0.10" />
      </svg>
    </div>
  );
};
