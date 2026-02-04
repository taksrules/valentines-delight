import { motion } from 'framer-motion';
import { useBuilderStore, type Photo } from '@/stores/builderStore';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ShimmerImage } from '@/components/ui/Loader';

export default function Step5Settings() {
  const {
    recipientName,
    creatorName,
    musicEnabled,
    musicMood,
    uniqueSlug,
    successPhoto,
    allowSharing,
    setMusicEnabled,
    setMusicMood,
    setUniqueSlug,
    setSuccessPhoto,
    setAllowSharing,
  } = useBuilderStore();

  const [generatedSlug, setGeneratedSlug] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (recipientName) {
      const slug = generateSlug(recipientName);
      setGeneratedSlug(slug);
      if (!uniqueSlug) {
        setUniqueSlug(slug);
      }
    }
  }, [recipientName, uniqueSlug, setUniqueSlug]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo is too large. Max 5MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/photos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      const photo: Photo = {
        imageUrl: data.data.url,
        caption: 'Success Photo',
        previewUrl,
      };

      setSuccessPhoto(photo);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload success photo');
      URL.revokeObjectURL(previewUrl);
    } finally {
      setIsUploading(false);
    }
  }, [setSuccessPhoto]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const musicMoods = [
    { value: 'romantic', label: 'Romantic', icon: '💕', description: 'Soft, loving melodies' },
    { value: 'playful', label: 'Playful', icon: '🎵', description: 'Upbeat and fun' },
    { value: 'nostalgic', label: 'Nostalgic', icon: '🎹', description: 'Sentimental and warm' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          Final Settings
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          Add the finishing touches to your journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          {/* Music Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
          >
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              🎵 Background Music
            </h3>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Enable music
                </p>
              </div>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  musicEnabled ? 'bg-rose-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    musicEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {musicEnabled && (
              <div className="grid grid-cols-3 gap-2">
                {musicMoods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setMusicMood(mood.value)}
                    className={`p-2 rounded-lg border-2 text-center transition-all ${
                      musicMood === mood.value
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                        : 'border-neutral-100 dark:border-neutral-800'
                    }`}
                  >
                    <div className="text-xl mb-1">{mood.icon}</div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{mood.label}</div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Journey Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
          >
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              🔗 Share Link
            </h3>

            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-xs truncate">
                  tenderly.space/j/{generatedSlug}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://www.tenderly.space/j/${generatedSlug}`);
                  }}
                  className="p-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 p-3 bg-rose-50 dark:bg-rose-500/5 rounded-lg border border-rose-100 dark:border-rose-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xl">📸</span>
                <div>
                  <p className="font-medium text-xs text-neutral-900 dark:text-neutral-100">
                    Allow partner to share
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Partner can save high-res moments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAllowSharing(!allowSharing)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors flex-shrink-0 ${
                  allowSharing ? 'bg-rose-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    allowSharing ? 'translate-x-[22px]' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => {
                const journeyId = useBuilderStore.getState().journeyId;
                if (journeyId) window.open(`/create/preview?id=${journeyId}`, '_blank');
                else alert('Please save your journey first');
              }}
              className="w-full px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Preview Journey
            </button>
          </motion.div>
        </div>

        {/* Success Photo Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">😊</span>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              The Grand Finale
            </h3>
          </div>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Upload a smiling picture of yourself! This will be shown to {recipientName || 'them'} in a beautiful frame the second they say <b>YES</b>.
          </p>

          <div
            {...getRootProps()}
            className={`relative aspect-[4/5] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
              isDragActive
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-rose-400 dark:hover:border-rose-700'
            }`}
          >
            <input {...getInputProps()} />
            
            {successPhoto ? (
              <>
                <ShimmerImage
                  src={successPhoto.previewUrl || successPhoto.imageUrl}
                  alt="Success photo"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">Click to change</p>
                </div>
              </>
            ) : isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs text-neutral-500">Uploading...</p>
              </div>
            ) : (
              <div className="text-center p-4">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Add your smiling face
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  JPEG, PNG, or WebP • Max 5MB
                </p>
              </div>
            )}
          </div>

          {successPhoto && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSuccessPhoto(null);
              }}
              className="mt-4 w-full text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Remove photo
            </button>
          )}
        </motion.div>
      </div>

      {/* Pro Features Badge */}
      <div className="mt-8 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-600 flex items-center justify-center gap-1">
          <span className="w-1 h-1 bg-neutral-400 rounded-full" />
          Pro features coming soon after launch
          <span className="w-1 h-1 bg-neutral-400 rounded-full" />
        </p>
      </div>
    </div>
  );
}

// Slug generation helper
function generateSlug(recipientName: string): string {
  const name = recipientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `${name}-val-${random}`;
}
