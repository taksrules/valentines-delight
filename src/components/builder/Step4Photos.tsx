'use client';

import { motion } from 'framer-motion';
import { useBuilderStore, type Photo } from '@/stores/builderStore';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ShimmerImage } from '@/components/ui/Loader';
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
      const oldIndex = photos.findIndex((_, i) => i.toString() === active.id);
      const newIndex = photos.findIndex((_, i) => i.toString() === over.id);
      
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
        alert('Maximum 6 photos allowed');
        break;
      }

      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max 5MB per photo.`);
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
        alert(`Failed to upload ${file.name}`);
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
              {isDragActive ? 'Drop your photos here' : 'Drag & drop photos here'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              or click to browse
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              JPEG, PNG, or WebP • Max 5MB each • {photos.length}/6 photos
            </p>
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
            items={photos.map((_, i) => i.toString())}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {photos.map((photo, index) => (
                <SortablePhotoCard
                  key={index}
                  id={index.toString()}
                  photo={photo}
                  index={index}
                  onUpdateCaption={(caption) => updatePhoto(index, { caption })}
                  onRemove={() => removePhoto(index)}
                />
              ))}
              
              {/* Uploading Placeholders */}
              {uploadingFiles.map((id) => (
                <div 
                  key={id}
                  className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center p-4 overflow-hidden relative"
                >
                  <div className="shimmer absolute inset-0 opacity-50" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Uploading...</p>
                  </div>
                </div>
              ))}
            </div>
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

  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(photo.caption);

  const handleSave = () => {
    onUpdateCaption(caption);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
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
          className="absolute top-2 left-2 w-10 h-10 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Photo Number */}
        <div className="absolute bottom-2 left-2 w-8 h-8 bg-neutral-900/80 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {index + 1}
        </div>
      </div>

      {/* Caption */}
      <div className="p-3">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:border-rose-500 focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-1.5 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setCaption(photo.caption);
                  setIsEditing(false);
                }}
                className="flex-1 px-3 py-1.5 text-sm bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {photo.caption || 'Add caption...'}
          </button>
        )}
      </div>
    </div>
  );
}
