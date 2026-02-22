export interface EasingOption {
  value: string;
  label: string;
}

export const EASING_OPTIONS: EasingOption[] = [
  { value: 'none', label: 'Linear' },
  { value: 'power1.in', label: 'Power1 In' },
  { value: 'power1.out', label: 'Power1 Out' },
  { value: 'power1.inOut', label: 'Power1 InOut' },
  { value: 'power2.in', label: 'Power2 In' },
  { value: 'power2.out', label: 'Power2 Out' },
  { value: 'power2.inOut', label: 'Power2 InOut' },
  { value: 'power3.in', label: 'Power3 In' },
  { value: 'power3.out', label: 'Power3 Out' },
  { value: 'power3.inOut', label: 'Power3 InOut' },
  { value: 'power4.in', label: 'Power4 In' },
  { value: 'power4.out', label: 'Power4 Out' },
  { value: 'power4.inOut', label: 'Power4 InOut' },
  { value: 'back.in(1.7)', label: 'Back In' },
  { value: 'back.out(1.7)', label: 'Back Out' },
  { value: 'back.inOut(1.7)', label: 'Back InOut' },
  { value: 'elastic.in(1, 0.3)', label: 'Elastic In' },
  { value: 'elastic.out(1, 0.3)', label: 'Elastic Out' },
  { value: 'elastic.inOut(1, 0.3)', label: 'Elastic InOut' },
  { value: 'bounce.in', label: 'Bounce In' },
  { value: 'bounce.out', label: 'Bounce Out' },
  { value: 'bounce.inOut', label: 'Bounce InOut' },
  { value: 'circ.in', label: 'Circ In' },
  { value: 'circ.out', label: 'Circ Out' },
  { value: 'circ.inOut', label: 'Circ InOut' },
  { value: 'expo.in', label: 'Expo In' },
  { value: 'expo.out', label: 'Expo Out' },
  { value: 'expo.inOut', label: 'Expo InOut' },
  { value: 'sine.in', label: 'Sine In' },
  { value: 'sine.out', label: 'Sine Out' },
  { value: 'sine.inOut', label: 'Sine InOut' },
];
