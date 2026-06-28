import { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

// 单位定义：相对于"基准单位"的换算系数
// 例：长度基准是米；1 公里 = 1000 米
interface UnitDef {
  id: string;
  zh: string;
  en: string;
  toBase: number; // 1 unit = toBase base units
}

interface CategoryDef {
  id: string;
  zh: string;
  en: string;
  base: string; // 仅作注释参考
  units: UnitDef[];
}

const CATEGORIES: CategoryDef[] = [
  {
    id: 'length',
    zh: '长度',
    en: 'Length',
    base: 'meter',
    units: [
      { id: 'km', zh: '千米', en: 'Kilometer', toBase: 1000 },
      { id: 'm', zh: '米', en: 'Meter', toBase: 1 },
      { id: 'cm', zh: '厘米', en: 'Centimeter', toBase: 0.01 },
      { id: 'mm', zh: '毫米', en: 'Millimeter', toBase: 0.001 },
      { id: 'um', zh: '微米', en: 'Micrometer', toBase: 1e-6 },
      { id: 'nm', zh: '纳米', en: 'Nanometer', toBase: 1e-9 },
      { id: 'mi', zh: '英里', en: 'Mile', toBase: 1609.344 },
      { id: 'yd', zh: '码', en: 'Yard', toBase: 0.9144 },
      { id: 'ft', zh: '英尺', en: 'Foot', toBase: 0.3048 },
      { id: 'in', zh: '英寸', en: 'Inch', toBase: 0.0254 },
      { id: 'nmi', zh: '海里', en: 'Nautical Mile', toBase: 1852 },
    ],
  },
  {
    id: 'mass',
    zh: '重量',
    en: 'Mass',
    base: 'gram',
    units: [
      { id: 't', zh: '吨', en: 'Tonne', toBase: 1e6 },
      { id: 'kg', zh: '千克', en: 'Kilogram', toBase: 1000 },
      { id: 'g', zh: '克', en: 'Gram', toBase: 1 },
      { id: 'mg', zh: '毫克', en: 'Milligram', toBase: 0.001 },
      { id: 'ug', zh: '微克', en: 'Microgram', toBase: 1e-6 },
      { id: 'lb', zh: '磅', en: 'Pound', toBase: 453.59237 },
      { id: 'oz', zh: '盎司', en: 'Ounce', toBase: 28.349523 },
      { id: 'ct', zh: '克拉', en: 'Carat', toBase: 0.2 },
    ],
  },
  {
    id: 'temperature',
    zh: '温度',
    en: 'Temperature',
    base: 'celsius',
    units: [
      { id: 'c', zh: '摄氏度', en: 'Celsius', toBase: 1 },
      { id: 'f', zh: '华氏度', en: 'Fahrenheit', toBase: 1 },
      { id: 'k', zh: '开尔文', en: 'Kelvin', toBase: 1 },
    ],
  },
  {
    id: 'data',
    zh: '数据存储',
    en: 'Data',
    base: 'byte',
    units: [
      { id: 'bit', zh: '比特', en: 'Bit', toBase: 0.125 },
      { id: 'B', zh: '字节', en: 'Byte', toBase: 1 },
      { id: 'KB', zh: '千字节', en: 'Kilobyte', toBase: 1024 },
      { id: 'MB', zh: '兆字节', en: 'Megabyte', toBase: 1024 ** 2 },
      { id: 'GB', zh: '吉字节', en: 'Gigabyte', toBase: 1024 ** 3 },
      { id: 'TB', zh: '太字节', en: 'Terabyte', toBase: 1024 ** 4 },
      { id: 'PB', zh: '拍字节', en: 'Petabyte', toBase: 1024 ** 5 },
    ],
  },
  {
    id: 'speed',
    zh: '速度',
    en: 'Speed',
    base: 'm/s',
    units: [
      { id: 'mps', zh: '米/秒', en: 'Meter/sec', toBase: 1 },
      { id: 'kmh', zh: '千米/小时', en: 'Kilometer/hr', toBase: 1 / 3.6 },
      { id: 'mph', zh: '英里/小时', en: 'Mile/hr', toBase: 0.44704 },
      { id: 'kn', zh: '节', en: 'Knot', toBase: 0.514444 },
      { id: 'fts', zh: '英尺/秒', en: 'Foot/sec', toBase: 0.3048 },
      { id: 'mach', zh: '马赫', en: 'Mach', toBase: 343 },
    ],
  },
  {
    id: 'area',
    zh: '面积',
    en: 'Area',
    base: 'square meter',
    units: [
      { id: 'km2', zh: '平方千米', en: 'Square Kilometer', toBase: 1e6 },
      { id: 'm2', zh: '平方米', en: 'Square Meter', toBase: 1 },
      { id: 'cm2', zh: '平方厘米', en: 'Square Centimeter', toBase: 1e-4 },
      { id: 'ha', zh: '公顷', en: 'Hectare', toBase: 1e4 },
      { id: 'acre', zh: '英亩', en: 'Acre', toBase: 4046.8564224 },
      { id: 'ft2', zh: '平方英尺', en: 'Square Foot', toBase: 0.09290304 },
      { id: 'in2', zh: '平方英寸', en: 'Square Inch', toBase: 0.00064516 },
      { id: 'mu', zh: '亩', en: 'Mu (亩)', toBase: 666.6666667 },
    ],
  },
  {
    id: 'time',
    zh: '时间',
    en: 'Time',
    base: 'second',
    units: [
      { id: 'ms', zh: '毫秒', en: 'Millisecond', toBase: 0.001 },
      { id: 's', zh: '秒', en: 'Second', toBase: 1 },
      { id: 'min', zh: '分', en: 'Minute', toBase: 60 },
      { id: 'h', zh: '小时', en: 'Hour', toBase: 3600 },
      { id: 'd', zh: '天', en: 'Day', toBase: 86400 },
      { id: 'wk', zh: '周', en: 'Week', toBase: 604800 },
      { id: 'yr', zh: '年', en: 'Year', toBase: 31557600 },
    ],
  },
  {
    id: 'angle',
    zh: '角度',
    en: 'Angle',
    base: 'degree',
    units: [
      { id: 'deg', zh: '度', en: 'Degree', toBase: 1 },
      { id: 'rad', zh: '弧度', en: 'Radian', toBase: 180 / Math.PI },
      { id: 'grad', zh: '梯度', en: 'Gradian', toBase: 0.9 },
      { id: 'arcmin', zh: '角分', en: 'Arcminute', toBase: 1 / 60 },
      { id: 'arcsec', zh: '角秒', en: 'Arcsecond', toBase: 1 / 3600 },
      { id: 'turn', zh: '圈', en: 'Turn', toBase: 360 },
    ],
  },
];

// 温度需要特殊换算（不是线性比例）
function convertTemperature(value: number, from: string, to: string): number {
  // 先转到摄氏度
  let celsius: number;
  switch (from) {
    case 'c': celsius = value; break;
    case 'f': celsius = (value - 32) * 5 / 9; break;
    case 'k': celsius = value - 273.15; break;
    default: celsius = value;
  }
  switch (to) {
    case 'c': return celsius;
    case 'f': return celsius * 9 / 5 + 32;
    case 'k': return celsius + 273.15;
    default: return celsius;
  }
}

export default function UnitConverter() {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';
  const [categoryId, setCategoryId] = useState('length');
  const category = CATEGORIES.find((c) => c.id === categoryId)!;
  const [fromUnit, setFromUnit] = useState(category.units[0].id);
  const [toUnit, setToUnit] = useState(category.units[1].id);
  const [input, setInput] = useState('1');

  // 切换类别时重置单位选择
  const switchCategory = (id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id)!;
    setCategoryId(id);
    setFromUnit(cat.units[0].id);
    setToUnit(cat.units[1].id);
  };

  const result = useMemo(() => {
    const num = parseFloat(input);
    if (isNaN(num)) return '';
    if (category.id === 'temperature') {
      const v = convertTemperature(num, fromUnit, toUnit);
      return v.toFixed(6).replace(/\.?0+$/, '');
    }
    const from = category.units.find((u) => u.id === fromUnit)!;
    const to = category.units.find((u) => u.id === toUnit)!;
    // from -> base -> to
    const base = num * from.toBase;
    const v = base / to.toBase;
    // 大数字用科学计数法，否则四舍五入到 10 位有效数字
    if (v !== 0 && (Math.abs(v) < 1e-6 || Math.abs(v) >= 1e15)) {
      return v.toExponential(8);
    }
    return parseFloat(v.toPrecision(12)).toString();
  }, [input, fromUnit, toUnit, category]);

  // 反向结果（用户输入"目标"框可自动反算）
  const reverseResult = useMemo(() => {
    const num = parseFloat(result);
    if (isNaN(num)) return '';
    if (category.id === 'temperature') {
      const v = convertTemperature(num, toUnit, fromUnit);
      return v.toFixed(6).replace(/\.?0+$/, '');
    }
    const from = category.units.find((u) => u.id === fromUnit)!;
    const to = category.units.find((u) => u.id === toUnit)!;
    const base = num * to.toBase;
    return parseFloat((base / from.toBase).toPrecision(12)).toString();
  }, [result, fromUnit, toUnit, category]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result) setInput(result);
  };

  const labelStyle = { color: 'var(--text-muted)' };
  const selectStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  };

  const fromUnitDef = category.units.find((u) => u.id === fromUnit)!;
  const toUnitDef = category.units.find((u) => u.id === toUnit)!;

  return (
    <div className="flex flex-col gap-5">
      {/* 类别选择 */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={labelStyle}>
          {isZh ? '类别' : 'Category'}
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => switchCategory(c.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={
                categoryId === c.id
                  ? { background: 'var(--accent)', color: '#fff' }
                  : { background: 'var(--bg-3)', color: 'var(--text-muted)' }
              }
            >
              {isZh ? c.zh : c.en}
            </button>
          ))}
        </div>
      </div>

      {/* 输入区 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-stretch gap-2">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 min-w-0 rounded-lg p-3 font-mono text-sm outline-none"
            style={{
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="rounded-lg px-3 text-sm outline-none cursor-pointer"
            style={selectStyle}
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {isZh ? u.zh : u.en}
              </option>
            ))}
          </select>
        </div>

        {/* 交换按钮 */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className="p-1.5 rounded-full transition-colors hover:opacity-80"
            style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            title={isZh ? '交换' : 'Swap'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" />
            </svg>
          </button>
        </div>

        <div className="flex items-stretch gap-2">
          <input
            readOnly
            value={result}
            placeholder="="
            className="flex-1 min-w-0 rounded-lg p-3 font-mono text-sm outline-none"
            style={{
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="rounded-lg px-3 text-sm outline-none cursor-pointer"
            style={selectStyle}
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {isZh ? u.zh : u.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 公式提示 */}
      {result && (
        <div
          className="rounded-lg p-3 text-xs font-mono"
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          1 {isZh ? fromUnitDef.zh : fromUnitDef.en} = {(() => {
            let v: number;
            if (category.id === 'temperature') {
              v = convertTemperature(1, fromUnit, toUnit);
            } else {
              v = fromUnitDef.toBase / toUnitDef.toBase;
            }
            if (v !== 0 && (Math.abs(v) < 1e-6 || Math.abs(v) >= 1e15)) {
              return v.toExponential(6);
            }
            return parseFloat(v.toPrecision(10)).toString();
          })()} {isZh ? toUnitDef.zh : toUnitDef.en}
        </div>
      )}

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {isZh
          ? '支持长度、重量、温度、数据存储、速度、面积、时间、角度等 8 大类单位互转。所有计算在浏览器本地完成。'
          : 'Supports 8 categories: length, mass, temperature, data, speed, area, time, and angle. All calculations run locally.'}
      </p>
    </div>
  );
}
