import { Calendar, Clock, MapPin, Mail, MessageSquare, Phone, Star, Users, X } from 'lucide-react';
import type { AdminProperty } from '../../services/types';
import PropertyStatusBadge from './PropertyStatusBadge';

interface PropertyDetailsDrawerProps {
  isOpen: boolean;
  property?: AdminProperty;
  isLoading?: boolean;
  onClose: () => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3 rounded-2xl border border-slate-200/70 bg-white/90 p-5 dark:border-slate-800/60 dark:bg-slate-900/60">
    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
    <div className="text-sm text-slate-600 dark:text-slate-300">{children}</div>
  </section>
);

const Skeleton = () => (
  <div className="space-y-4">
    <div className="h-48 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/60" />
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/60" />
      ))}
    </div>
  </div>
);

const stringifyArray = (input: unknown): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((item) => String(item));
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return input.split(',').map((item) => item.trim());
    }
  }
  return [];
};

const formatCurrency = (value?: number, currency = 'NGN') => {
  if (!value && value !== 0) return '—';
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(Number(value));
  } catch {
    return `${currency} ${value}`;
  }
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
};

const formatDateRange = (from?: string | null, to?: string | null) => {
  if (!from && !to) return '—';
  if (from && to) {
    return `${formatDate(from)} → ${formatDate(to)}`;
  }
  return formatDate(from || to);
};

const renderStars = (rating: number, size = 'h-4 w-4') =>
  Array.from({ length: 5 }).map((_, index) => {
    const filled = index < rating;
    return (
      <Star
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        className={`${size} ${filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} dark:text-slate-600`}
        strokeWidth={filled ? 0 : 1.5}
        fill={filled ? 'currentColor' : 'none'}
      />
    );
  });

const bookingStatusStyles: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200',
  confirmed: 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200',
  completed: 'bg-sky-500/15 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200',
  cancelled: 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200',
  rejected: 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200',
  expired: 'bg-slate-500/15 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300'
};

export const PropertyDetailsDrawer = ({ isOpen, property, isLoading, onClose }: PropertyDetailsDrawerProps) => {
  if (!isOpen) {
    return null;
  }

  const primaryImage = property?.media?.[0]?.secureUrl || property?.media?.[0]?.url;
  const galleryImages = property?.media?.slice(1) ?? [];
  const amenities = stringifyArray(property?.amenities);
  const features = stringifyArray(property?.features);
  const bookings = property?.bookings ?? [];
  const shortletBookings = bookings.filter((booking) => booking.bookingType === 'shortlet');
  const reviews = property?.reviews ?? [];
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length : null;

  // Debug logging
  console.log('Admin Property Details:', {
    propertyId: property?.id,
    listingType: property?.listingType,
    hasBookings: !!property?.bookings,
    bookingsCount: bookings.length,
    shortletBookingsCount: shortletBookings.length,
    bookings: bookings,
    shortletBookings: shortletBookings
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="hidden flex-1 bg-slate-900/40 backdrop-blur-sm md:block" onClick={onClose} />
      <div className="ml-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto border-l border-slate-200 bg-slate-50/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Property details</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              {property?.title || 'Loading property...'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-6 px-6 py-6">
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              {primaryImage ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200/60 shadow-sm dark:border-slate-800/60">
                  <img
                    src={primaryImage}
                    alt={property?.title ?? 'Property'}
                    className="h-64 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
                  No media uploaded for this property yet.
                </div>
              )}

              {galleryImages.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryImages.map((media) => (
                    <img
                      key={media.id}
                      src={media.secureUrl || media.url}
                      alt={media.caption ?? property?.title ?? 'Property media'}
                      className="h-40 w-full rounded-2xl border border-slate-200/60 object-cover dark:border-slate-800/60"
                    />
                  ))}
                </div>
              ) : null}

              <Section title="Listing overview">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {property ? <PropertyStatusBadge status={property.status} /> : null}
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 font-medium text-indigo-600 dark:bg-indigo-500/25 dark:text-indigo-200">
                    {property?.listingType?.toUpperCase()}
                  </span>
                  <span className="rounded-full bg-slate-500/10 px-3 py-1 font-medium text-slate-600 dark:bg-slate-700/40 dark:text-slate-300">
                    {property?.propertyType}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Price</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(property?.price, property?.currency)}
                      {property?.pricePeriod ? (
                        <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                          / {property.pricePeriod?.replace('_', ' ')}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Location</p>
                    <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {[property?.address, property?.city, property?.state].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Views</p>
                    <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {property?.viewCount ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Featured</p>
                    <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {property?.featured
                        ? `Yes ${property?.featuredUntil ? `(until ${new Date(property.featuredUntil).toLocaleDateString()})` : ''}`
                        : 'No'}
                    </p>
                  </div>
                </div>
              </Section>

              {property?.description ? (
                <Section title="Description">
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300">{property.description}</p>
                </Section>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <Section title="Amenities">
                  {amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No amenities listed.</p>
                  )}
                </Section>
                <Section title="Features">
                  {features.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700/40 dark:text-slate-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No additional features provided.</p>
                  )}
                </Section>
              </div>

              {property?.listingType === 'shortlet' ? (
                <Section title="Shortlet bookings">
                  {shortletBookings.length > 0 ? (
                    <div className="space-y-3">
                      {shortletBookings.map((booking) => {
                        const statusStyle = bookingStatusStyles[booking.status] ?? bookingStatusStyles.pending;
                        return (
                          <div
                            key={booking.id}
                            className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  Booking #{booking.id.slice(0, 8)}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDateRange(booking.checkInDate, booking.checkOutDate)}
                                  </span>
                                  {booking.numberOfNights ? (
                                    <span className="inline-flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      {booking.numberOfNights} night{booking.numberOfNights === 1 ? '' : 's'}
                                    </span>
                                  ) : null}
                                  {booking.numberOfGuests ? (
                                    <span className="inline-flex items-center gap-1">
                                      <Users className="h-3.5 w-3.5" />
                                      {booking.numberOfGuests} guest{booking.numberOfGuests === 1 ? '' : 's'}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>
                                {booking.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {formatCurrency(Number(booking.totalPrice ?? 0), booking.currency)}
                              </p>
                              {booking.user ? (
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  Guest:{' '}
                                  <span className="font-medium text-slate-700 dark:text-slate-200">
                                    {booking.user.firstName} {booking.user.lastName}
                                  </span>{' '}
                                  · {booking.user.email}
                                </div>
                              ) : (
                                <div className="text-xs text-slate-500 dark:text-slate-400">Guest data unavailable</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No shortlet bookings have been recorded yet.
                    </p>
                  )}
                </Section>
              ) : null}

              <Section title="Guest reviews">
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {averageRating ? (
                      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-200">
                        <div className="flex items-center gap-2">
                          {renderStars(Math.round(averageRating), 'h-5 w-5')}
                        </div>
                        <div className="text-sm font-medium">
                          Average rating {averageRating.toFixed(1)} ({reviews.length} review
                          {reviews.length === 1 ? '' : 's'})
                        </div>
                      </div>
                    ) : null}

                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">{renderStars(review.rating)}</div>
                            <span className="text-xs uppercase tracking-wide text-slate-400">
                              {review.reviewType.replace(/_/g, ' ')}
                            </span>
                            {review.isVerified ? (
                              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                                Verified stay
                              </span>
                            ) : null}
                          </div>
                          <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                            {review.status}
                          </span>
                        </div>
                        <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                          {review.title ? (
                            <p className="font-semibold text-slate-900 dark:text-white">{review.title}</p>
                          ) : null}
                          <p className="leading-relaxed">{review.content}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <div className="inline-flex items-center gap-2">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {review.reviewer
                              ? `${review.reviewer.firstName} ${review.reviewer.lastName} · ${review.reviewer.email}`
                              : 'Reviewer details unavailable'}
                          </div>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                        {review.booking ? (
                          <div className="mt-3 rounded-xl bg-slate-500/5 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                            Stayed {formatDateRange(review.booking.checkInDate, review.booking.checkOutDate)} ·{' '}
                            {review.booking.numberOfNights
                              ? `${review.booking.numberOfNights} night${review.booking.numberOfNights === 1 ? '' : 's'}`
                              : 'Booking details'}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This property has not received any guest reviews yet.
                  </p>
                )}
              </Section>

              <Section title="Owner & agent">
                <div className="space-y-4">
                  {property?.owner ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Owner</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {property.owner.firstName} {property.owner.lastName}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {property.owner.email}
                        </span>
                        {property.owner.role ? (
                          <span className="rounded-full bg-slate-500/10 px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500 dark:bg-slate-700/50 dark:text-slate-300">
                            {property.owner.role}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Owner data unavailable.</p>
                  )}

                  {property?.agent ? (
                    <div className="border-t border-dashed border-slate-200 pt-4 dark:border-slate-800">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Assigned agent</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {property.agent.firstName} {property.agent.lastName}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {property.agent.email}
                        </span>
                        {property.agent && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            Contact available in CRM
                          </span>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </Section>

              {property?.rejectionReason || property?.moderationNotes ? (
                <Section title="Moderation notes">
                  {property.rejectionReason ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-rose-500">Rejection reason</p>
                      <p className="mt-1 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-600 dark:bg-rose-500/15 dark:text-rose-200">
                        {property.rejectionReason}
                      </p>
                    </div>
                  ) : null}
                  {property.moderationNotes ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Internal notes</p>
                      <p className="mt-1 rounded-xl bg-slate-500/5 p-3 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                        {property.moderationNotes}
                      </p>
                    </div>
                  ) : null}
                </Section>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsDrawer;


