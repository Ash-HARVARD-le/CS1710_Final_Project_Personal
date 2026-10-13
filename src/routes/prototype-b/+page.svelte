<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { resolve } from '$app/paths';
	import { loadCompanies, sectorOrder, ratioLabel } from '#lib/data.js';
	import PayScatter from '#lib/PayScatter.svelte';
	import SectorBars from '#lib/SectorBars.svelte';
	import WorkdaysCard from '#lib/WorkdaysCard.svelte';

	let data = $state.raw(null);

	// Filtering: the scatterplot brush sets { worker: [min, max], ceo: [min, max] } (null = all).
	let brushRange = $state(null);

	// Linking (highlight only): hovering a sector bar dims other sectors' dots.
	let hoveredSector = $state(null);

	// Details on demand: clicking a dot picks one company for the workdays card.
	let selectedTicker = $state(null);

	let order = $derived(data ? sectorOrder(data) : []);

	// The sector bars and summary line read this subset; the scatterplot keeps every company.
	let filtered = $derived(
		data && brushRange
			? data.filter(
					(d) =>
						d.workerPay >= brushRange.worker[0] &&
						d.workerPay <= brushRange.worker[1] &&
						d.ceoPay >= brushRange.ceo[0] &&
						d.ceoPay <= brushRange.ceo[1]
				)
			: data
	);

	let selectedCompany = $derived(data?.find((d) => d.ticker === selectedTicker) ?? null);

	onMount(async () => {
		data = await loadCompanies();
	});
</script>

<main>
	<p class="back"><a href={resolve('/')}>← All prototypes</a></p>
	<header>
		<h1>Prototype B: How do CEO pay and worker pay compare, company by company?</h1>
		<p class="source">
			Data: AFL-CIO Executive Paywatch (Kaggle copy), S&P 500 companies, fiscal year 2021.
		</p>
	</header>

	{#if data}
		<p class="showing">
			<strong>{filtered.length}</strong> of {data.length} companies {brushRange
				? 'selected'
				: '(drag on the chart to select a group)'}
			{#if filtered.length}
				· median pay ratio <strong>{ratioLabel(d3.median(filtered, (d) => d.ratio))}</strong>
			{/if}
		</p>
		<div class="views">
			<section>
				<h2>1. Every company</h2>
				<p class="hint">
					Drag on empty space to select companies; click empty space to clear. Click a dot for its
					details. Dashed lines mark equal pay ratios.
				</p>
				<PayScatter
					{data}
					{brushRange}
					{hoveredSector}
					{selectedTicker}
					onbrush={(r) => (brushRange = r)}
					onselect={(t) => (selectedTicker = selectedTicker === t ? null : t)}
				/>
			</section>
			<div class="side">
				<section>
					<h2>2. One company: the CEO's workdays</h2>
					<WorkdaysCard company={selectedCompany} />
				</section>
				<section>
					<h2>3. Selected companies by sector</h2>
					<p class="hint">Hover a sector to highlight its companies in the chart.</p>
					<SectorBars
						data={filtered}
						{order}
						{hoveredSector}
						onhover={(s) => (hoveredSector = s)}
					/>
				</section>
			</div>
		</div>
		<p class="note">
			Workdays assume 260 workdays per year. Each company chooses its own "median employee"
			(sometimes part-time or outside the U.S.).
		</p>
	{:else}
		<p>Loading data…</p>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		background: #f7f7f8;
		color: #222;
		font-family: system-ui, sans-serif;
	}
	main {
		max-width: 1150px;
		margin: 0 auto;
		padding: 16px;
	}
	h1 {
		margin: 0;
		font-size: 22px;
	}
	h2 {
		margin: 0 0 4px;
		font-size: 16px;
	}
	.back {
		margin: 0 0 8px;
		font-size: 14px;
	}
	.source,
	.hint,
	.note {
		margin: 4px 0;
		font-size: 13px;
		color: #555;
	}
	.showing {
		font-size: 15px;
		color: #555;
	}
	.showing strong {
		color: #222;
	}
	.views {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 24px;
		align-items: start;
	}
	.side {
		display: grid;
		gap: 20px;
	}
	@media (max-width: 800px) {
		.views {
			grid-template-columns: 1fr;
		}
	}
</style>
