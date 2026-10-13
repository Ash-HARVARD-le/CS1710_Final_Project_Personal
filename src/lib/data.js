import * as d3 from 'd3';
import { asset } from '$app/paths';

// Kaggle copy of AFL-CIO Executive Paywatch, S&P 500, fiscal year 2021.
// Money is stored as text ("$25,670,673") and the ratio as "1,013:1".
function toNumber(text) {
	return +String(text).replace(/[$,]/g, '').split(':')[0];
}

export async function loadCompanies() {
	return d3.csv(asset('/data/ceo_data_pay_merged_sp500.csv'), parseRow);
}

export function parseRow(d) {
	return {
		ticker: d.ticker,
		company: d.company_name,
		ceo: d.ceo_name,
		// The column is called "salary" but it holds the CEO's TOTAL compensation.
		ceoPay: toNumber(d.salary),
		workerPay: toNumber(d.median_worker_pay),
		ratio: toNumber(d.pay_ratio),
		sector: decodeURIComponent(d.industry)
	};
}

// Sectors from highest to lowest median pay ratio (computed on the full dataset,
// so the order stays the same while views are filtered).
export function sectorOrder(companies) {
	return d3
		.sort(
			d3.rollups(companies, (v) => d3.median(v, (d) => d.ratio), (d) => d.sector),
			(a, b) => d3.descending(a[1], b[1])
		)
		.map((d) => d[0]);
}

// A year has about 260 workdays (52 weeks x 5 days).
export const WORKDAYS_PER_YEAR = 260;

export const money = d3.format('$,.0f');
export const moneyShort = (n) => d3.format('$.3s')(n).replace('G', 'B');
export const ratioLabel = (r) => `${d3.format(',')(Math.round(r))}:1`;
