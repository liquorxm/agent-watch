import { CompanionAnimal } from '../../types/config';

interface Props {
  animal: CompanionAnimal;
  size?: number;
}

export function CompanionAnimalSVG({ animal, size = 80 }: Props) {
  switch (animal) {
    case 'pixel-fox':
      return <PixelFoxSVG size={size} />;
    case 'circuit-cat':
      return <CircuitCatSVG size={size} />;
    case 'binary-owl':
      return <BinaryOwlSVG size={size} />;
    case 'data-dog':
      return <DataDogSVG size={size} />;
    case 'glitch-raccoon':
      return <GlitchRaccoonSVG size={size} />;
    case 'cyber-penguin':
      return <CyberPenguinSVG size={size} />;
    default:
      return <DataDogSVG size={size} />;
  }
}

function PixelFoxSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <path d="M70 45 Q78 35 76 48 Q74 53 68 51" fill="#EA580C" stroke="#F59E0B" strokeWidth="1.2"/>
      <ellipse cx="50" cy="52" rx="15" ry="10" fill="#EA580C" stroke="#F59E0B" strokeWidth="1.2"/>
      <ellipse cx="38" cy="40" rx="11" ry="10" fill="#EA580C" stroke="#F59E0B" strokeWidth="1.2"/>
      <polygon points="30,34 33,24 36,32" fill="#EA580C" stroke="#F59E0B" strokeWidth="1"/>
      <polygon points="40,32 43,24 45,34" fill="#EA580C" stroke="#F59E0B" strokeWidth="1"/>
      <ellipse cx="34" cy="39" rx="2.8" ry="3.2" fill="white"/>
      <ellipse cx="42" cy="39" rx="2.8" ry="3.2" fill="white"/>
      <circle cx="34" cy="39.5" r="1.5" fill="#1E293B"/>
      <circle cx="42" cy="39.5" r="1.5" fill="#1E293B"/>
      <ellipse cx="38" cy="43" rx="1.5" ry="1" fill="#1E293B"/>
      <text x="60" y="34" fontFamily="JetBrains Mono" fontSize="6" fill="#22C55E" opacity="0.6">01</text>
      <text x="58" y="42" fontFamily="JetBrains Mono" fontSize="6" fill="#22C55E" opacity="0.4">10</text>
    </svg>
  );
}

function CircuitCatSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <path d="M62 52 Q70 42 73 48 Q75 52 70 54" fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="72" cy="47" r="2" fill="#5E6AD2"/>
      <ellipse cx="48" cy="54" rx="14" ry="10" fill="#7C3AED"/>
      <line x1="40" y1="48" x2="56" y2="48" stroke="#A78BFA" strokeWidth="0.8" opacity="0.6"/>
      <line x1="48" y1="48" x2="48" y2="58" stroke="#A78BFA" strokeWidth="0.8" opacity="0.6"/>
      <circle cx="40" cy="48" r="1" fill="#5E6AD2"/>
      <circle cx="56" cy="48" r="1" fill="#5E6AD2"/>
      <ellipse cx="38" cy="40" rx="11" ry="10" fill="#7C3AED"/>
      <polygon points="30,34 28,26 34,32" fill="#7C3AED"/>
      <polygon points="42,32 48,26 46,34" fill="#7C3AED"/>
      <ellipse cx="34" cy="39" rx="3" ry="3.5" fill="#1E1B4B"/>
      <ellipse cx="42" cy="39" rx="3" ry="3.5" fill="#1E1B4B"/>
      <circle cx="34" cy="39" r="1.8" fill="#22C55E"/>
      <circle cx="42" cy="39" r="1.8" fill="#22C55E"/>
      <circle cx="34.5" cy="38.5" r="0.6" fill="white" opacity="0.8"/>
      <circle cx="42.5" cy="38.5" r="0.6" fill="white" opacity="0.8"/>
      <polygon points="38,42 36,43 40,43" fill="#F472B6"/>
    </svg>
  );
}

function BinaryOwlSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <ellipse cx="40" cy="56" rx="16" ry="13" fill="#0F766E"/>
      <ellipse cx="40" cy="58" rx="10" ry="8" fill="#14B8A6" opacity="0.25"/>
      <ellipse cx="40" cy="38" rx="14" ry="11" fill="#0F766E"/>
      <polygon points="28,30 27,24 32,28" fill="#0F766E"/>
      <polygon points="52,30 53,24 48,28" fill="#0F766E"/>
      <circle cx="35" cy="38" r="5" fill="#042F2E"/>
      <circle cx="45" cy="38" r="5" fill="#042F2E"/>
      <circle cx="35" cy="38" r="3.5" fill="#CCFBF1"/>
      <circle cx="45" cy="38" r="3.5" fill="#CCFBF1"/>
      <ellipse cx="35" cy="37.5" rx="2" ry="1" fill="#06B6D4"/>
      <rect x="33" y="37.5" width="4" height="2" rx="0.5" fill="#06B6D4" opacity="0.8"/>
      <ellipse cx="35" cy="39.5" rx="2" ry="0.7" fill="#06B6D4" opacity="0.6"/>
      <ellipse cx="45" cy="37.5" rx="2" ry="1" fill="#06B6D4"/>
      <rect x="43" y="37.5" width="4" height="2" rx="0.5" fill="#06B6D4" opacity="0.8"/>
      <polygon points="40,41 38,43 42,43" fill="#F59E0B"/>
      <text x="16" y="50" fontFamily="JetBrains Mono" fontSize="10" fill="#5EEAD4" opacity="0.7" fontWeight="700">{'{'}</text>
      <text x="58" y="50" fontFamily="JetBrains Mono" fontSize="10" fill="#5EEAD4" opacity="0.7" fontWeight="700">{'}'}</text>
    </svg>
  );
}

function DataDogSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <path d="M62 50 Q70 44 74 46 Q75 48 72 50" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="1.2"/>
      <ellipse cx="48" cy="54" rx="15" ry="10" fill="#1D4ED8"/>
      <rect x="34" y="44" width="10" height="3.5" rx="1.5" fill="#334155"/>
      <text x="35.5" y="47" fontFamily="JetBrains Mono" fontSize="2.5" fill="#22C55E" fontWeight="700">$_</text>
      <ellipse cx="36" cy="40" rx="12" ry="10" fill="#1D4ED8"/>
      <ellipse cx="28" cy="42" rx="5" ry="7" fill="#1E40AF" transform="rotate(-15 28 42)"/>
      <ellipse cx="44" cy="42" rx="5" ry="7" fill="#1E40AF" transform="rotate(15 44 42)"/>
      <circle cx="32" cy="39" r="2.8" fill="white"/>
      <circle cx="40" cy="39" r="2.8" fill="white"/>
      <circle cx="32.8" cy="39" r="1.8" fill="#1E293B"/>
      <circle cx="40.8" cy="39" r="1.8" fill="#1E293B"/>
      <circle cx="33.5" cy="38.5" r="0.5" fill="white"/>
      <circle cx="41.5" cy="38.5" r="0.5" fill="white"/>
      <ellipse cx="36" cy="43" rx="2.5" ry="1.8" fill="#1E293B"/>
    </svg>
  );
}

function GlitchRaccoonSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <ellipse cx="48" cy="52" rx="15" ry="10" fill="#6B7280"/>
      <ellipse cx="50" cy="52" rx="15" ry="10" fill="#EC4899" opacity="0.12"/>
      <ellipse cx="36" cy="40" rx="12" ry="10" fill="#6B7280"/>
      <path d="M26 37 Q36 33 46 37 Q46 43 36 43 Q26 43 26 37Z" fill="#1F2937"/>
      <ellipse cx="32" cy="39" rx="2.8" ry="3.2" fill="white"/>
      <ellipse cx="40" cy="39" rx="2.8" ry="3.2" fill="white"/>
      <circle cx="32.8" cy="39" r="1.6" fill="#EC4899"/>
      <circle cx="40.8" cy="39" r="1.6" fill="#06B6D4"/>
      <ellipse cx="36" cy="42" rx="1.8" ry="1.2" fill="#1F2937"/>
      <polygon points="28,32 27,26 32,30" fill="#6B7280"/>
      <polygon points="44,32 45,26 40,30" fill="#6B7280"/>
    </svg>
  );
}

function CyberPenguinSVG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <ellipse cx="40" cy="50" rx="14" ry="17" fill="#1E293B"/>
      <ellipse cx="40" cy="53" rx="9" ry="11" fill="#F1F5F9"/>
      <circle cx="40" cy="32" r="10" fill="#1E293B"/>
      <ellipse cx="40" cy="34" rx="7" ry="6.5" fill="#F1F5F9"/>
      <ellipse cx="37" cy="32" rx="1.8" ry="2.2" fill="#1E293B"/>
      <ellipse cx="43" cy="32" rx="1.8" ry="2.2" fill="#1E293B"/>
      <circle cx="37.3" cy="31.5" r="0.5" fill="white"/>
      <circle cx="43.3" cy="31.5" r="0.5" fill="white"/>
      <polygon points="40,34 38,36 42,36" fill="#F59E0B"/>
      <path d="M30 40 Q40 37 50 40 L51 46 Q40 44 29 46Z" fill="#334155"/>
      <ellipse cx="24" cy="52" rx="6" ry="3.5" fill="#1E293B" transform="rotate(-30 24 52)"/>
      <ellipse cx="56" cy="52" rx="6" ry="3.5" fill="#1E293B" transform="rotate(30 56 52)"/>
    </svg>
  );
}
