<script>
	export let files
	import Format from "date-format"
	import { read, convert, write } from "./convertEC"

	const onClick = async () => {
		if (files.length === 0) return
		const text = await read(files[0])
		const converted = convert(text)
		const filename = Format.asString("net_yyyyMMdd_hhmmss", new Date())
		write(converted, filename)
	}
</script>

<main>
	<h1>Convert EC sales</h1>
	<input type="file" bind:files={files} />
	<button on:click={onClick}>OK</button>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
