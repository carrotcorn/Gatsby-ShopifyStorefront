import React, { useContext } from 'react'
import { graphql, Link } from 'gatsby'
import Image from 'gatsby-image'

import StoreContext from '../context/StoreContext'


const Search = () => {
  const {
    store: { checkout },
  } = useContext(StoreContext)

 export const searchQuery = graphql`
  {
    allShopifyProduct {
      edges {
        node {
          id
          tags
          title
        }
      }
    }
  }
`


  const getPrice = price =>
    Intl.NumberFormat(undefined, {
      currency: checkout.currencyCode ? checkout.currencyCode : 'EUR',
      minimumFractionDigits: 2,
      style: 'currency',
    }).format(parseFloat(price ? price : 0))

  return (
    <div className="Grid">
      {allShopifyProduct.edges ? (
        allShopifyProduct.edges.map(
          ({
            node: {
              id,
              handle,
              title,
              images: [firstImage],
              variants: [firstVariant],
            },
          }) => (
            <div className="PostCard Product" key={id}>
              <Link to={`/product/${handle}/`}>
                {firstImage && firstImage.localFile && (
                  <Image
                    fluid={firstImage.localFile.childImageSharp.fluid}
                    alt={handle}
                    className="PostCard--Image"
                  />
                )}
              </Link>
              <div className="PostCard--Content">
                <div className="Title">{title}</div>
                <div className="PriceTag">
                  Starting at {getPrice(firstVariant.price)}
                </div>
                <div style={{ paddingTop: '20px' }}>
                  <Link
                    to={`/product/${handle}/`}
                    style={{ width: '%' }}
                    className="Nav--CTA"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          )
        )
      ) : (
        <p>No Products found!</p>
      )}
    </div>
  )
}

export default Search
