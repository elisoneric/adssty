import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import { ImageFile } from '../types';
import { Icon } from './Icon';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });


const ImageAnalyzer: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('Describe this image in detail.');
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                setError('File size must be less than 4MB.');
                return;
            }
            setError(null);
            setAnalysisResult(null);
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAnalyzeClick = async () => {
        if (!imageFile || !prompt.trim()) {
            setError('Please upload an image and provide a prompt.');
            return;
        }
        setError(null);
        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const base64Data = await fileToBase64(imageFile);
            const imageForApi: ImageFile = {
                mimeType: imageFile.type,
                data: base64Data,
            };
            const result = await analyzeImage(prompt, imageForApi);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('Failed to process image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Upload Image</h2>
                    
                    <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-300">
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400">
                            <Icon name="upload" className="w-12 h-12" />
                             <p className="text-lg font-semibold">
                                {imageFile ? imageFile.name : 'Click or drag to upload'}
                             </p>
                             <p className="text-xs">PNG, JPG, WEBP up to 4MB</p>
                        </div>
                    </div>
                    
                    {imagePreview && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Image Preview:</h3>
                            <img src={imagePreview} alt="Preview" className="w-full max-h-60 object-contain rounded-lg shadow-md" />
                        </div>
                    )}

                    <div className="mt-2">
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Question
                        </label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                            placeholder="e.g., What is in this image?"
                            className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    
                    <button
                        onClick={handleAnalyzeClick}
                        disabled={isLoading || !imageFile}
                        className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                           <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                           </>
                        ) : (
                           'Analyze Image'
                        )}
                    </button>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>

                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Analysis Result</h2>
                    <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                        {isLoading ? (
                             <div className="space-y-4">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 animate-pulse"></div>
                            </div>
                        ) : analysisResult ? (
                            <p style={{ whiteSpace: 'pre-wrap' }}>{analysisResult}</p>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">The analysis from Gemini will appear here once you upload an image and ask a question.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageAnalyzer;
