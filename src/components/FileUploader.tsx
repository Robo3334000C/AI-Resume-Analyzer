import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, UploadCloud, CheckCircle2 } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface FileUploaderProps {
    file: File | null;
    setFile: (file: File | null) => void;
    accent?: 'primary' | 'emerald' | 'stitch';
}

const FileUploader: React.FC<FileUploaderProps> = ({ file, setFile, accent = 'primary' }) => {
    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            toast.error(fileRejections[0].errors[0].message);
            return;
        }

        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, [setFile]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: 20971520, // 20MB
        maxFiles: 1,
        multiple: false,
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
    };

    const isEmerald = accent === 'emerald';
    const isStitch = accent === 'stitch';

    if (file) {
        return (
            <div className={cn(
                "w-full p-8 border rounded-[2rem] flex items-center justify-between transition-all duration-300 shadow-inner",
                isStitch ? "glass-card border-stitch-outline/20" : isEmerald ? "bg-emerald-950/20 border-emerald-500/20" : "bg-primary/10 border-primary/20"
            )}>
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "p-4 rounded-2xl shadow-inner border",
                        isStitch ? "bg-stitch-surface/60 border-stitch-outline/20" : isEmerald ? "bg-emerald-950/40 border-white/5" : "bg-surface-highest border-white/5"
                    )}>
                        <FileText className={cn("w-8 h-8", isStitch ? "text-stitch-primary font-black" : isEmerald ? "text-emerald-400" : "text-primary")} />
                    </div>
                    <div className="flex flex-col flex-1 truncate">
                        <span className="font-black text-on-background truncate max-w-[200px] sm:max-w-[400px]">
                            {file.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-on-surface-variant/40 font-black uppercase tracking-widest">{formatBytes(file.size)}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-on-background/10" />
                            <span className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5", isStitch ? "text-stitch-primary" : isEmerald ? "text-emerald-400" : "text-primary")}>
                                <CheckCircle2 className="w-4 h-4" /> Ready for Scan
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={removeFile}
                    className="p-3 hover:bg-red-500/10 rounded-2xl text-on-surface-variant/40 hover:text-red-400 transition-all active:scale-95 border border-transparent hover:border-red-500/20"
                    title="Remove file"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "w-full p-12 flex flex-col items-center justify-center border border-dashed rounded-[2.5rem] cursor-pointer transition-all duration-500 relative overflow-hidden group shadow-inner",
                isDragActive && !isDragReject
                    ? (isStitch ? "border-stitch-primary bg-stitch-primary/10 scale-[0.99]" : isEmerald ? "border-emerald-500 bg-emerald-500/10" : "border-primary bg-primary/10")
                    : (isStitch
                        ? "glass-card border-stitch-outline/20 hover:border-stitch-primary hover:shadow-[0_0_40px_rgba(var(--stitch-primary-rgb),0.1)]"
                        : isEmerald 
                            ? "border-border/10 bg-surface hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                            : "border-border/10 bg-surface-lowest hover:bg-surface-low hover:border-primary/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"),
                isDragReject && "border-red-500 bg-red-500/10"
            )}
        >
            <input {...getInputProps()} />

            <AnimatePresence>
                {isDragActive && !isDragReject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                            "absolute inset-0 border border-white/20 rounded-[2.5rem] pointer-events-none shadow-inner",
                            isStitch ? "bg-stitch-primary/5" : isEmerald ? "bg-emerald-500/5" : "bg-primary/5"
                        )}
                    />
                )}
            </AnimatePresence>

            <motion.div 
                animate={isDragActive ? { y: -10 } : { y: 0 }}
                className={cn(
                    "p-6 border border-white/50 rounded-3xl shadow-xl mb-6 group-hover:scale-110 transition-transform duration-700 relative z-10",
                    isStitch ? "bg-stitch-surface/60" : "bg-surface-highest"
                )}
            >
                <UploadCloud className={cn("w-12 h-12", isDragReject ? "text-red-400" : (isStitch ? "text-stitch-primary" : isEmerald ? "text-emerald-400" : "text-primary"))} />
            </motion.div>
            <p className="text-2xl font-black text-on-background mb-2 tracking-tighter">
                {isDragActive
                    ? (isDragReject ? "Only PDF files, please!" : "Synthesizing...")
                    : "Upload your Resume"}
            </p>
            <p className="text-on-surface-variant/60 font-medium text-center">
                Drag and drop your PDF file or <span className={cn("font-black italic", isStitch ? "text-stitch-primary" : isEmerald ? "text-emerald-400" : "text-primary")}>browse storage</span>
            </p>

            <div className="mt-10 flex gap-4 relative z-10">
                <div className="px-5 py-2 bg-on-background/5 border border-on-background/10 text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] rounded-full shadow-inner">PDF Secure</div>
                <div className="px-5 py-2 bg-on-background/5 border border-on-background/10 text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] rounded-full shadow-inner">Max 20MB</div>
            </div>
        </div>
    );
};

export default FileUploader;
