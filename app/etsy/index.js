const express = require('express')
const fetch = require('isomorphic-unfetch')
const redisClient = require('../../helpers/redis')
const redis = require('redis')

const etsyApp = express()

const ETSY_STORE_ID = 'filmbase'

etsyApp.get('/etsy', async (req, res) => {
  try {
    const redisCacheString = await redisClient.getAsync(
      `etsy_listings_for_${ETSY_STORE_ID}`
    )
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
    if (redisCacheParsed.listings.length && cacheSecondsElapsed < 60 * 60) {
      return res.json({
        status: 'ok',
        cache: true,
        listings: redisCacheParsed.listings
      })
    }

    const etsyStoreListings = await fetch(
      `https://openapi.etsy.com/v2/shops/${ETSY_STORE_ID}/listings/active?` +
        new URLSearchParams({
          api_key: process.env.ETSY_API_KEY
        }),
      {
        method: 'GET'
      }
    )
    const etsyStoreListingsData = await etsyStoreListings.json()
    const listings = await Promise.all(
      etsyStoreListingsData.results.map(async listing => {
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
        return {
          id: listing.listing_id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          currency: listing.currency_code,
          quantity: listing.quantity,
          url: listing.url,
          section: listing.section_id,
          images: {
            ...etsyStoreListingImagesData.results.map(image => {
              return { url: image.url_570xN, rank: image.rank }
            })
          }
        }
      })
    )

    if (listings.length)
      await redisClient.set(
        `etsy_listings_for_${ETSY_STORE_ID}`,
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
      status: 'error'
    })
  }
})

module.exports = etsyApp
