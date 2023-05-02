<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'
  import Image, { preloadImage } from './Image.svelte'
  import { getItems } from './data'
  import type { Item } from './data'

  let randomIndex1 = 16
  let randomIndex2 = 7

  let allItems: Item[] = []
  let loading = true

  $: visibleItems = allItems.length > 0 
    ? [allItems[randomIndex1], allItems[randomIndex2]] 
    : []

  onMount(async () => {
    allItems = await getItems()

    await Promise.all(allItems.map((item) => {
      return preloadImage(item.image, item.name)
    }))

    loading = false

    setInterval(() => {
      let tempRandomIndex1 = 0
      let tempRandomIndex2 = 0

      while (
        tempRandomIndex1 === tempRandomIndex2 ||
        tempRandomIndex1 === randomIndex1 ||
        tempRandomIndex1 === randomIndex2 ||
        tempRandomIndex2 === randomIndex1 ||
        tempRandomIndex2 === randomIndex2
      ) {
        tempRandomIndex1 = Math.random() * allItems.length | 0
        tempRandomIndex2 = Math.random() * allItems.length | 0
      }

      randomIndex1 = tempRandomIndex1
      randomIndex2 = tempRandomIndex2
    }, 2000)
  })
</script>

<main class="h-screen flex bg-stone-200 overflow-hidden">
  {#if loading}
    <div class="flex-1 flex items-center justify-center">
      <h1 class="font-extrabold text-5xl">Loading ...</h1>
    </div>
  {:else}
    <div in:fade class="flex-1 flex justify-center items-center p-10 space-x-20">
      {#each visibleItems as item (item.id)}
        <section in:fade={{ duration: 300 }} class="w-2/6 flex flex-col bg-white p-7 border border-black space-y-5 shadow-[10px_10px_0_-0_black]">
          <Image src={item.image} />

          <div class="flex items-center">
            <div class="flex flex-col justify-center space-y-4">
              <h1 class="text-5xl font-extrabold">{item.name}</h1>
              <p>Made by <span class="ml-1 break-all font-mono text-pink-600">{item.author}</span></p>
            </div>
            <img src={item.qrCode} alt={'QR code for' + item.name} class="ml-2 w-32 self-end">
          </div>
        </section>
      {/each}
    </div>
  {/if}
</main>