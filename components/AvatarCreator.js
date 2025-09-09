"use client";
import React from 'react';
import useStore from '../store/useStore';

// AvatarCreator: controls for avatar and idle mode
export default function AvatarCreator() {
  const avatar = useStore((state) => state.avatar);
  const setAvatarProp = useStore((state) => state.setAvatarProp);
  const idleMode = useStore((state) => state.idleMode);
  const toggleIdleMode = useStore((state) => state.toggleIdleMode);
  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Avatar</h3>
      <div>
        <label htmlFor="bodyType">Body type </label>
        <select
          id="bodyType"
          value={avatar.bodyType}
          onChange={e => setAvatarProp('bodyType', e.target.value)}
        >
          <option value="slim">Slim</option>
          <option value="medium">Medium</option>
          <option value="full">Full</option>
        </select>
      </div>
      <div>
        <label htmlFor="hairColor">Hair colour </label>
        <input
          id="hairColor"
          type="color"
          value={avatar.hairColor}
          onChange={e => setAvatarProp('hairColor', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="skinTone">Skin tone </label>
        <input
          id="skinTone"
          type="color"
          value={avatar.skinTone}
          onChange={e => setAvatarProp('skinTone', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="accessory">Accessory </label>
        <select
          id="accessory"
          value={avatar.accessory}
          onChange={e => setAvatarProp('accessory', e.target.value)}
        >
          <option value="none">None</option>
          <option value="hat">Hat</option>
        </select>
      </div>
      <h4>Settings</h4>
      <label>
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
