'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore, type Photo } from '@/stores/builderStore';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ShimmerImage } from '@/components/ui/Loader';
import { showError, showWarning } from '@/lib/notifications';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy, // Changed from verticalListSortingStrategy for grid layout
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Step4Photos() {
  const { photos, addPhoto, updatePhoto, removePhoto, reorderPhotos } = useBuilderStore();
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((p) => p.id === active.id);
      const newIndex = photos.findIndex((p) => p.id === over.id);
      
      console.log('Drag end:', { activeId: active.id, overId: over.id, oldIndex, newIndex });
      
      if (oldIndex !== -1 && newIndex !== -1) {
        console.log('Reordering photos from', oldIndex, 'to', newIndex);
        reorderPhotos(oldIndex, newIndex);
      }
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (photos.length >= 6) {
        showWarning('Photo limit reached', 'Maximum 6 photos allowed per journey.');
        break;
      }

      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        showError('File too large', `${file.name} is larger than the 5MB limit.`);
        continue;
      }

      // Create unique ID for this upload attempt
      const uploadId = Math.random().toString(36).substring(7);
      const previewUrl = URL.createObjectURL(file);

      setUploadingFiles(prev => [...prev, uploadId]);

      try {
        // Upload to Supabase Storage
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

        // Add to store with BOTH preview URL (for display) and Supabase URL (for saving)
        const photo: Photo = {
          imageUrl: data.data.url, // Supabase URL for database
          caption: '',
          fileSize: data.data.size,
          mimeType: data.data.type,
          previewUrl, // Local preview for immediate display
        };

        addPhoto(photo);
      } catch (error) {
        console.error('Upload error:', error);
        showError('Upload failed', `We couldn't upload ${file.name}. Please try again.`);
        // Clean up preview URL on error
        URL.revokeObjectURL(previewUrl);
      } finally {
        setUploadingFiles(prev => prev.filter(id => id !== uploadId));
      }
    }
  }, [photos, addPhoto]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          Add Your Photos
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          Upload 4-6 photos to bring your journey to life
        </p>
      </div>

      {/* Requirement Banner */}
      <AnimatePresence>
        {photos.length < 4 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-900/30 rounded-xl p-4 flex items-center gap-3">
              <div className="text-2xl animate-pulse">✨</div>
              <div className="flex-1 text-sm md:text-base font-medium text-rose-800 dark:text-rose-300">
                Almost there! You need <span className="font-bold underline">{4 - photos.length} more</span> {4 - photos.length === 1 ? 'photo' : 'photos'} to complete your journey.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Zone */}
      {photos.length < 6 && (
        <div
          {...getRootProps()}
          className={`mb-6 p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragActive
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-rose-500 dark:hover:border-rose-500 bg-white dark:bg-neutral-900'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {isDragActive ? 'Drop your photos here' : 'Add Your Special Moments'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Drag & drop or click to browse
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className={`px-3 py-1 rounded-full font-bold ${photos.length >= 4 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                {photos.length}/6 photos
              </span>
              <span className="text-neutral-500 dark:text-neutral-500">
                (Min 4 required)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Photo Grid with Drag and Drop */}
      {photos.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos.map((p) => p.id as string)}
            strategy={rectSortingStrategy}
          >
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
            >
              <AnimatePresence mode="popLayout">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SortablePhotoCard
                      id={photo.id as string}
                      photo={photo}
                      index={index}
                      onUpdateCaption={(caption) => updatePhoto(index, { caption })}
                      onRemove={() => removePhoto(index)}
                    />
                  </motion.div>
                ))}
                
                {/* Uploading Placeholders */}
                {uploadingFiles.map((id) => (
                  <motion.div 
                    key={id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center p-4 overflow-hidden relative"
                  >
                    <div className="shimmer absolute inset-0 opacity-50" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Uploading...</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </SortableContext>
        </DndContext>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-neutral-500 dark:text-neutral-400"
        >
          <div className="text-6xl mb-4">🖼️</div>
          <p>No photos yet. Upload your first photo to get started!</p>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <div className="flex gap-3">
          <div className="text-xl">💡</div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Choose photos that match your questions and tell your story</li>
              <li>• Add captions to give context to each photo</li>
              <li>• Drag the handle icon to reorder photos</li>
              <li>• High-quality photos work best (but we'll optimize them)</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Sortable Photo Card Component
function SortablePhotoCard({
  id,
  photo,
  index,
  onUpdateCaption,
  onRemove,
}: {
  id: string;
  photo: Photo;
  index: number;
  onUpdateCaption: (caption: string) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [caption, setCaption] = useState(photo.caption);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleBlur = () => {
    if (caption !== photo.caption) {
      setIsSyncing(true);
      onUpdateCaption(caption);
      // Brief delay to show syncing state for feedback
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden group/card shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
        <ShimmerImage
          src={photo.previewUrl || photo.imageUrl}
          alt={photo.caption || `Photo ${index + 1}`}
          fill
          className="object-cover"
        />
        
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 w-10 h-10 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors opacity-0 group-hover/card:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg opacity-0 group-hover/card:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Photo Number */}
        <div className="absolute bottom-2 left-2 w-8 h-8 bg-neutral-900/80 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
          {index + 1}
        </div>

        {/* Syncing Indicator */}
        {isSyncing && (
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="p-3 bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="Write a sweet caption..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:bg-white dark:focus:bg-neutral-950 focus:border-rose-300 dark:focus:border-rose-900 focus:ring-0 focus:outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
        />
      </div>
    </div>
  );
}
