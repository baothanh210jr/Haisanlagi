const url = 'http://localhost:8055'

async function main() {
  try {
    const resCats = await fetch(`${url}/items/categories?limit=4`)
    console.log('Categories status:', resCats.status)
    console.log(await resCats.text())

    const resProds = await fetch(`${url}/items/products?limit=4`)
    console.log('Products status:', resProds.status)
    console.log(await resProds.text())

    const resSlides = await fetch(`${url}/items/home_slides?limit=4`)
    console.log('Home slides status:', resSlides.status)
    console.log(await resSlides.text())
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

main()