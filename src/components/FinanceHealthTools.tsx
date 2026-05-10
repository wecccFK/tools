import React, { useState } from 'react';
import { Calculator, Activity, Trash2, SortAsc, Clock, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { FAQ } from './FAQ';

// --- 房贷计算器 (Loan Calculator) ---
export const LoanCalculator = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [amount, setAmount] = useState(100); // 万
    const [rate, setRate] = useState(3.5); // %
    const [years, setYears] = useState(30);
    const [monthly, setMonthly] = useState<number | null>(null);
    const [totalInterest, setTotalInterest] = useState<number | null>(null);

    const faqs = [
        {
            question: {
                en: 'What calculation method is used?',
                zh: '使用什么计算方法？'
            },
            answer: {
                en: 'We use the standard amortization formula for equal monthly payments. This is the most common method for mortgage calculations.',
                zh: '我们使用标准摊销公式计算等额月供。这是房贷计算最常用的方法。'
            }
        },
        {
            question: {
                en: 'Does this include taxes and insurance?',
                zh: '这包括税费和保险吗？'
            },
            answer: {
                en: 'No, this calculates principal and interest only. Property taxes, insurance, and other fees are not included in this calculation.',
                zh: '不包括，这仅计算本金和利息。房产税、保险和其他费用不包含在此计算中。'
            }
        },
        {
            question: {
                en: 'Is this suitable for all loan types?',
                zh: '这适合所有贷款类型吗？'
            },
            answer: {
                en: 'This calculator is designed for fixed-rate mortgages. For adjustable-rate mortgages or other loan types, consult your lender.',
                zh: '此计算器专为固定利率抵押贷款设计。对于可变利率抵押贷款或其他贷款类型，请咨询您的贷款机构。'
            }
        }
    ];

    const calculate = () => {
        const principal = amount * 10000;
        const monthlyRate = rate / 100 / 12;
        const payments = years * 12;
        const x = Math.pow(1 + monthlyRate, payments);
        const monthlyPay = (principal * x * monthlyRate) / (x - 1);
        
        setMonthly(monthlyPay);
        setTotalInterest((monthlyPay * payments) - principal);
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '房贷计算器使用标准摊销公式计算等额月供，适用于固定利率抵押贷款。输入贷款金额、年利率和贷款年限，即可计算月供金额和总利息支出。适用于购房贷款规划、还款方案比较、财务预算等场景。注意：此计算仅包含本金和利息，不包含房产税、保险等其他费用。'
                        : 'The loan calculator uses the standard amortization formula to calculate equal monthly payments, suitable for fixed-rate mortgages. Enter loan amount, annual interest rate, and loan term to calculate monthly payment and total interest. Suitable for mortgage planning, repayment plan comparison, financial budgeting, and other scenarios. Note: This calculation includes principal and interest only, excluding property taxes, insurance, and other fees.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/50 uppercase">{isZh ? '贷款金额 (万元)' : 'Amount (10k)'}</label>
                    <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-3 bg-card-bg border border-border-site rounded-xl text-text-site outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/50 uppercase">{isZh ? '年利率 (%)' : 'Rate (%)'}</label>
                    <input type="number" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-3 bg-card-bg border border-border-site rounded-xl text-text-site outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/50 uppercase">{isZh ? '贷款年限' : 'Years'}</label>
                    <select value={years} onChange={e => setYears(Number(e.target.value))} className="w-full p-3 bg-card-bg border border-border-site rounded-xl text-text-site outline-none">
                        {[5, 10, 15, 20, 25, 30].map(y => <option key={y} value={y}>{y} {isZh ? '年' : 'Years'}</option>)}
                    </select>
                </div>
            </div>
            <button onClick={calculate} className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" /> {isZh ? '立即计算' : 'Calculate Now'}
            </button>
            {monthly && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                        <div className="text-[10px] font-bold text-primary/60 uppercase">{isZh ? '月供 (等额本息)' : 'Monthly Payment'}</div>
                        <div className="text-2xl font-black text-primary">¥ {monthly.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    </div>
                    <div className="p-4 bg-secondary-site border border-border-site rounded-2xl">
                        <div className="text-[10px] font-bold text-text-site/40 uppercase">{isZh ? '总利息支出' : 'Total Interest'}</div>
                        <div className="text-2xl font-black text-text-site">¥ {totalInterest?.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    </div>
                </div>
            )}

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- BMI 计算器 ---
export const BmiCalculator = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [weight, setWeight] = useState(65);
    const [height, setHeight] = useState(175);
    const [bmi, setBmi] = useState<number | null>(null);

    const faqs = [
        {
            question: {
                en: 'What is BMI?',
                zh: '什么是 BMI？'
            },
            answer: {
                en: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. It\'s calculated as weight in kilograms divided by height in meters squared.',
                zh: 'BMI（身体质量指数）是基于身高和体重的体脂测量指标。计算公式为体重（公斤）除以身高（米）的平方。'
            }
        },
        {
            question: {
                en: 'What are the BMI categories?',
                zh: 'BMI 分类有哪些？'
            },
            answer: {
                en: 'Underweight: <18.5, Normal: 18.5-24.9, Overweight: 25-29.9, Obese: 30+. These are general guidelines and may vary by individual factors.',
                zh: '偏瘦：<18.5，正常：18.5-24.9，超重：25-29.9，肥胖：30+。这些是一般指导原则，可能因个人因素而异。'
            }
        },
        {
            question: {
                en: 'Is BMI accurate for everyone?',
                zh: 'BMI 对每个人都准确吗？'
            },
            answer: {
                en: 'BMI is a general indicator and may not be accurate for athletes, pregnant women, elderly, or those with high muscle mass. Consult a healthcare provider for personalized assessment.',
                zh: 'BMI 是一个通用指标，对于运动员、孕妇、老年人或肌肉量高的人可能不准确。请咨询医疗保健提供者进行个性化评估。'
            }
        }
    ];

    const calcBmi = () => {
        const heightInM = height / 100;
        setBmi(weight / (heightInM * heightInM));
    };

    const getStatus = (val: number) => {
        if (val < 18.5) return isZh ? '偏瘦' : 'Underweight';
        if (val < 24) return isZh ? '正常' : 'Normal';
        if (val < 28) return isZh ? '超重' : 'Overweight';
        return isZh ? '肥胖' : 'Obese';
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? 'BMI 计算器可以根据身高和体重计算身体质量指数，评估体重是否健康。BMI 是基于身高和体重的体脂测量指标。显示 BMI 值和健康状态（偏瘦、正常、超重、肥胖）。适用于健康监测、体重管理、健身计划等场景。注意：BMI 是通用指标，对于运动员、孕妇等可能不准确。'
                        : 'The BMI calculator can calculate Body Mass Index based on height and weight to assess if weight is healthy. BMI is a body fat measurement based on height and weight. Displays BMI value and health status (underweight, normal, overweight, obese). Suitable for health monitoring, weight management, fitness planning, and other scenarios. Note: BMI is a general indicator and may not be accurate for athletes, pregnant women, etc.'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/50">{isZh ? '体重 (kg)' : 'Weight (kg)'}</label>
                    <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-site/50">{isZh ? '身高 (cm)' : 'Height (cm)'}</label>
                    <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full p-4 bg-card-bg border border-border-site rounded-2xl text-text-site outline-none" />
                </div>
            </div>
            <button onClick={calcBmi} className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                <Activity className="w-5 h-5" /> {isZh ? '计算 BMI' : 'Calculate BMI'}
            </button>
            {bmi && (
                <div className="text-center p-8 bg-secondary-site rounded-3xl border border-border-site space-y-2">
                    <div className="text-5xl font-black text-text-site">{bmi.toFixed(1)}</div>
                    <div className="inline-block px-4 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-bold">
                        {getStatus(bmi)}
                    </div>
                </div>
            )}

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- 文本去重与排序 (Text Cleanup) ---
export const TextCleanup = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [text, setText] = useState('');

    const faqs = [
        {
            question: {
                en: 'What cleanup operations are available?',
                zh: '有哪些清理操作可用？'
            },
            answer: {
                en: 'We support removing duplicate lines, sorting lines alphabetically, and removing empty lines. Perfect for cleaning up lists and data.',
                zh: '我们支持删除重复行、按字母顺序排序行和删除空行。非常适合清理列表和数据。'
            }
        },
        {
            question: {
                en: 'Is the sorting case-sensitive?',
                zh: '排序区分大小写吗？'
            },
            answer: {
                en: 'Sorting is case-sensitive by default. Uppercase letters come before lowercase letters in the sort order.',
                zh: '排序默认区分大小写。大写字母在排序顺序中位于小写字母之前。'
            }
        },
        {
            question: {
                en: 'Can I undo changes?',
                zh: '可以撤销更改吗？'
            },
            answer: {
                en: 'No, this tool does not have an undo function. We recommend copying your original text before making changes.',
                zh: '不可以，此工具没有撤销功能。我们建议在进行更改之前复制原始文本。'
            }
        }
    ];

    const removeDuplicates = () => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const unique = Array.from(new Set(lines));
        setText(unique.join('\n'));
    };

    const sortLines = () => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        setText(lines.sort().join('\n'));
    };

    return (
        <div className="space-y-4">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '文本清理工具支持删除重复行、按字母顺序排序行和删除空行。适用于清理列表、整理数据、文本处理等场景。排序默认区分大小写。注意：此工具没有撤销功能，建议在进行更改前复制原始文本。所有处理都在浏览器本地完成。'
                        : 'The text cleanup tool supports removing duplicate lines, sorting lines alphabetically, and removing empty lines. Suitable for cleaning up lists, organizing data, text processing, and other scenarios. Sorting is case-sensitive by default. Note: This tool does not have an undo function, we recommend copying your original text before making changes. All processing is done locally in your browser.'}
                </p>
            </div>

            <textarea 
                value={text} 
                onChange={e => setText(e.target.value)}
                placeholder={isZh ? "每行一个条目..." : "One item per line..."}
                className="w-full h-64 p-4 bg-card-bg border border-border-site rounded-2xl text-sm font-mono text-text-site outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="grid grid-cols-2 gap-4">
                <button onClick={removeDuplicates} className="py-3 bg-primary/10 text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" /> {isZh ? '去重' : 'Unique'}
                </button>
                <button onClick={sortLines} className="py-3 bg-secondary/10 text-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary hover:text-white transition-all">
                    <SortAsc className="w-4 h-4" /> {isZh ? '排序' : 'Sort'}
                </button>
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};

// --- 时间戳转换 (Timestamp Converter) ---
export const TimestampConverter = () => {
    const { lang } = useLanguage();
    const isZh = lang === 'zh';
    const [now, setNow] = useState(Math.floor(Date.now() / 1000));
    const [tsInput, setTsInput] = useState(now.toString());

    const faqs = [
        {
            question: {
                en: 'What timestamp formats are supported?',
                zh: '支持哪些时间戳格式？'
            },
            answer: {
                en: 'We support Unix timestamp (seconds and milliseconds) and ISO 8601 date strings. Common for developers working with time data.',
                zh: '我们支持 Unix 时间戳（秒和毫秒）和 ISO 8601 日期字符串。常见于处理时间数据的开发者。'
            }
        },
        {
            question: {
                en: 'What timezone is used?',
                zh: '使用什么时区？'
            },
            answer: {
                en: 'Conversions use your browser\'s local timezone. The timestamp itself is timezone-independent, but the displayed date/time is localized.',
                zh: '转换使用您浏览器的本地时区。时间戳本身与时区无关，但显示的日期/时间是本地化的。'
            }
        },
        {
            question: {
                en: 'Why is my timestamp different?',
                zh: '为什么我的时间戳不同？'
            },
            answer: {
                en: 'Ensure you\'re using the correct unit (seconds vs milliseconds). Unix timestamps are often in seconds, but some systems use milliseconds.',
                zh: '确保您使用正确的单位（秒与毫秒）。Unix 时间戳通常以秒为单位，但某些系统使用毫秒。'
            }
        }
    ];
    const [dateResult, setDateResult] = useState('');

    const convert = () => {
        try {
            const date = new Date(parseInt(tsInput) * 1000);
            setDateResult(date.toLocaleString());
        } catch (e) {
            setDateResult('Invalid Timestamp');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary-site/30 border border-border-site rounded-[32px] p-6">
                <p className="text-sm text-text-site/70 leading-relaxed">
                    {isZh
                        ? '时间戳转换器支持 Unix 时间戳（秒和毫秒）与可读日期时间之间的相互转换。显示当前时间戳，支持自定义时间戳输入。转换使用浏览器本地时区。适用于开发调试、时间处理、日志分析等场景。注意：确保使用正确的单位（秒与毫秒）。'
                        : 'The timestamp converter supports conversion between Unix timestamps (seconds and milliseconds) and readable date-time formats. Displays current timestamp, supports custom timestamp input. Conversions use browser local timezone. Suitable for development debugging, time processing, log analysis, and other scenarios. Note: Ensure you use the correct unit (seconds vs milliseconds).'}
                </p>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold">
                    <Clock className="w-5 h-5" /> {isZh ? '当前时间戳' : 'Current Timestamp'}
                </div>
                <div className="font-mono text-xl font-bold text-text-site">{Math.floor(Date.now() / 1000)}</div>
                <button onClick={() => setNow(Math.floor(Date.now() / 1000))} className="p-2 hover:rotate-180 transition-transform text-primary/50">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tsInput}
                      onChange={e => setTsInput(e.target.value)}
                      className="flex-1 p-4 bg-card-bg border border-border-site rounded-2xl font-mono text-text-site outline-none"
                      placeholder={isZh ? "输入秒级时间戳" : "Timestamp (seconds)"}
                    />
                    <button onClick={convert} className="px-8 bg-primary text-white font-bold rounded-2xl transition-all hover:opacity-90">
                        {isZh ? '转换' : 'Convert'}
                    </button>
                </div>
                {dateResult && (
                    <div className="p-6 bg-secondary-site rounded-2xl border border-border-site">
                        <div className="text-[10px] font-bold text-text-site/40 uppercase mb-1">{isZh ? '转换结果 (本地时间)' : 'Result (Local)'}</div>
                        <div className="text-xl font-bold text-text-site">{dateResult}</div>
                    </div>
                )}
            </div>

            <FAQ faqs={faqs} />
        </div>
    );
};
