import React, { useState } from 'react';
import { Property } from '../types/index.js';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (property: Partial<Property>) => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('450000');
  const [location, setLocation] = useState('Rebero District, Kigali');
  const [district, setDistrict] = useState('Rebero');
  const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial' | 'Investment' | 'Land'>('Residential');
  const [beds, setBeds] = useState('4');
  const [baths, setBaths] = useState('3');
  const [areaSqMeters, setAreaSqMeters] = useState('380');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSubmit({
      title,
      price: Number(price),
      location,
      district,
      propertyType,
      beds: propertyType !== 'Land' ? Number(beds) : undefined,
      baths: propertyType !== 'Land' ? Number(baths) : undefined,
      areaSqMeters: Number(areaSqMeters),
      description,
      imageUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-property-title"
        className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden"
      >
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/40">
          <div>
            <h2 id="add-property-title" className="font-headline font-bold text-xl text-on-surface">
              Add New Listing
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Submit your property to Emma &amp; Dany's curated Rwandan portfolio
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
              Property Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kigali View Heights"
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                Asking Price (USD) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                Property Category
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface"
              >
                <option value="Residential">Residential Villa/Apartment</option>
                <option value="Land">Land / Commercial Plot</option>
                <option value="Commercial">Commercial Office/Plaza</option>
                <option value="Investment">Investment Hospitality</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                Location Address
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Rebero District, Kigali"
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                District / Zone
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface"
              >
                <option value="Rebero">Rebero</option>
                <option value="Nyarutarama">Nyarutarama</option>
                <option value="Kacyiru">Kacyiru</option>
                <option value="Gacuriro">Gacuriro</option>
                <option value="Kibagabaga">Kibagabaga</option>
                <option value="Bugesera">Bugesera SEZ</option>
                <option value="Kiyovu">Kiyovu</option>
                <option value="Rubavu">Rubavu / Lake Kivu</option>
              </select>
            </div>
          </div>

          {propertyType !== 'Land' && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={baths}
                  onChange={(e) => setBaths(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1">
                  Area (m²)
                </label>
                <input
                  type="number"
                  value={areaSqMeters}
                  onChange={(e) => setAreaSqMeters(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
              Architectural Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight sustainable materials, elevation, panoramic views, security, or rental yield..."
              className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-outline-variant/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
              Submit Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
