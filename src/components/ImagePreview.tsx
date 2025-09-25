'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  images: string[];
  propertyName: string;
}

export default function ImagePreview({ images, propertyName }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  // Focus the modal when it opens for keyboard navigation
  useEffect(() => {
    if (isOpen) {
      const modal = document.getElementById('image-modal');
      if (modal) {
        modal.focus();
      }
    }
  }, [isOpen]);

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-8">
        {/* Main Property Image */}
        <div 
          className="relative rounded-lg overflow-hidden h-96 cursor-pointer group"
          onClick={() => openModal(0)}
        >
          <Image
            src={images[0]}
            alt={`${propertyName} - Main view`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            priority
          />
        </div>
        
        {/* Additional Property Images */}
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => {
            const roomTypes = ['Bedroom', 'Living Area', 'Kitchen', 'Bathroom'];
            const actualIndex = index + 1;
            return (
              <div 
                key={actualIndex} 
                className="relative rounded-lg overflow-hidden h-44 cursor-pointer group"
                onClick={() => openModal(actualIndex)}
              >
                <Image
                  src={image}
                  alt={`${propertyName} - ${roomTypes[index] || 'Interior'}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div 
          id="image-modal"
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
            onClick={closeModal}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Main Image */}
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <Image
              src={images[currentIndex]}
              alt={`${propertyName} - Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] rounded-lg"
              priority
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-opacity ${
                    index === currentIndex ? 'opacity-100 ring-2 ring-white' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
