<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { resolve } from '$app/paths';
	import { loadCompanies, sectorOrder, ratioLabel } from '#lib/data.js';
	import SectorBars from '#lib/SectorBars.svelte';
	import CompanyStrip from '#lib/CompanyStrip.svelte';

	let data = $state.raw(null);

	// Linking (highlight only): hovering a sector bar dims other sectors' dots.
	let hoveredSector = $state(null);

	// Filtering: clicking a sector bar keeps only that sector's companies (click again to clear).
	let selectedSector = $state(null);

	let order = $derived(data ? sectorOrder(data) : []);

	// The company view and the summary line read this subset; the bars keep every sector.
	let filtered = $derived(
		data && selectedSector ? data.filter((d) => d.sector === selectedSector) : data
	);

	onMount(async () => {
		data = await loadCompanies();
	});
</script>

<main>
	<p class="back"><a href={resolve('/')}>← All prototypes</a></p>
	<header>
		<h1>Prototype A: Which sectors have the biggest CEO-to-worker pay gaps?</h1>
		<p class="source">
			Data: AFL-CIO Executive Paywatch (Kaggle copy), S&P 500 companies, fiscal year 2021.
		</p>
	</header>

	{#if data}
		<p class="showing">
			Showing <strong>{filtered.length}</strong> companies in
			<strong>{selectedSector ?? 'all sectors'}</strong> · median pay ratio
			<strong>{ratioLabel(d3.median(filtered, (d) => d.ratio))}</strong>
			{#if selectedSector}
				· <button onclick={() => (selectedSector = null)}>Show all sectors</button>
			{/if}
		</p>
		<div class="views">
			<section>
				<h2>1. Sectors (overview)</h2>
				<p class="hint">Hover a sector to highlight its companies; click to show only that sector.</p>
				<SectorBars
					{data}
					{order}
					{hoveredSector}
					{selectedSector}
					onhover={(s) => (hoveredSector = s)}
					onselect={(s) => (selectedSector = selectedSector === s ? null : s)}
				/>
			</section>
			<section>
				<h2>2. Companies (detail)</h2>
				<p class="hint">Each dot is one company. Hover a dot for its pay details.</p>
				<CompanyStrip data={filtered} {order} {hoveredSector} />
			</section>
		</div>
		<p class="note">
			Each company chooses its own "median employee" (sometimes part-time or outside the U.S.),
			which explains some extreme ratios.
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
		grid-template-columns: 1fr 1.2fr;
		gap: 24px;
		align-items: start;
	}
	@media (max-width: 800px) {
		.views {
			grid-template-columns: 1fr;
		}
	}
</style>
