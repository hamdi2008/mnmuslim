import Link from 'next/link'
import { getCategoryById } from '../lib/categories'

export default function ListingCard({ listing }) {
  const cat = getCategoryById(listing.category)
  const hasBusiness = listing.business_name && listing.business_name.trim()

  return (
    <Link href={`/listing/${listing.id}`} className="listing-card">
      <div>
        <span className="listing-cat-badge">
          {cat.icon} {cat.name}
        </span>
      </div>
      {hasBusiness ? (
        <>
          <div className="listing-name">{listing.business_name}</div>
          <div className="listing-service-sub">{listing.service_name}</div>
          <div className="listing-provider">By <strong>{listing.provider_name}</strong></div>
        </>
      ) : (
        <>
          <div className="listing-name">{listing.service_name}</div>
          <div className="listing-provider">By <strong>{listing.provider_name}</strong></div>
        </>
      )}
      <div className="listing-desc">{listing.description}</div>
      <div className="listing-area">📍 {listing.service_area}</div>
      <div className="listing-footer">
        <span className="contact-btn">Contact</span>
        <span className="view-link">View details →</span>
      </div>
    </Link>
  )
}
