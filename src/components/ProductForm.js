import React, { useState, useContext, useEffect, useCallback } from 'react'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import './Form.css'
import StoreContext from '../context/StoreContext'

const ProductForm = ({ product }) => {
  const {
    options,
    variants,
    variants: [initialVariant],
    priceRange: { minVariantPrice },
  } = product
  const [variant, setVariant] = useState({ ...initialVariant })
  const [quantity, setQuantity] = useState(1)
  const {
    addVariantToCart,
    //store: { client, adding, checkout },
    store: { client, adding },
  } = useContext(StoreContext)

  const productVariant =
    client.product.helpers.variantForOptions(product, variant) || variant
  const [available, setAvailable] = useState(productVariant.availableForSale)
/* eslint-disable react-hooks/exhaustive-deps */
  const checkAvailability = useCallback(
    productId => {
      client.product.fetch(productId).then(fetchedProduct => {
        // this checks the currently selected variant for availability
        const result = fetchedProduct.variants.filter(
          variant => variant.id === productVariant.shopifyId
        )
        if (result.length > 0) {
          setAvailable(result[0].available)
        }
      })
    },
    [client.product, productVariant.shopifyId, variants]
  )
/* eslint-ensable react-hooks/exhaustive-deps */ 
  useEffect(() => {
    checkAvailability(product.shopifyId)
  }, [productVariant, checkAvailability, product.shopifyId])

  const handleQuantityChange = ({ target }) => {
    setQuantity(target.value)
  }

  const handleOptionChange = (optionIndex, { target }) => {
    const { value } = target
    const currentOptions = [...variant.selectedOptions]

    currentOptions[optionIndex] = {
      ...currentOptions[optionIndex],
      value,
    }

    const selectedVariant = find(variants, ({ selectedOptions }) =>
      isEqual(currentOptions, selectedOptions)
    )

    setVariant({ ...selectedVariant })
  }

  const handleAddToCart = () => {
    let addCartReturn = addVariantToCart(productVariant.shopifyId, quantity)
    addCartReturn.then(function() {
      //window.open(checkout.webUrl)
      window.open('/cart', '_self')
    })
  }

  const checkDisabled = (name, value) => {
    const match = find(variants, {
      selectedOptions: [
        {
          name: name,
          value: value,
        },
      ],
    })
    if (match === undefined) return true
    if (match.availableForSale === true) return false
    return true
  }

  const price = Intl.NumberFormat(undefined, {
    currency: minVariantPrice.currencyCode,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(variant.price)

  const compareAtPrice = Intl.NumberFormat(undefined, {
    currency: minVariantPrice.currencyCode,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(variant.compareAtPrice)

  return (
    <center>
      {options.map(({ id, name, values }, index) => (
        <React.Fragment key={id}>
          <label className="Form--Label" style={{ width: '33%' }}>
            {name}
          </label>
          <label className="Form--Label has-arrow" style={{ width: '33%' }}>
            <select
              name={name}
              className="Form--Input Form--Select"
              key={id}
              onBlur={event => handleOptionChange(index, event)}
            >
              {values.map(value => (
                <option
                  value={value}
                  key={`${name}-${value}`}
                  disabled={checkDisabled(name, value)}
                >
                  {value}
                </option>
              ))}
            </select>
          </label>
        </React.Fragment>
      ))}
      <input
        type="hidden"
        id="quantity"
        name="quantity"
        min="1"
        step="1"
        onChange={handleQuantityChange}
        value={quantity}
      />
      <br />
      <button
        type="submit"
        className="Button"
        style={{ background: 'var(--midGrey)', color: 'var(--secondary)' }}
        disabled={!available || adding}
        onClick={handleAddToCart}
      >
        ADD TO CART
      </button>

      <h3>
        {price}
        {`  `}
        {productVariant.compareAtPrice && compareAtPrice !== price && (
          <span style={{ textDecoration: 'line-through' }}>
            {compareAtPrice}
          </span>
        )}
      </h3>
      {!available && <p>This Product is out of Stock!</p>}
    </center>
  )
}

ProductForm.propTypes = {
  product: PropTypes.shape({
    descriptionHtml: PropTypes.string,
    handle: PropTypes.string,
    id: PropTypes.string,
    shopifyId: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        originalSrc: PropTypes.string,
      })
    ),
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    productType: PropTypes.string,
    title: PropTypes.string,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        availableForSale: PropTypes.bool,
        id: PropTypes.string,
        price: PropTypes.string,
        compareAtPrice: PropTypes.string,
        title: PropTypes.string,
        shopifyId: PropTypes.string,
        selectedOptions: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string,
          })
        ),
      })
    ),
  }),
  addVariantToCart: PropTypes.func,
}

export default ProductForm
