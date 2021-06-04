const express = require('express')
const redis = require('redis')
const fetch = require('isomorphic-unfetch')

const redisClient = require('../../helpers/redis')
const { authenticationMiddleware } = require('../../helpers/authenticate')

const etsyApp = express()

const ETSY_STORE_ID = 'filmbase'
const REDIS_KEY = `etsy_listings_for_${ETSY_STORE_ID}`
const REDIS_CACHE_EXPIRY_SECONDS = 60 * 60 * 24

etsyApp.delete('/etsy/cache', authenticationMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: 'No permission to access' })
  }

  try {
    await redisClient.delAsync(REDIS_KEY)
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error
    })
  }
  return res.json({
    status: 'ok'
  })
})

etsyApp.get('/etsy', async (req, res) => {
  try {
    const redisCacheString = await redisClient.getAsync(REDIS_KEY)
    let redisCacheParsed = { listings: [] }
    try {
      redisCacheParsed = JSON.parse(redisCacheString)
      const _length = redisCacheParsed.listings.length
    } catch (error) {
      redisCacheParsed = { listings: [] }
    }
    // cache is reset every hour to observe Etsy's rate limiting of 5,000 /day
    // this limit should work fine for up to about 100 active listings
    const cacheSecondsElapsed = (Date.now() - redisCacheParsed.cached_on) / 1000
    if (
      redisCacheParsed.listings.length &&
      cacheSecondsElapsed < REDIS_CACHE_EXPIRY_SECONDS
    ) {
      return res.json({
        status: 'ok',
        cache: true,
        listings: redisCacheParsed.listings
      })
    }

    const etsyStoreListings = await fetch(
      `https://openapi.etsy.com/v2/shops/${ETSY_STORE_ID}/listings/active?` +
        new URLSearchParams({
          api_key: process.env.ETSY_API_KEY,
          currency: 'USD'
        }),
      {
        method: 'GET'
      }
    )
    const etsyStoreListingsData = await etsyStoreListings.json()

    // rate-limit requests to comply with Etsy's restrictions
    await new Promise(resolve => {
      setTimeout(() => resolve(), 1500)
    })

    let listingPromises = []

    etsyStoreListingsData.results.map((listing, count) => {
      listingPromises.push(
        new Promise(async (resolve, reject) => {
          // rate-limit requests to comply with Etsy's restrictions
          await new Promise(resolve => {
            setTimeout(() => resolve(), count * 1001)
          })

          // get image assets for listing item
          const etsyStoreListingImages = await fetch(
            `https://openapi.etsy.com/v2/listings/${listing.listing_id}/images?` +
              new URLSearchParams({
                api_key: process.env.ETSY_API_KEY
              }),
            {
              method: 'GET'
            }
          )
          const etsyStoreListingImagesData = await etsyStoreListingImages.json()

          // get price in USD for listing item
          const etsyStoreListingInventory = await fetch(
            `https://openapi.etsy.com/v2/listings/${listing.listing_id}/inventory?` +
              new URLSearchParams({
                api_key: process.env.ETSY_API_KEY
              }),
            {
              method: 'GET'
            }
          )
          const etsyStoreListingInventoryData = await etsyStoreListingInventory.json()

          // see if shipping is free to USA
          const etsyStoreListingShipping = await fetch(
            `https://openapi.etsy.com/v2/listings/${listing.listing_id}/shipping/info?` +
              new URLSearchParams({
                api_key: process.env.ETSY_API_KEY
              }),
            {
              method: 'GET'
            }
          )
          const etsyStoreListingShippingData = await etsyStoreListingShipping.json()
          let isShippingToUsFree = false
          if (
            etsyStoreListingShippingData &&
            etsyStoreListingShippingData.results
          ) {
            const usShippingData = etsyStoreListingShippingData.results.filter(
              shipping => shipping.destination_country_name === 'United States'
            )
            isShippingToUsFree = parseInt(usShippingData[0].primary_cost) === 0
          }

          resolve({
            id: listing.listing_id,
            title: listing.title,
            description: listing.description,
            price: {
              usd:
                etsyStoreListingInventoryData.results.products[0].offerings[0]
                  .price.currency_formatted_raw
            },
            shipping: {
              isFree: isShippingToUsFree
            },
            quantity: listing.quantity,
            url: listing.url,
            section: listing.section_id,
            isInhouseProduction: listing.who_made === 'i_did',
            images: {
              ...etsyStoreListingImagesData.results.map(image => {
                return { url: image.url_570xN, rank: image.rank }
              })
            }
          })
        })
      )
    })

    const listings = await Promise.all(listingPromises)

    if (listings.length)
      await redisClient.set(
        REDIS_KEY,
        JSON.stringify({
          cached_on: Date.now(),
          listings
        })
      )

    return res.json({
      status: listings.length ? 'ok' : 'error',
      cache: false,
      listings
    })
  } catch (error) {
    return res.json({
      status: 'error',
      message: error
    })
  }
})

module.exports = etsyApp
