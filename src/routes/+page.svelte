<script>
	import { resolve } from '$app/paths';
</script>

<main>
	<h1>CEO Pay, Worker Pay, and the Cost of Living</h1>
	<p>CS 1710 Final Project · Milestone 6: interactive dashboard prototypes</p>
	<p>
		Both prototypes explore one question for labor union representatives: <strong
			>which sectors and companies have the biggest gaps between CEO pay and median worker pay?</strong
		>
	</p>
	<ul>
		<li>
			<a href={resolve('/prototype-a')}>Prototype A: Sector overview → company detail</a>
			— hover a sector to highlight its companies, click to filter.
		</li>
		<li>
			<a href={resolve('/prototype-b')}>Prototype B: Company scatterplot → sectors and workdays</a>
			— drag to select companies, click one to see its CEO's workdays.
		</li>
	</ul>
	<p class="source">Data: AFL-CIO Executive Paywatch (Kaggle copy), S&P 500, fiscal year 2021.</p>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #f7f7f8;
		color: #222;
		font-family: system-ui, sans-serif;
	}
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 24px 16px;
		line-height: 1.5;
	}
	h1 {
		font-size: 24px;
	}
	li {
		margin-bottom: 8px;
	}
	.source {
		font-size: 13px;
		color: #555;
	}
</style>
