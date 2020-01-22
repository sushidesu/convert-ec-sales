<script>
  export let files
  import Format from "date-format"
  import { read, convert, addHeader, write } from "./convertEC"
  import Descriptions from "./Descriptions.svelte"
  import Footer from "./Footer.svelte"

  const onClick = async () => {
    if (files.length === 0) return
    const converted = await Array.from(files)
      .map(file => read(file))
      .map(async text => convert(await text))
      .reduce(async (acu, cur) => {
        const all = await acu
        return all.concat(await cur)
      }, [])

    const csv = addHeader(converted)
    const filename = Format.asString("net_yyyyMMdd_hhmmss", new Date())
    write(csv, filename)
  }
</script>

<div class="wrapper">
  <main>
    <h1>Convert EC sales</h1>
    <p>各ショップの売上csvを在庫管理システムに取り込める形に変換します。</p>
    <div class="convert">
      <input
        class="input"
        type="file"
        accept=".csv"
        multiple="multiple"
        bind:files />
      <button on:click={onClick}>変換</button>
    </div>

    <hr />

    <Descriptions />
  </main>

  <Footer />
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0;
    flex: 1;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2em;
    font-weight: bold;
  }

  hr {
    border-top: 1px solid #ccc;
    transform: scaleX(1.04);
  }

  .convert {
    margin: 3em 0;
    display: flex;
    flex-direction: column;
  }
  .input {
    width: 100%;
    height: 100px;
    border: 2px dashed #ccc;
  }
</style>
