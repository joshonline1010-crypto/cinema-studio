import { useState, useEffect, useRef } from 'react';

interface PreferencesPanelProps {
  userId: string;
}

interface CharacterRef {
  url: string;
  name: string;
  uploaded: string;
}

interface BackgroundRef {
  url: string;
  name: string;
  uploaded: string;
}

interface StylePreset {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface CreativePreferences {
  character_ref?: CharacterRef;
  background_ref?: BackgroundRef;
  style_preset?: StylePreset;
}

interface StyleCategory {
  id: string;
  name: string;
  description: string;
  styles: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    tags: string[];
  }>;
}

export default function PreferencesPanel({ userId }: PreferencesPanelProps) {
  const [preferences, setPreferences] = useState<CreativePreferences>({});
  const [styleCategories, setStyleCategories] = useState<StyleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState<'character' | 'background' | null>(null);

  const charInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPreferences();
    fetchStyles();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/preferences', { credentials: 'include' });
      const data = await res.json();
      setPreferences(data.preferences || {});
    } catch (e) {
      console.error('Failed to load preferences:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStyles = async () => {
    try {
      const res = await fetch('/api/styles', { credentials: 'include' });
      const data = await res.json();
      setStyleCategories(data.categories || []);
    } catch (e) {
      console.error('Failed to load styles:', e);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
        credentials: 'include'
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Preferences saved!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (type: 'character' | 'background', file: File) => {
    setUploading(type);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('refType', type);
      formData.append('name', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/preferences/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setPreferences(prev => ({
          ...prev,
          [type === 'character' ? 'character_ref' : 'background_ref']: data.ref
        }));
        setMessage({ type: 'success', text: `${type === 'character' ? 'Character' : 'Background'} updated!` });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally {
      setUploading(null);
    }
  };

  const handleStyleChange = (styleId: string) => {
    // Find the style in categories
    for (const category of styleCategories) {
      const style = category.styles.find(s => s.id === styleId);
      if (style) {
        setPreferences(prev => ({
          ...prev,
          style_preset: {
            id: style.id,
            name: style.name,
            category: style.category,
            description: style.description
          }
        }));
        break;
      }
    }
  };

  const removeRef = (type: 'character' | 'background') => {
    setPreferences(prev => {
      const updated = { ...prev };
      if (type === 'character') {
        delete updated.character_ref;
      } else {
        delete updated.background_ref;
      }
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="bg-vs-card border border-vs-border rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-vs-card border border-vs-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">Creative Preferences</h2>
        {message && (
          <span className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message.text}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Character Reference */}
        <div>
          <label className="block text-sm text-white/70 mb-3">Character Reference</label>
          <div className="flex items-start gap-4">
            <div
              className="w-24 h-24 bg-vs-dark border border-vs-border rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:border-violet-500 transition-colors relative group"
              onClick={() => charInputRef.current?.click()}
            >
              {preferences.character_ref?.url ? (
                <>
                  <img
                    src={preferences.character_ref.url}
                    alt="Character"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs">Change</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
              {uploading === 'character' && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input
              ref={charInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload('character', file);
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {preferences.character_ref?.name || 'No character set'}
              </p>
              {preferences.character_ref?.url && (
                <>
                  <p className="text-xs text-white/40 truncate mt-1">
                    {preferences.character_ref.url.length > 40
                      ? '...' + preferences.character_ref.url.slice(-37)
                      : preferences.character_ref.url}
                  </p>
                  <button
                    onClick={() => removeRef('character')}
                    className="text-xs text-red-400 hover:text-red-300 mt-2"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Background Reference */}
        <div>
          <label className="block text-sm text-white/70 mb-3">Background Reference</label>
          <div className="flex items-start gap-4">
            <div
              className="w-32 h-20 bg-vs-dark border border-vs-border rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:border-violet-500 transition-colors relative group"
              onClick={() => bgInputRef.current?.click()}
            >
              {preferences.background_ref?.url ? (
                <>
                  <img
                    src={preferences.background_ref.url}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs">Change</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
              {uploading === 'background' && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input
              ref={bgInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload('background', file);
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {preferences.background_ref?.name || 'No background set'}
              </p>
              {preferences.background_ref?.url && (
                <>
                  <p className="text-xs text-white/40 truncate mt-1">
                    {preferences.background_ref.url.length > 40
                      ? '...' + preferences.background_ref.url.slice(-37)
                      : preferences.background_ref.url}
                  </p>
                  <button
                    onClick={() => removeRef('background')}
                    className="text-xs text-red-400 hover:text-red-300 mt-2"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Style Preset */}
        <div>
          <label className="block text-sm text-white/70 mb-3">Prompt Style</label>
          <select
            value={preferences.style_preset?.id || ''}
            onChange={(e) => handleStyleChange(e.target.value)}
            className="w-full px-4 py-3 bg-vs-dark border border-vs-border rounded-lg text-white focus:border-violet-500 focus:outline-none"
          >
            <option value="">Select a style...</option>
            {styleCategories.map(category => (
              <optgroup key={category.id} label={category.name}>
                {category.styles.map(style => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {preferences.style_preset && (
            <div className="mt-3 p-3 bg-vs-dark rounded-lg">
              <p className="text-sm font-medium text-violet-400">{preferences.style_preset.name}</p>
              {preferences.style_preset.description && (
                <p className="text-xs text-white/60 mt-1 line-clamp-2">
                  {preferences.style_preset.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-vs-border">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="w-full px-4 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </button>
          <p className="text-xs text-white/40 text-center mt-3">
            These preferences will be automatically applied to all your generations
          </p>
        </div>
      </div>
    </div>
  );
}
