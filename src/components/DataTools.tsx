import React, { useState } from 'react';
import { Database, FileJson, Table, Copy, Check, AlertCircle, Upload, Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import Papa from 'papaparse';
import { FAQ } from './FAQ';

export const DataConverter: React.FC = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [csv, setCsv] = useState('');
    const [json, setJson] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const faqs = [
        {
            question: {
                en: 'What data formats are supported?',
                zh: '支持哪些数据格式？'
            },
            answer: {
                en: 'We support CSV to JSON conversion and JSON to CSV conversion. Common for data migration and API integration.',
                zh: '我们支持 CSV 到 JSON 转换和 JSON 到 CSV 转换。常见于数据迁移和 API 集成。'
            }
        },
        {
            question: {
                en: 'How does the CSV parser work?',
                zh: 'CSV 解析器如何工作？'
            },
            answer: {
                en: 'We use PapaParse library for robust CSV parsing. It handles various CSV formats including quoted fields and custom delimiters.',
                zh: '我们使用 PapaParse 库进行强大的 CSV 解析。它处理各种 CSV 格式，包括引用字段和自定义分隔符。'
            }
        },
        {
            question: {
                en: 'Is my data sent to any server?',
                zh: '我的数据会发送到任何服务器吗？'
            },
            answer: {
                en: 'No, all conversion happens locally in your browser. Your data is never uploaded to any server.',
                zh: '不会，所有转换完全在您的浏览器中进行。您的数据永远不会上传到任何服务器。'
            }
        }
    ];

    const convert = () => {
        if (!csv) return;
        Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    setError(isZh ? '解析 CSV 失败，请检查格式' : 'Failed to parse CSV, check format');
                    setJson('');
                } else {
                    setJson(JSON.stringify(results.data, null, 2));
                    setError('');
                }
            }
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    setJson(JSON.stringify(results.data, null, 2));
                    setCsv(Papa.unparse(results.data));
                }
            });
        }
    };

    const copyJson = () => {
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJson = () => {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data-export.json';
        a.click();
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32xl] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? 'CSV 到 JSON 转换器可以将 CSV 格式的数据转换为 JSON 格式，支持文件上传和文本粘贴输入。自动识别表头，生成结构化的 JSON 数据。支持一键复制和下载转换结果。所有处理都在浏览器本地完成，保护您的数据隐私。适用于数据迁移、API 开发、数据分析等场景。'
                        : 'The CSV to JSON converter can convert CSV format data to JSON format, supporting file upload and text paste input. Automatically recognizes headers and generates structured JSON data. Supports one-click copy and download of conversion results. All processing is done locally in your browser, protecting your data privacy. Suitable for data migration, API development, data analysis, and other scenarios.'}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Input Area */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-text-site/40 uppercase flex items-center gap-2">
                           <Table className="w-3 h-3" /> CSV Input
                        </label>
                        <label className="cursor-pointer text-primary text-xs font-bold hover:underline flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            {isZh ? '上传文件' : 'Upload File'}
                            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                        </label>
                    </div>
                    <textarea 
                      value={csv} 
                      onChange={e => setCsv(e.target.value)}
                      placeholder={isZh ? "粘贴 CSV 数据 (带表头)..." : "Paste CSV data (with headers)..."}
                      className="w-full h-96 p-4 bg-card-bg border border-border-site rounded-2xl font-mono text-xs text-text-site outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    />
                    <button 
                      onClick={convert}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                      <Database className="w-5 h-5" /> {isZh ? '转换为 JSON' : 'Convert to JSON'}
                    </button>
                </div>

                {/* Output Area */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-text-site/40 uppercase flex items-center gap-2">
                            <FileJson className="w-3 h-3" /> JSON Result
                        </label>
                        {json && (
                           <div className="flex gap-3">
                              <button onClick={copyJson} className="text-primary text-xs font-bold flex items-center gap-1">
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {isZh ? (copied ? '已复制' : '复制') : (copied ? 'Copied' : 'Copy')}
                              </button>
                              <button onClick={downloadJson} className="text-secondary text-xs font-bold flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                {isZh ? '下载' : 'Download'}
                              </button>
                           </div>
                        )}
                    </div>
                    <div className="relative">
                        <textarea 
                          value={json} 
                          readOnly
                          className="w-full h-[456px] p-4 bg-secondary-site border border-border-site rounded-2xl font-mono text-xs text-text-site outline-none"
                          placeholder={isZh ? "转换后的 JSON 结果将出现在这里" : "Converted JSON will appear here"}
                        />
                        {error && (
                            <div className="absolute top-4 left-4 right-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold flex items-center gap-2 rounded-lg">
                                <AlertCircle className="w-3 h-3" /> {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SEO Info */}
            <div className="p-6 bg-secondary-site/50 rounded-3xl border border-border-site text-xs text-text-site/40 leading-relaxed italic">
                {isZh ? 
                   '提示：上传或粘贴您的 CSV 数据，我们会自动识别表头并将其转换为结构化的 JSON 数组格式。所有操作均在浏览器内完成，保障数据绝对安全。' : 
                   'Tip: Upload or paste your CSV data. We auto-detect headers and convert them into a structured JSON array format. Everything is processed locally in your browser for total security.'
                }
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
