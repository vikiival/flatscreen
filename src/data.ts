import { getClient, extendFields } from '@kodadot1/uniquery'
import { $purify as purify } from '@kodadot1/minipfs'
import QRCode from 'qrcode'

export type Item = {
  name: string
  image: string
  price: string
  id: string
  author: string
  url: string
  qrCode: string
}

export async function getItems(): Promise<Item[]> {
  const client = getClient('bsx')
  const query = client.itemListByCollectionId('21032023', {
    fields: extendFields(['meta', 'price']),
    orderBy: 'createdAt_ASC',
  })

  const result: any = await client.fetch(query)

  const items = await Promise.all(
    (result?.data?.items ?? []).map(async (item) => {
      const url = `https://kodadot.xyz/bsx/gallery/${item.id}`
      const qrCode = await QRCode.toDataURL(url)

      return {
        name: item.name,
        image: purify(item.meta.image).at(0),
        price: item.price,
        id: item.id,
        author: item.currentOwner,
        url,
        qrCode,
      }
    })
  )

  return items
}