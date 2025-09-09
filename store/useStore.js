import { create } from 'zustand';

/**
 * Global application store using zustand. It holds state for
 * avatar customisation as well as the idle mode toggle.
 */
const useStore = create((set) => ({
  avatar: {
    bodyType: 'medium',
    hairColor: '#734d26',
    skinTone: '#f6d7b0',
    accessory: 'none',
  },
  idleMode: false,
  setAvatarProp: (prop, value) => set((state) => ({
    avatar: {
      ...state.avatar,
      [prop]: value,
    },
  })),
  toggleIdleMode: () => set((state) => ({ idleMode: !state.idleMode })),
}));
export default useStore;
