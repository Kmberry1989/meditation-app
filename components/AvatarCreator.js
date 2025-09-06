import React from 'react';
import useStore from '../store/useStore';

/**
 * AvatarCreator component provides form controls for users to
 * personalise their avatar and toggle idle mode.  It writes to
 * zustand state so that changes are immediately reflected in the
 * Avatar component and environment.  Additional avatar properties
 * such as hair style or facial features can be added here.
 */
export default function AvatarCreator() {
  const avatar = useStore((state) => state.avatar);
  const setAvatarProp = useStore((state) => state.setAvatarProp);
  const idleMode = useStore((state) => state.idleMode);
  const toggleIdleMode = useStore((state) => state.toggleIdleMode);

  return (
    <div className="panel" style={{ maxWidth: '240px' }}>
      <h2>Avatar</h2>
      <label htmlFor="bodyType">Body type</label>
      <select
        id="bodyType"
        value={avatar.bodyType}
        onChange={(e) => setAvatarProp('bodyType', e.target.value)}
      >
        <option value="slim">Slim</option>
        <option value="medium">Medium</option>
        <option value="full">Full</option>
      </select>
      <label htmlFor="hairColor">Hair colour</label>
      <input
        id="hairColor"
        type="color"
        value={avatar.hairColor}
        onChange={(e) => setAvatarProp('hairColor', e.target.value)}
      />
      <label htmlFor="skinTone">Skin tone</label>
      <input
        id="skinTone"
        type="color"
        value={avatar.skinTone}
        onChange={(e) => setAvatarProp('skinTone', e.target.value)}
      />
      <label htmlFor="accessory">Accessory</label>
      <select
        id="accessory"
        value={avatar.accessory}
        onChange={(e) => setAvatarProp('accessory', e.target.value)}
      >
        <option value="none">None</option>
        <option value="hat">Hat</option>
      </select>
      <h2>Settings</h2>
      <label htmlFor="idleMode" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          id="idleMode"
          type="checkbox"
          checked={idleMode}
          onChange={toggleIdleMode}
          style={{ marginRight: '0.5rem' }}
        />
        Idle mode
      </label>
    </div>
  );
}