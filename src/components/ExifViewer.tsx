import React, { useState, useEffect } from 'react';
import { Camera, FileSearch, Trash2, Download, Info, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

export const ExifViewer = () => {
    const { lang } = useLanguage();
    
    // Dynamic ExifReader loading
    const [ExifReader, setExifReader] = useState<any>(null);

    const faqs = [
        {
            question: {
                en: 'What EXIF data can be viewed?',
                zh: '可以查看哪些 EXIF 数据？'
            },
            answer: {
                en: 'You can view camera model, lens information, GPS location, date/time, ISO, exposure settings, and more metadata embedded in your photos.',
                zh: '您可以查看相机型号、镜头信息、GPS 位置、日期/时间、ISO、曝光设置以及嵌入在照片中的更多元数据。'
            }
        },
        {
            question: {
                en: 'How does EXIF stripping work?',
                zh: 'EXIF 清除是如何工作的？'
            },
            answer: {
                en: 'Stripping re-renders the image without the metadata. This removes all hidden tags while preserving the visual content.',
                zh: '清除会重新渲染图像而不包含元数据。这会移除所有隐藏标签，同时保留视觉内容。'
            }
        },
        {
            question: {
                en: 'Is my photo data private?',
                zh: '我的照片数据是否私密？'
            },
            answer: {
                en: 'Yes, all processing happens locally in your browser. Your photos are never uploaded to any server.',
                zh: '是的，所有处理完全在您的浏览器中进行。您的照片永远不会上传到任何服务器。'
            }
        }
    ];
    
    useEffect(() => {
        let mounted = true;
        const loadExifReader = async () => {
            try {
                const module = await import('exifreader');
                if (mounted) {
                    setExifReader(module.default);
                }
            } catch (error) {
                console.error('Failed to load exifreader:', error);
            }
        };
        loadExifReader();
        return () => { mounted = false; };
    }, []);
    
    const [metadata, setMetadata] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ExifReader) {
            alert(lang === 'zh' ? 'EXIF 读取库正在加载中，请稍后...' : 'EXIF reader library is loading, please wait...');
            return;
        }

        setIsLoading(true);
        setImagePreview(URL.createObjectURL(file));

        try {
            const tags = await ExifReader.load(file);
            setMetadata(tags);
        } catch (error) {
            console.error('Error reading EXIF:', error);
            setMetadata({});
        } finally {
            setIsLoading(false);
        }
    };

    const stripExif = () => {
        // In a pure client-side environment, stripping EXIF reliably without a heavy canvas re-draw 
        // can be done by drawing to a canvas and exporting as a simple blob.
        if (!imagePreview) return;
        
        const img = new Image();
        img.src = imagePreview;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `stripped_${Date.now()}.jpg`;
                        a.click();
                    }
                }, 'image/jpeg', 0.9);
            }
        };
    };

    const renderTag = (label: string, value: any) => {
        if (!value) return null;
        const displayValue = value.description || value.toString();
        
        return (
            <div key={label} className="flex justify-between py-2 border-b border-border-site/30 last:border-0 hover:bg-primary/5 transition-colors px-2 rounded">
                <span className="text-xs font-bold text-text-site/50 uppercase tracking-tight">{label}</span>
                <span className="text-xs font-medium text-text-site/80 text-right max-w-[60%] break-words">{displayValue}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {lang === 'zh'
                        ? 'EXIF 元数据查看器可以帮助您查看图片中隐藏的详细信息，包括相机型号、拍摄参数、GPS 位置、拍摄时间等。这些信息对于摄影师了解拍摄条件、保护隐私（移除位置信息）以及验证图片真实性非常有用。工具还提供一键清除 EXIF 功能，帮助您在分享图片前移除敏感信息。所有处理都在浏览器本地完成，确保您的图片数据安全。'
                        : 'The EXIF metadata viewer helps you view detailed information hidden in images, including camera model, shooting parameters, GPS location, capture time, and more. This information is useful for photographers to understand shooting conditions, protect privacy (remove location information), and verify image authenticity. The tool also provides one-click EXIF removal to help you remove sensitive information before sharing images. All processing is done locally in your browser, ensuring your image data security.'}
                </p>
            </div>

            <div className="bg-card-bg rounded-3xl p-8 border border-border-site shadow-xl">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-site rounded-2xl p-12 hover:border-primary/50 transition-colors cursor-pointer relative group">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-text-site">
                            {lang === 'zh' ? '上传图片查看元数据' : 'Upload Image to View Metadata'}
                        </p>
                        <p className="text-xs text-text-site/40 mt-2">
                            {lang === 'zh' ? '支持 JPG, PNG, WEBP, TIFF' : 'Supports JPG, PNG, WEBP, TIFF'}
                        </p>
                    </div>
                </div>

                {imagePreview && (
                    <div className="mt-8 grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-4">
                            <div className="aspect-square rounded-2xl overflow-hidden border border-border-site bg-secondary-site flex items-center justify-center p-2">
                                <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-lg" />
                            </div>
                            <button 
                                onClick={stripExif}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
                            >
                                <Trash2 className="w-5 h-5" />
                                {lang === 'zh' ? '清除隐私数据并下载' : 'Strip EXIF & Download'}
                            </button>
                            <p className="text-[10px] text-center text-text-site/40 italic">
                                {lang === 'zh' ? '* 清除操作将通过重新渲染图像来抹除所有隐藏标签。' : '* Stripping will re-render the image to remove all hidden tags.'}
                            </p>
                        </div>

                        <div className="bg-secondary-site rounded-2xl p-6 border border-border-site overflow-hidden">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-site">
                                <FileSearch className="w-5 h-5 text-primary" />
                                <h3 className="font-bold uppercase tracking-widest text-sm">
                                    {lang === 'zh' ? '元数据详情' : 'Metadata Details'}
                                </h3>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    <p className="text-xs font-mono opacity-50 uppercase tracking-widest">Analyzing...</p>
                                </div>
                            ) : metadata ? (
                                <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {Object.keys(metadata).length > 0 ? (
                                        <>
                                            {renderTag('Model', metadata.Model)}
                                            {renderTag('Make', metadata.Make)}
                                            {renderTag('Exposure', metadata.ExposureTime)}
                                            {renderTag('F-Number', metadata.FNumber)}
                                            {renderTag('ISO', metadata.ISOSpeedRatings)}
                                            {renderTag('Lens', metadata.LensModel)}
                                            {renderTag('DateTime', metadata.DateTimeOriginal || metadata.DateTime)}
                                            {renderTag('Software', metadata.Software)}
                                            {renderTag('GPS Latitude', metadata.GPSLatitude)}
                                            {renderTag('GPS Longitude', metadata.GPSLongitude)}
                                            {renderTag('Width', metadata['Image Width'])}
                                            {renderTag('Height', metadata['Image Height'])}
                                            {/* Render other important tags if available */}
                                            {Object.entries(metadata).map(([key, val]) => {
                                                if (['Model', 'Make', 'ExposureTime', 'FNumber', 'ISOSpeedRatings', 'LensModel', 'DateTimeOriginal', 'DateTime', 'Software', 'GPSLatitude', 'GPSLongitude', 'Image Width', 'Image Height'].includes(key)) return null;
                                                // Only show standard tags
                                                if (key.length > 20) return null;
                                                return renderTag(key, val);
                                            })}
                                        </>
                                    ) : (
                                        <div className="text-center py-12 text-text-site/40">
                                            <Info className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs uppercase font-bold tracking-widest">No EXIF data found</p>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
