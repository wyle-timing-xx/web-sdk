import ReportData from '../data/ReportData';
import { Iweb_sdkConfig, IReportData } from '../typings/types';

export const config: Iweb_sdkConfig = {
  // Metrics
  reportData: new ReportData({ logUrl: 'hole' }),
  isResourceTiming: false,
  isElementTiming: false,
  // Logging
  maxTime: 15000,
};
