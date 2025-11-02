# Web SDK 完整文档

一款**免费、开源的高性能网页性能监控 SDK**，用于收集和分析网页应用的各项性能指标。该 SDK 采用现代化的 Web APIs（PerformanceObserver）来实时监控网页性能，支持自定义配置和扩展。

**当前版本**: 1.0.0  
**许可证**: ISC  
**语言**: TypeScript/JavaScript

---

## 目录

1. [功能特性](#功能特性)
2. [支持的性能指标](#支持的性能指标)
3. [快速开始](#快速开始)
4. [安装指南](#安装指南)
5. [核心配置](#核心配置)
6. [API 详解](#api-详解)
7. [项目结构](#项目结构)
8. [高级用法](#高级用法)
9. [性能指标详细说明](#性能指标详细说明)
10. [错误处理](#错误处理)
11. [浏览器兼容性](#浏览器兼容性)
12. [常见问题](#常见问题)
13. [开发指南](#开发指南)
14. [更新日志](#更新日志)

---

## 功能特性

### 核心能力

- **实时性能监控**: 基于 PerformanceObserver 的非侵入式监控
- **多维度指标收集**: 覆盖导航时序、资源加载、渲染性能等全方位
- **灵活数据上报**: 支持自定义分析工具和上报接口
- **错误追踪**: 可选的 JavaScript 错误捕获和上报
- **网络状态检测**: 实时获取用户的网络连接信息
- **存储监控**: 监控浏览器离线存储使用情况
- **TypeScript 支持**: 完整的类型定义和 IDE 智能提示

### 特点

| 特性 | 说明 |
|------|------|
| **零依赖** | 不依赖任何第三方库，极轻量级 |
| **跨浏览器** | 支持现代浏览器，优雅降级处理 |
| **可配置** | 支持丰富的初始化选项和自定义扩展 |
| **生产就绪** | 经过完整的 TypeScript 类型定义和错误处理 |
| **API 完整** | 暴露上报接口供外部系统集成 |

---

## 支持的性能指标

### Web Vitals 指标（谷歌核心指标）

| 指标 | 全称 | 说明 | 采集方式 |
|------|------|------|---------|
| **FCP** | First Contentful Paint | 首次内容绘制 | PerformanceObserver: paint |
| **LCP** | Largest Contentful Paint | 最大内容绘制 | PerformanceObserver: largest-contentful-paint |
| **FID** | First Input Delay | 首次输入延迟 | PerformanceObserver: first-input |
| **CLS** | Cumulative Layout Shift | 累积布局偏移 | PerformanceObserver: layout-shift |

### 导航时序指标

| 指标 | 说明 | 用途 |
|------|------|------|
| **DNS 查询时间** | DNS 域名解析耗时 | 诊断网络问题 |
| **TCP 连接时间** | TCP 建立连接耗时 | 评估网络状态 |
| **TTFB** | Time to First Byte，首字节时间 | 衡量服务器响应速度 |
| **白屏时间** | 从开始导航到首次绘制 | 用户体验关键指标 |
| **DOM 解析时间** | HTML 文档解析耗时 | 诊断页面内容加载 |
| **页面加载总时间** | 从导航开始到完全加载 | 整体性能评估 |

### 资源加载指标

| 指标 | 说明 |
|------|------|
| **脚本加载** | JavaScript 文件加载耗时 |
| **样式表加载** | CSS 文件加载耗时 |
| **图片加载** | 图片资源加载耗时 |
| **字体加载** | 字体文件加载耗时 |
| **XHR/Fetch 请求** | 异步请求加载耗时 |

### 网络信息指标

| 指标 | 说明 |
|------|------|
| **Downlink** | 网络下行速率（Mbps） |
| **RTT** | 往返延迟（毫秒） |
| **Effective Type** | 有效连接类型（2g/3g/4g/5g） |
| **Save Data** | 是否启用节流模式 |

### 设备信息指标

| 指标 | 说明 |
|------|------|
| **deviceMemory** | 设备内存容量（GB） |
| **hardwareConcurrency** | CPU 内核数 |
| **isLowEndDevice** | 是否低端设备 |
| **serviceWorkerStatus** | Service Worker 支持状态 |

---

## 快速开始

### 1. 最小化使用示例

```typescript
import WEB_SDK from 'web_sdk';

// 初始化 SDK（必须提供 logUrl）
const sdk = new WEB_SDK({
  logUrl: 'https://your-analytics.com/api/logs'
});
```

**说明**: 这是最简单的初始化方式，SDK 会自动收集基础性能指标。

### 2. 完整功能初始化示例

```typescript
import WEB_SDK from 'web_sdk';

const sdk = new WEB_SDK({
  // 必填：数据上报地址
  logUrl: 'https://your-analytics.com/api/logs',
  
  // 可选：启用功能开关
  captureError: true,              // 启用错误追踪
  resourceTiming: true,            // 启用资源加载监控
  elementTiming: true,             // 启用元素时序监控
  
  // 可选：最大测量时间（毫秒）
  maxMeasureTime: 20000,           // 默认 15000ms
  
  // 可选：自定义数据分析工具
  analyticsTracker: (options) => {
    const {
      metricName,
      data,
      eventProperties,
      navigatorInformation,
      vitalsScore
    } = options;
    
    // 自定义处理逻辑
    console.log(`指标: ${metricName}`, data);
    
    // 示例：上报到自定义分析平台
    fetch('https://your-platform.com/metrics', {
      method: 'POST',
      body: JSON.stringify({
        metric: metricName,
        value: data,
        properties: eventProperties,
        device: navigatorInformation,
        score: vitalsScore
      })
    });
  }
});
```

### 3. 实际项目集成示例

```typescript
// main.ts 或 app.ts
import WEB_SDK from 'web_sdk';

// 创建全局单例
declare global {
  interface Window {
    __WEB_SDK__: WEB_SDK;
  }
}

// 仅在生产环境和浏览器环境中初始化
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  window.__WEB_SDK__ = new WEB_SDK({
    logUrl: process.env.VITE_LOG_URL,
    captureError: true,
    resourceTiming: true,
    analyticsTracker: (options) => {
      // 集成到现有的分析平台
      if (window.gtag) {
        window.gtag('event', options.metricName, {
          value: options.data,
          vitals_score: options.vitalsScore
        });
      }
    }
  });
}
```

---

## 安装指南

### 方案 A: NPM 安装

#### 步骤 1: 安装依赖

```bash
# 使用 npm
npm install web_sdk

# 或使用 yarn
yarn add web_sdk

# 或使用 pnpm
pnpm add web_sdk
```

#### 步骤 2: 导入和使用

```typescript
// TypeScript
import WEB_SDK from 'web_sdk';

const sdk = new WEB_SDK({
  logUrl: 'https://your-api.com/logs'
});
```

```javascript
// JavaScript (CommonJS)
const WEB_SDK = require('web_sdk').default;

const sdk = new WEB_SDK({
  logUrl: 'https://your-api.com/logs'
});
```

```javascript
// JavaScript (ES Module)
import WEB_SDK from 'web_sdk';

const sdk = new WEB_SDK({
  logUrl: 'https://your-api.com/logs'
});
```

### 方案 B: CDN 直接引入

#### 步骤 1: 在 HTML 中引入

```html
<!-- 在 <head> 或 <body> 末尾引入 -->
<script src="https://unpkg.com/web_sdk@1.0.0/dist/web_sdk.umd.js"></script>
```

#### 步骤 2: 使用全局对象

```html
<script>
  // SDK 会挂载到全局作用域
  const sdk = new window.WEB_SDK({
    logUrl: 'https://your-api.com/logs'
  });
</script>
```

### 方案 C: 本地开发

#### 步骤 1: 克隆或下载项目

```bash
git clone https://github.com/wyle-timing-xx/web-sdk.git
cd web-sdk
```

#### 步骤 2: 安装依赖

```bash
pnpm install
# 或
npm install
```

#### 步骤 3: 本地开发和构建

```bash
# 开启监听模式构建
pnpm run dev

# 一次性构建
pnpm run build

# 运行示例程序
pnpm run example:run
```

#### 步骤 4: 将构建产物集成到项目

```bash
# 构建后会生成以下文件
# - dist/web_sdk.js          (CJS)
# - dist/web_sdk.module.js   (ES Module)
# - dist/web_sdk.umd.js      (UMD - 浏览器直接使用)
# - dist/typings/index.d.ts  (TypeScript 类型定义)
```

---

## 核心配置

### 完整配置接口说明

```typescript
interface Iweb_sdkOptions {
  // ==================== 必填配置 ====================
  
  /**
   * 数据上报端点 URL
   * @type {string}
   * @required true
   * @example "https://api.example.com/metrics"
   * @description 所有收集的性能数据将发送到此 URL
   */
  logUrl: string;
  
  // ==================== 功能开关 ====================
  
  /**
   * 是否启用 JavaScript 错误追踪
   * @type {boolean}
   * @default false
   * @description 启用后会捕获页面上所有未捕获的 JS 错误
   */
  captureError?: boolean;
  
  /**
   * 是否启用资源加载监控
   * @type {boolean}
   * @default false
   * @description 启用后会监控所有资源（脚本、样式、图片等）的加载性能
   */
  resourceTiming?: boolean;
  
  /**
   * 是否启用元素时序监控
   * @type {boolean}
   * @default false
   * @description 启用后会监控特定 HTML 元素的渲染时机
   */
  elementTiming?: boolean;
  
  // ==================== 数据处理 ====================
  
  /**
   * 最大测量时间（毫秒）
   * @type {number}
   * @default 15000
   * @range [1000, 60000]
   * @description 超过此时间的测量数据将被忽略（防止异常值污染数据）
   */
  maxMeasureTime?: number;
  
  /**
   * 自定义数据分析工具
   * @type {(options: IAnalyticsTrackerOptions) => void}
   * @optional true
   * @description 拦截每条指标数据，执行自定义处理逻辑
   * @example
   * analyticsTracker: (options) => {
   *   console.log('指标:', options.metricName);
   *   console.log('数据:', options.data);
   *   console.log('得分:', options.vitalsScore);
   * }
   */
  analyticsTracker?: (options: IAnalyticsTrackerOptions) => void;
}
```

### 配置示例矩阵

| 场景 | 配置 | 说明 |
|------|------|------|
| **基础监控** | `{ logUrl }` | 最小化配置，收集基础指标 |
| **完整监控** | 启用所有 flag | 收集所有可用的性能指标 |
| **错误追踪** | `{ captureError: true }` | 仅捕获 JS 错误 |
| **自定义处理** | `{ analyticsTracker }` | 自定义数据处理流程 |
| **低端设备** | `{ maxMeasureTime: 10000 }` | 降低数据收集阈值 |

---

## API 详解

### 类: WEB_SDK

#### 构造函数

```typescript
constructor(options: Iweb_sdkOptions = {})
```

##### 参数

- `options` (Iweb_sdkOptions): SDK 初始化配置对象
  - 必填: `logUrl` - 数据上报 URL
  - 可选: 其他配置项

##### 示例

```typescript
const sdk = new WEB_SDK({
  logUrl: 'https://api.example.com/logs',
  captureError: true
});
```

##### 异常处理

```typescript
try {
  const sdk = new WEB_SDK({
    // 缺少 logUrl 将抛出错误
  });
} catch (error) {
  console.error('SDK 初始化失败:', error.message);
  // 错误消息: "京程一灯系统监控平台1.0.0提示未传递logUrl"
}
```

#### 实例属性

##### reportData (IReportData)

用于手动上报数据的接口对象。

```typescript
interface IReportData {
  /**
   * 发送数据到分析系统
   * @param level - 优先级 (URGENT=1, IDLE=2)
   * @param body - 发送的数据（JSON 字符串）
   */
  sendToAnalytics(level: AskPriority, body: string): void;
}
```

##### 使用示例

```typescript
const sdk = new WEB_SDK({ logUrl });

// 手动上报数据
sdk.reportData.sendToAnalytics(
  1, // URGENT 优先级
  JSON.stringify({
    eventType: 'custom',
    message: '自定义事件'
  })
);
```

### 类型定义

#### IAnalyticsTrackerOptions

每条指标数据都会通过 analyticsTracker 传入此类型的对象。

```typescript
interface IAnalyticsTrackerOptions {
  /** 指标名称 (如: "FCP", "LCP", "navigationTiming") */
  metricName: string;
  
  /** 指标数据值 */
  data: Iweb_sdkData;
  
  /** 事件属性对象 */
  eventProperties: object;
  
  /** 设备/浏览器信息 */
  navigatorInformation: INavigatorInfo;
  
  /** 性能得分 ('good' | 'needsImprovement' | 'poor' | null) */
  vitalsScore: IVitalsScore;
}
```

#### INavigatorInfo

设备和浏览器的相关信息。

```typescript
interface INavigatorInfo {
  /** 设备内存容量（GB）*/
  deviceMemory?: number;
  
  /** CPU 内核数 */
  hardwareConcurrency?: number;
  
  /** 是否为低端设备 */
  isLowEndDevice?: boolean;
  
  /** 是否为低端体验配置 */
  isLowEndExperience?: boolean;
  
  /** Service Worker 支持状态 */
  serviceWorkerStatus?: 'controlled' | 'supported' | 'unsupported';
}
```

#### Iweb_sdkNavigationTiming

导航时序数据类型。

```typescript
interface Iweb_sdkNavigationTiming {
  /** 资源获取耗时 */
  fetchTime?: number;
  
  /** Service Worker 处理时间 */
  workerTime?: number;
  
  /** 总耗时 */
  totalTime?: number;
  
  /** 文档下载耗时 */
  downloadTime?: number;
  
  /** 首字节时间（TTFB） */
  timeToFirstByte?: number;
  
  /** 响应头大小 */
  headerSize?: number;
  
  /** DNS 查询耗时 */
  dnsLookupTime?: number;
  
  /** TCP 连接耗时 */
  tcpTime?: number;
  
  /** 白屏时间 */
  whiteTime?: number;
  
  /** DOM 解析耗时 */
  domTime?: number;
  
  /** 页面加载完成耗时 */
  loadTime?: number;
  
  /** DOM 解析耗时（同 domTime） */
  parseDomTime?: number;
}
```

#### Iweb_sdkNetworkInformation

网络信息数据类型。

```typescript
interface Iweb_sdkNetworkInformation {
  /** 下行速率（Mbps） */
  downlink?: number;
  
  /** 有效连接类型 */
  effectiveType?: EffectiveConnectionType; // '2g'|'3g'|'4g'|'5g'|'slow-2g'|'lte'
  
  /** 连接变化事件 */
  onchange?: () => void;
  
  /** 往返延迟（ms） */
  rtt?: number;
  
  /** 是否启用节流 */
  saveData?: boolean;
}
```

---

## 项目结构

```
web-sdk/
├── src/                          # 源代码目录
│   ├── web_sdk.ts               # 主入口文件 (WEB_SDK 类)
│   │
│   ├── config/
│   │   └── index.ts             # 全局配置对象
│   │
│   ├── typings/
│   │   └── types.ts             # TypeScript 类型定义
│   │
│   ├── performance/             # 性能指标采集模块
│   │   ├── getNavigationTiming.ts    # 导航时序指标
│   │   ├── observe.ts               # PerformanceObserver 初始化
│   │   ├── paint.ts                 # FCP/LCP 监控
│   │   ├── firstInput.ts            # FID 监控
│   │   ├── cumulativeLayoutShift.ts # CLS 监控
│   │   ├── resourceTiming.ts        # 资源加载监控
│   │   ├── totalBlockingTime.ts     # 总阻塞时间监控
│   │   ├── performanceObserver.ts   # 通用 Observer 工具
│   │   └── observeInstances.ts      # Observer 实例管理
│   │
│   ├── data/                    # 数据处理模块
│   │   ├── constants.ts         # 全局常量和对象引用
│   │   ├── log.ts               # 日志记录函数
│   │   ├── analyticsTracker.ts  # 默认分析跟踪实现
│   │   ├── ReportData.ts        # 数据上报类
│   │   └── storageEstimate.ts   # 存储监控
│   │
│   ├── helpers/                 # 工具函数
│   │   ├── onVisibilityChange.ts    # 页面可见性监控
│   │   └── getNetworkInformation.ts # 网络信息获取
│   │
│   ├── error/                   # 错误追踪模块
│   │   └── index.ts             # ErrorTrace 类
│   │
│   └── tools/                   # 工具函数集
│       └── isSupported.ts       # 功能检测
│
├── dist/                        # 构建产物（自动生成）
│   ├── web_sdk.js              # CommonJS 格式
│   ├── web_sdk.module.js       # ES Module 格式
│   ├── web_sdk.umd.js          # UMD 格式（浏览器）
│   └── typings/                # TypeScript 类型定义
│
├── docs/                        # 文档目录
├── examples/                    # 示例代码
├── typings/                     # 生成的类型声明
│
├── package.json                 # 项目元数据和脚本
├── tsconfig.json               # TypeScript 配置
├── api-extractor.json          # API 提取工具配置
├── tsdoc-metadata.json         # TSDoc 元数据
└── README.md                   # 本文件
```

### 关键模块说明

#### 1. performance/ - 性能指标采集

**职责**: 使用浏览器 PerformanceObserver API 采集各类性能指标

**关键文件**:
- `observe.ts`: 初始化所有 Observer 实例
- `paint.ts`: 监控 FCP（首次内容绘制）和 LCP（最大内容绘制）
- `firstInput.ts`: 监控 FID（首次输入延迟）
- `cumulativeLayoutShift.ts`: 监控 CLS（累积布局偏移）

**工作流**:
```
页面加载
  ↓
initPerformanceObserver()
  ↓
创建 PerformanceObserver 实例
  ↓
监听性能事件
  ↓
通过 logData() 记录数据
  ↓
触发 analyticsTracker 回调
```

#### 2. data/ - 数据处理与上报

**职责**: 收集、格式化、汇总和上报所有性能数据

**关键文件**:
- `log.ts`: 统一的数据记录入口
- `ReportData.ts`: 向服务器上报数据
- `analyticsTracker.ts`: 数据处理的主逻辑

**数据流**:
```
原始性能数据
  ↓
log() 函数记录
  ↓
analyticsTracker 处理
  ↓
格式化数据
  ↓
ReportData.sendToAnalytics() 上报
```

#### 3. helpers/ - 辅助工具

**职责**: 提供常用的工具函数

**功能**:
- 页面可见性检测
- 网络信息获取
- 设备信息采集

#### 4. error/ - 错误追踪

**职责**: 捕获 JavaScript 运行时错误

**工作原理**:
```
浏览器发生 JS 错误
  ↓
window.onerror 或 unhandledrejection 监听
  ↓
ErrorTrace 捕获
  ↓
格式化错误信息
  ↓
上报到数据服务
```

---

## 高级用法

### 1. 自定义分析工具

实现自定义的 analyticsTracker 来完全控制数据处理流程：

```typescript
import WEB_SDK from 'web_sdk';

const sdk = new WEB_SDK({
  logUrl: 'https://api.example.com/logs',
  
  analyticsTracker: (options) => {
    const {
      metricName,
      data,
      eventProperties,
      navigatorInformation,
      vitalsScore
    } = options;
    
    // 根据指标类型执行不同的处理
    switch (metricName) {
      case 'navigationTiming':
        console.log('导航时序数据:', data);
        analyzeLoadPerformance(data);
        break;
        
      case 'FCP':
      case 'LCP':
        console.log('绘制性能:', metricName, data);
        if (vitalsScore === 'poor') {
          alertPerformanceIssue(metricName);
        }
        break;
        
      case 'FID':
        console.log('交互性能:', metricName, data);
        break;
        
      default:
        console.log('其他指标:', metricName, data);
    }
  }
});
```

### 2. 手动上报自定义指标

```typescript
import WEB_SDK, { AskPriority } from 'web_sdk';

const sdk = new WEB_SDK({ logUrl });

// 上报自定义事件
function reportCustomMetric(metricName, value) {
  sdk.reportData.sendToAnalytics(
    AskPriority.IDLE, // 使用 IDLE 优先级
    JSON.stringify({
      type: 'custom_metric',
      name: metricName,
      value: value,
      timestamp: Date.now()
    })
  );
}

// 使用示例
reportCustomMetric('checkout_time', 2500);
reportCustomMetric('api_response_time', 1200);
```

### 3. 条件初始化

根据环境和用户配置，有条件地初始化 SDK：

```typescript
import WEB_SDK from 'web_sdk';

// 仅在生产环境中初始化
if (process.env.NODE_ENV === 'production') {
  const sdk = new WEB_SDK({
    logUrl: process.env.REACT_APP_LOG_URL,
    captureError: true,
    resourceTiming: !isLowEndDevice(),
    elementTiming: !isLowEndDevice(),
    maxMeasureTime: isLowEndDevice() ? 10000 : 15000
  });
}

function isLowEndDevice() {
  // 根据设备性能判断
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
    return true;
  }
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    return true;
  }
  return false;
}
```

### 4. 与 Google Analytics 集成

```typescript
import WEB_SDK from 'web_sdk';

declare global {
  function gtag(...args: any[]): void;
}

const sdk = new WEB_SDK({
  logUrl: 'https://api.example.com/logs',
  
  analyticsTracker: (options) => {
    // 同时发送到 Google Analytics
    gtag('event', options.metricName, {
      metric_value: options.data,
      metric_score: options.vitalsScore,
      device_memory: options.navigatorInformation.deviceMemory,
      cpu_cores: options.navigatorInformation.hardwareConcurrency
    });
  }
});
```

### 5. 与 Sentry 集成

```typescript
import WEB_SDK from 'web_sdk';
import * as Sentry from '@sentry/browser';

const sdk = new WEB_SDK({
  logUrl: 'https://api.example.com/logs',
  captureError: false, // 禁用 SDK 的错误捕获
  
  analyticsTracker: (options) => {
    // 性能数据同步到 Sentry
    Sentry.captureMessage(`Performance: ${options.metricName}`, 'info', {
      contexts: {
        performance: {
          metric_name: options.metricName,
          metric_value: options.data,
          vitals_score: options.vitalsScore
        }
      }
    });
  }
});
```

### 6. 数据采样

实现采样策略以减少上报数据量：

```typescript
import WEB_SDK from 'web_sdk';

// 定义采样率
const SAMPLING_RATES = {
  navigationTiming: 1.0,    // 100% 采样
  resourceTiming: 0.1,      // 10% 采样
  FID: 0.5,                 // 50% 采样
  default: 0.3              // 其他指标 30% 采样
};

function shouldSample(metricName) {
  const rate = SAMPLING_RATES[metricName] || SAMPLING_RATES.default;
  return Math.random() < rate;
}

const sdk = new WEB_SDK({
  logUrl: 'https://api.example.com/logs',
  
  analyticsTracker: (options) => {
    if (shouldSample(options.metricName)) {
      // 这条数据将被上报
      sdk.reportData.sendToAnalytics(
        1, // URGENT
        JSON.stringify(options)
      );
    }
  }
});
```

---

## 性能指标详细说明

### 绘制性能指标

#### FCP (First Contentful Paint)

```
定义: 用户首次看到页面内容的时间点

计算方式:
  导航开始 → 第一个像素绘制到屏幕

健康范围:
  ✓ 优秀: < 1.8s
  ⚠ 需改进: 1.8s - 3s
  ✗ 需优化: > 3s

优化建议:
  1. 减小 CSS/JS 文件大小
  2. 延迟加载非关键资源
  3. 使用服务端渲染 (SSR)
  4. 开启 Gzip 压缩
```

#### LCP (Largest Contentful Paint)

```
定义: 可视区域内最大内容元素的渲染时间

计算方式:
  监控 <img>, <video>, 文本块等元素的大小和绘制时机

健康范围:
  ✓ 优秀: < 2.5s
  ⚠ 需改进: 2.5s - 4s
  ✗ 需优化: > 4s

常见问题元素:
  - 大图片（未优化）
  - 背景图片（CSS）
  - 大型视频
  - 动态加载的内容

优化建议:
  1. 图片优化（WebP、适配不同尺寸）
  2. 字体优化（system-ui、font-display）
  3. 关键资源优先加载
  4. 减少阻塞渲染的 JS
```

### 交互性能指标

#### FID (First Input Delay)

```
定义: 用户首次交互到浏览器响应的延迟时间

关键点:
  FID 已被 INP (Interaction to Next Paint) 替代，但仍重要

计算方式:
  用户点击/按键 → 浏览器开始处理事件

健康范围:
  ✓ 优秀: < 100ms
  ⚠ 需改进: 100ms - 300ms
  ✗ 需优化: > 300ms

优化建议:
  1. 减少 JavaScript 执行时间
  2. 使用 Web Workers 处理复杂任务
  3. 拆分长任务（task splitting）
  4. 优化事件处理器
```

### 视觉稳定性指标

#### CLS (Cumulative Layout Shift)

```
定义: 页面加载过程中意外布局变化的累积量

计算公式:
  CLS = Σ(影响分数 × 距离分数) for each layout shift

健康范围:
  ✓ 优秀: < 0.1
  ⚠ 需改进: 0.1 - 0.25
  ✗ 需优化: > 0.25

常见原因:
  - 加载字体时的文本抖动
  - 动态内容插入
  - 广告/嵌入式内容
  - 动画

优化建议:
  1. 为图片/视频预设宽高
  2. 避免在已有内容上方插入新内容
  3. font-display: optional
  4. transform 替代 position 变更
```

### 导航时序指标

#### DNS 查询时间

```
定义: 域名解析耗时

计算方式:
  domainLookupEnd - domainLookupStart

优化建议:
  1. 使用 DNS 预解析
     <link rel="dns-prefetch" href="//example.com">
  2. 减少不必要的域名
  3. 选择更快的 DNS 服务商
```

#### TCP 连接时间

```
定义: 建立 TCP 连接的耗时

计算方式:
  connectEnd - connectStart

优化建议:
  1. 使用 CDN 缩短物理距离
  2. HTTP/2 多路复用
  3. TCP Fast Open
  4. 连接复用 (Keep-Alive)
```

#### TTFB (Time To First Byte)

```
定义: 首字节时间，反应服务器响应速度

计算方式:
  responseStart - navigationStart

健康范围:
  ✓ 优秀: < 600ms
  ⚠ 需改进: 600ms - 1000ms
  ✗ 需优化: > 1000ms

优化建议:
  1. 优化服务端处理
  2. 使用缓存（CDN、浏览器缓存）
  3. 减少中间件处理
  4. 地理位置优化
```

---

## 错误处理

### 初始化错误

```typescript
import WEB_SDK from 'web_sdk';

try {
  const sdk = new WEB_SDK({
    // 缺少 logUrl
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('初始化失败:', error.message);
    // 输出: "京程一灯系统监控平台1.0.0提示未传递logUrl"
    
    // 可选：降级处理
    fallbackMonitoring();
  }
}
```

### 浏览器兼容性检查

```typescript
import { isPerformanceSupported } from 'web_sdk/tools';

if (!isPerformanceSupported()) {
  console.warn('当前浏览器不支持性能监控 API');
  // 降级处理
} else {
  const sdk = new WEB_SDK({ logUrl });
}
```

### 网络错误重试

```typescript
// SDK 内部已实现上报失败重试
// ReportData 类会自动处理网络错误

// 如需自定义错误处理：
const sdk = new WEB_SDK({
  logUrl: 'https://api.example.com/logs',
  
  analyticsTracker: async (options) => {
    try {
      await sdk.reportData.sendToAnalytics(
        1,
        JSON.stringify(options)
      );
    } catch (error) {
      console.error('上报失败:', error);
      // 可选：存储到 localStorage 后续重试
      saveToOfflineQueue(options);
    }
  }
});
```

---

## 浏览器兼容性

### 性能 API 支持情况

| API | Chrome | Firefox | Safari | Edge | IE |
|-----|--------|---------|--------|------|-----|
| Navigation Timing | ✓ 6+ | ✓ 7+ | ✓ 8+ | ✓ 12+ | ✗ |
| Resource Timing | ✓ 29+ | ✓ 10+ | ✓ 10.1+ | ✓ 12+ | ✗ |
| Paint Timing | ✓ 60+ | ✓ 45+ | ✓ 15.1+ | ✓ 79+ | ✗ |
| Long Tasks API | ✓ 58+ | ✗ | ✗ | ✓ 79+ | ✗ |
| PerformanceObserver | ✓ 52+ | ✓ 57+ | ✓ 13.1+ | ✓ 79+ | ✗ |
| Layout Instability | ✓ 73+ | ✓ 69+ | ✓ 15.1+ | ✓ 79+ | ✗ |
| Element Timing | ✓ 77+ | ✗ | ✗ | ✓ 79+ | ✗ |

### 降级策略

SDK 会自动进行功能检测和降级：

```typescript
// SDK 内部代码示例
if (!isPerformanceSupported()) {
  // 浏览器不支持 Performance API
  console.warn('浏览器不支持性能监控');
  return; // 静默退出，不会影响主程序
}

if ('PerformanceObserver' in window) {
  // 使用 PerformanceObserver
  initPerformanceObserver();
} else {
  // 降级使用 Legacy API（window.performance）
  useLegacyPerformanceAPI();
}
```

### 推荐最低版本

- **Chrome**: 60+ (PerformanceObserver)
- **Firefox**: 55+ (PerformanceObserver)
- **Safari**: 13+ (基本支持)
- **Edge**: 79+ (Chromium 版本)

---

## 常见问题

### Q1: SDK 会影响页面性能吗？

**A**: 不会有明显影响。SDK 使用了以下优化措施：
- 异步非阻塞的数据收集
- PerformanceObserver 使用事件驱动（不轮询）
- 数据聚合后批量上报
- 零依赖，代码体积小（< 30KB gzipped）

### Q2: 如何保证用户隐私？

**A**: SDK 本身不收集个人身份信息，只收集性能指标。隐私保护建议：
- 不要在自定义 analyticsTracker 中上报用户 ID（直接）
- 服务端应对 IP 地址进行脱敏处理
- 遵守 GDPR/CCPA 等隐私法规

```typescript
// ✗ 错误做法
analyticsTracker: (options) => {
  sdk.reportData.sendToAnalytics(1, JSON.stringify({
    ...options,
    userId: user.id, // 直接上报用户 ID
    email: user.email // 直接上报邮箱
  }));
}

// ✓ 正确做法
analyticsTracker: (options) => {
  sdk.reportData.sendToAnalytics(1, JSON.stringify({
    ...options,
    sessionId: anonymousSessionId(), // 匿名 Session ID
    userSegment: getUserSegment(user) // 用户分组
  }));
}
```

### Q3: 如何处理离线场景？

**A**: SDK 不内置离线队列，但可自行扩展：

```typescript
class OfflineAwareTracker {
  private queue: any[] = [];
  
  constructor(sdk) {
    this.setupOfflineQueue();
  }
  
  private setupOfflineQueue() {
    window.addEventListener('online', () => {
      this.flushQueue();
    });
  }
  
  private async flushQueue() {
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      try {
        await this.sendData(item);
      } catch (error) {
        this.queue.unshift(item); // 恢复队列
        break;
      }
    }
  }
}
```

### Q4: 性能指标什么时候开始收集？

**A**: 初始化 SDK 后立即开始收集：
- 导航时序：页面加载开始时已记录
- FCP/LCP：首次绘制时立即监控
- FID：用户交互时立即监控
- CLS：页面加载过程中持续监控

### Q5: 如何测试 SDK 的功能？

**A**: 在本地开发环境测试：

```bash
# 1. 克隆项目
git clone https://github.com/wyle-timing-xx/web-sdk.git

# 2. 安装依赖
pnpm install

# 3. 开发模式构建
pnpm run dev

# 4. 运行示例
pnpm run example:run

# 5. 访问 http://localhost:1234
```

### Q6: 如何自定义上报端点？

**A**: 通过 `logUrl` 配置：

```typescript
const sdk = new WEB_SDK({
  logUrl: process.env.NODE_ENV === 'production'
    ? 'https://prod-api.example.com/logs'
    : 'https://dev-api.example.com/logs',
  
  analyticsTracker: (options) => {
    // 可进一步自定义上报逻辑
    const endpoint = shouldUseFallback() 
      ? 'https://fallback-api.example.com/logs'
      : 'https://primary-api.example.com/logs';
    
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(options)
    });
  }
});
```

---

## 开发指南

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/wyle-timing-xx/web-sdk.git
cd web-sdk

# 安装依赖（推荐使用 pnpm）
pnpm install

# 或使用 npm
npm install
```

### 开发工作流

```bash
# 开启文件监听，自动编译
pnpm run dev

# 在另一个终端，运行示例应用
pnpm run example:run

# 浏览器访问 http://localhost:1234
```

### 构建项目

```bash
# 生成生产环境的构建产物
pnpm run build

# 输出文件：
# - dist/web_sdk.js            (CommonJS)
# - dist/web_sdk.module.js     (ES Module)
# - dist/web_sdk.umd.js        (UMD)
# - dist/typings/index.d.ts    (类型定义)
```

### 生成 API 文档

```bash
# 使用 api-extractor 提取 API
pnpm run api:run

# 使用 typedoc 生成 HTML 文档
pnpm run api:doc

# 文档输出到 ./docs 目录
```

### 项目配置说明

#### package.json 脚本

| 脚本 | 说明 |
|------|------|
| `build` | 使用 microbundle 构建发布版本 |
| `dev` | 开启监听模式，自动编译 |
| `example:run` | 使用 parcel 运行示例应用 |
| `api:init` | 初始化 api-extractor 配置 |
| `api:run` | 执行 api-extractor 提取 API |
| `api:doc` | 使用 typedoc 生成文档 |

#### tsconfig.json 重点配置

```json
{
  "compilerOptions": {
    "strict": true,              // 严格模式
    "declaration": true,         // 生成 .d.ts 文件
    "module": "ESNext",          // ES Module 输出
    "target": "ESNext",          // 编译目标
    "noImplicitAny": true,       // 禁止隐式 any
    "moduleResolution": "node"   // 模块解析策略
  }
}
```

### 核心代码架构

#### 初始化流程

```typescript
// src/web_sdk.ts
constructor(options: Iweb_sdkOptions = {}) {
  // 1. 验证必填参数
  if (!logUrl) throw new Error(...);
  
  // 2. 初始化配置
  config.reportData = new ReportData({ logUrl });
  config.analyticsTracker = options.analyticsTracker || analyticsTracker;
  
  // 3. 功能检测
  if (!isPerformanceSupported()) return;
  
  // 4. 初始化性能监控
  if ('PerformanceObserver' in window) {
    initPerformanceObserver();
  }
  
  // 5. 采集基础数据
  logData('navigationTiming', getNavigationTiming());
  logData('networkInformation', getNetworkInformation());
}
```

#### 数据流向

```
┌──────────────────────────┐
│   Performance Events     │
│  (FCP/LCP/FID/CLS etc)  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   PerformanceObserver    │
│   (监听性能指标)         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   logData()              │
│   (记录数据到内存)       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   analyticsTracker()     │
│   (自定义数据处理)       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   ReportData             │
│   (上报到服务器)         │
└──────────────────────────┘
```

### 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

**代码规范**:
- 使用 TypeScript，启用严格模式
- 遵循 ESLint 配置
- 添加必要的 JSDoc 注释
- 编写单元测试（推荐）

---

## 更新日志

### v1.0.0 (初始发布)

**新增功能**:
- ✨ 核心性能监控功能
- ✨ 支持 FCP/LCP/FID/CLS 等 Web Vitals
- ✨ 导航时序数据采集
- ✨ 网络信息监控
- ✨ 错误追踪（可选）
- ✨ 自定义分析工具支持
- ✨ 完整的 TypeScript 类型定义

**特性**:
- 零依赖，轻量级设计
- 支持多种输出格式（CJS/ESM/UMD）
- 自动浏览器兼容性检测
- 异步非阻塞数据收集

**已知限制**:
- IE 11 不支持（需要 polyfill）
- 某些 API 在旧版浏览器中不可用

---

## 许可证

ISC License - 详见 LICENSE 文件

---

## 相关资源

- [Web Vitals 官方指南](https://web.dev/vitals/)
- [Performance Observer API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
- [Navigation Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API)
- [Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API)
- [Lighthouse 性能审计](https://developers.google.com/web/tools/lighthouse)

---

## 获取帮助

- 📖 查看 [完整 API 文档](./docs)
- 🐛 提交 [Issue](https://github.com/wyle-timing-xx/web-sdk/issues)
- 💬 参与 [讨论](https://github.com/wyle-timing-xx/web-sdk/discussions)

---

**最后更新**: 2025 年 11 月  
**文档维护者**: 京程一灯团队  
**问题反馈**: 欢迎通过 Issue 或 Pull Request 反馈
