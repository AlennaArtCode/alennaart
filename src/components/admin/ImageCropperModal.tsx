import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropUtils';
import { X, Check } from 'lucide-react';

interface ImageCropperModalProps {
    imageSrc: string; // URL o base64 de la imagen seleccionada temporalmente
    isCover: boolean; // Bandera para saber si es portada o no, y aplicar lógicas visuales
    onCropComplete: (croppedBlob: Blob) => void; // Función callback cuando el usuario finaliza
    onCancel: () => void; // Función callback para cancelar proceso
}

export default function ImageCropperModal({ imageSrc, isCover, onCropComplete, onCancel }: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [cropShape, setCropShape] = useState<'rect' | 'round'>('rect');
    const [aspect, setAspect] = useState(1); // Default square

    const onCropChange = (crop: any) => {
        setCrop(crop);
    };

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedPixels: any) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const onZoomChange = (zoom: any) => {
        setZoom(zoom);
    };

    // --- PROCESAMIENTO DEL RECORTE ---
    // Función central que se llama al pulsar "Apply Crop". 
    // Toma las coordenadas y el nivel de zoom y delega a 'getCroppedImg' (tu herramienta de Canvas)
    // la generación de una nueva imagen Blob.
    const confirmCrop = async () => {
        try {
            if (croppedAreaPixels) {
                // extrae un archivo Blob puro, optimizado para subir a la nube
                const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
                if (croppedBlob) {
                    onCropComplete(croppedBlob); // Le regresa la imagen lista al proceso principal (`page.tsx`)
                }
            }
        } catch (e) {
            console.error(e);
            alert("Error cropping image");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-[#0A0510] border border-white/10 w-full max-w-3xl rounded-xl overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.1)] flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#050505]">
                    <h3 className="text-white font-serif text-xl">Crop Image {isCover ? '(Cover)' : ''}</h3>
                    <button onClick={onCancel} className="text-white/50 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative h-[500px] w-full bg-black/50">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        cropShape={cropShape}
                        showGrid={false}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                    />
                </div>

                {/* Controls */}
                <div className="p-6 bg-[#050505] border-t border-white/5 space-y-6">

                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                        {/* Zoom Slider */}
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/50">Zoom</label>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full accent-accent"
                            />
                        </div>

                        {/* Shape Settings */}
                        <div className="flex-1 w-full flex items-center justify-center gap-4">
                            <button
                                onClick={() => { setAspect(1); setCropShape('rect'); }}
                                className={`px-4 py-2 border rounded text-xs uppercase tracking-widest transition-all ${cropShape === 'rect' ? 'border-accent text-accent bg-accent/10' : 'border-white/20 text-white/50 hover:text-white'}`}
                            >
                                Square
                            </button>
                            <button
                                onClick={() => { setAspect(1); setCropShape('round'); }}
                                className={`px-4 py-2 border rounded-full text-xs uppercase tracking-widest transition-all ${cropShape === 'round' ? 'border-accent text-accent bg-accent/10' : 'border-white/20 text-white/50 hover:text-white'}`}
                            >
                                Round
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 border border-white/20 text-white rounded hover:bg-white/5 transition-colors uppercase text-xs tracking-widest font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmCrop}
                            className="px-6 py-2 bg-gradient-to-r from-accent to-[#8a6e35] text-black rounded uppercase text-xs tracking-widest font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform"
                        >
                            <Check size={16} /> Apply Crop
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
