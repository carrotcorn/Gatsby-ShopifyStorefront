import React from 'react'
import './Footer.css'

export default () => (
  <div>
    <footer className="footer">
      <div className="container taCenter">
        <span>
          by{' '}
          <a
            href="https://www.eric-bourne.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eric Bourne{' '}
          </a>{' '}
          <br /> For Educational Purposes {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  </div>
)
