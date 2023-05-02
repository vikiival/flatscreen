<script lang="ts" context="module">
  const images = new Map<string, HTMLImageElement>()

  export function preloadImage(src: string, alt: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img.alt = alt
      img.style.width = '100%'
      img.classList.add('border', 'border-black')
      img.onload = () => resolve()
      images.set(src, img)
    })
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  export let src: string = ''

  let root: HTMLDivElement = null

  onMount(() => {
    const image = images.get(src)
    root.appendChild(image)
  })
</script>

<div bind:this={root}></div>