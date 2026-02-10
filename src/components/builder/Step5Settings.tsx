import { motion } from 'framer-motion';
import { useBuilderStore, type Photo } from '@/stores/builderStore';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ShimmerImage } from '@/components/ui/Loader';
import { showError, showInfo } from '@/lib/notifications';
import RomanticLoader from '@/components/ui/RomanticLoader';

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
      showError('Photo is too large', 'Maximum file size is 5MB.');
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
      showError('Upload failed', 'We couldn\'t save your photo. Please try again.');
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

      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
      >
        <div className="space-y-6">
          {/* Music Settings */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
              <span className="text-2xl">🎵</span> Background Music
            </h3>

            <div className="flex items-center justify-between mb-8 p-4 bg-rose-50/50 dark:bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-900/20">
              <div>
                <p className="font-bold text-neutral-900 dark:text-neutral-100">
                  Enable Music
                </p>
                <p className="text-xs text-neutral-500">Add a romantic atmosphere</p>
              </div>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  musicEnabled ? 'bg-rose-500 shadow-inner' : 'bg-neutral-300 dark:bg-neutral-800'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    musicEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {musicEnabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-3 gap-2"
              >
                {musicMoods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setMusicMood(mood.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      musicMood === mood.value
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 shadow-sm'
                        : 'border-neutral-100 dark:border-neutral-800 hover:border-rose-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.icon}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                      {mood.label}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Journey Link */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
              <span className="text-2xl">🔗</span> Share Link
            </h3>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 font-mono text-xs truncate shadow-inner-sm">
                  tenderly.space/j/{generatedSlug}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://www.tenderly.space/j/${generatedSlug}`);
                    showInfo('Link copied! 📋');
                  }}
                  className="p-3 bg-neutral-200 dark:bg-neutral-800 rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 p-4 bg-rose-50/50 dark:bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-900/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                    Allow partner to share
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Partner can save high-res moments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAllowSharing(!allowSharing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  allowSharing ? 'bg-rose-500 shadow-inner' : 'bg-neutral-300 dark:bg-neutral-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    allowSharing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => {
                const journeyId = useBuilderStore.getState().journeyId;
                if (journeyId) window.open(`/create/preview?id=${journeyId}`, '_blank');
                else showInfo('Save required', 'Please save your journey before previewing.');
              }}
              className="w-full px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Preview Journey
            </button>
          </motion.div>
        </div>

        {/* Success Photo Section */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 20 },
            show: { opacity: 1, x: 0 }
          }}
          className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">😊</span>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 italic font-serif">
              The Grand Finale
            </h3>
          </div>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            Upload a smiling picture of yourself! This will be shown to <span className="text-rose-600 dark:text-rose-400 font-bold">{recipientName || 'them'}</span> in a beautiful frame the second they say <b>YES</b>.
          </p>

          <div
            {...getRootProps()}
            className={`relative aspect-[4/5] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group/upload ${
              isDragActive
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-rose-400 dark:hover:border-rose-700 bg-neutral-50/50 dark:bg-neutral-900/50'
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
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity backdrop-blur-sm">
                  <p className="text-white font-bold bg-white/20 px-4 py-2 rounded-full border border-white/40">Change Photo</p>
                </div>
              </>
            ) : isUploading ? (
              <div className="flex flex-col items-center">
                <RomanticLoader size="sm" message="Uploading..." />
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="text-6xl mb-4 grayscale group-hover/upload:grayscale-0 transition-all duration-500 scale-100 group-hover/upload:scale-110">📸</div>
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  Add your smiling face
                </p>
                <p className="text-xs text-neutral-500">
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
              className="mt-6 w-full text-xs text-red-500 hover:text-red-600 font-bold uppercase tracking-widest transition-colors"
            >
              Remove photo
            </button>
          )}
        </motion.div>
      </motion.div>

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
