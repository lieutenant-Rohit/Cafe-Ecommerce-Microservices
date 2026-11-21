import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Coffee } from 'lucide-react'

type LegalKind = 'privacy' | 'terms'

const privacySections = [
  {
    title: 'What we collect',
    body: 'When you create an account we store your name, email address, delivery address, and order history. When you place an order we record the items, quantities, total, and order status. We do not store card numbers — payments are handled by our payment partner.',
  },
  {
    title: 'Why we collect it',
    body: 'Your details are used to prepare and deliver your order, keep your cart in sync across devices, show your order history, and send the Friday batch email if you asked for it. We also use basic, aggregated usage data to understand which pages are working.',
  },
  {
    title: 'What we never do',
    body: 'We do not sell your personal data. We do not share your address with anyone except the rider delivering your order. We do not send marketing email unless you joined the Morning List, and every email has a one-click unsubscribe.',
  },
  {
    title: 'How long we keep it',
    body: 'Order records are kept for accounting and support purposes. Account details stay until you ask us to close your account. You can request a copy of your data, a correction, or deletion at any time by emailing hello@bloomscafe.in.',
  },
  {
    title: 'Cookies and local storage',
    body: 'We use a small amount of local storage to keep you signed in and to remember your cart. These are essential to how the site works. We do not use advertising cookies or third-party tracking pixels.',
  },
]

const termsSections = [
  {
    title: 'Ordering and availability',
    body: 'Everything on the menu is made in limited batches. An item shown as available can still sell out between your order and pickup. If something is unavailable, the counter will call you and offer a replacement or a refund for that item.',
  },
  {
    title: 'Pickup and delivery',
    body: 'Pickup orders are held for 30 minutes past the estimated ready time. Delivery is available around Rajpur Road and central Dehradun; delivery charges and free-delivery thresholds are shown in the cart. Please make sure someone can receive the order at the address provided.',
  },
  {
    title: 'Payment',
    body: 'Prices are in Indian rupees and include applicable taxes unless stated otherwise. Payment is collected through our payment partner. An order is confirmed once payment succeeds and the counter accepts it.',
  },
  {
    title: 'Cancellations and refunds',
    body: 'Because food is prepared to order, cancellations are only possible before preparation begins. Call the cafe as soon as you can. If an order is cancelled by us, or arrives incorrect or damaged, we will replace it or refund the affected items.',
  },
  {
    title: 'Allergens',
    body: 'Our kitchen handles wheat, dairy, eggs, nuts, and soy. We can describe ingredients, but we cannot guarantee an allergen-free environment. If you have a serious allergy, please speak to the counter before ordering.',
  },
  {
    title: 'Using the site',
    body: 'Please use the site for personal ordering and do not attempt to disrupt it, scrape it, or place fraudulent orders. We may suspend accounts that abuse the service. These terms are governed by the laws of Uttarakhand, India.',
  },
]

export default function Legal({ kind }: { kind: LegalKind }) {
  const isPrivacy = kind === 'privacy'
  const sections = isPrivacy ? privacySections : termsSections

  return (
    <div className="bg-cream-50">
      <section className="border-b-2 border-coffee-900/10 bg-[#C7F4E4]">
        <div className="shell py-10 sm:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-coffee-700 hover:text-coffee-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to the cafe
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="cafe-kicker cafe-kicker-dark">{isPrivacy ? 'Privacy' : 'Terms'}</p>
              <h1 className="mt-2 font-display text-[clamp(2.6rem,6vw,4.2rem)] font-semibold leading-none text-coffee-900">
                {isPrivacy ? 'Your details,' : 'The small print,'}
                <br />
                <span className="text-primary-600">{isPrivacy ? 'looked after.' : 'in plain English.'}</span>
              </h1>
            </div>
            <div className="rotate-2 rounded-2xl border-[3px] border-coffee-900 bg-white px-5 py-3 shadow-[0_6px_0_rgba(58,10,44,0.14)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-coffee-400">Last updated</p>
              <p className="font-display text-lg font-semibold text-coffee-900">November 2026</p>
            </div>
          </div>
        </div>
      </section>

      <div className="shell grid gap-10 py-10 sm:py-14 lg:grid-cols-[0.32fr_0.68fr]">
        <aside className="self-start rounded-[26px] border-[3px] border-coffee-900 bg-white p-5 shadow-[0_8px_0_rgba(58,10,44,0.11)] lg:sticky lg:top-28">
          <p className="flex items-center gap-2 font-display text-lg font-semibold text-coffee-900">
            <Coffee className="h-4 w-4 text-primary-500" />
            On this page
          </p>
          <ol className="mt-3 space-y-2">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#${kind}-${index + 1}`}
                  className="flex items-start gap-2 text-sm font-semibold text-coffee-500 transition-colors hover:text-primary-600"
                >
                  <span className="mt-0.5 font-display text-xs text-primary-500">{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-5 rounded-xl bg-lemon-200 p-3">
            <p className="text-xs font-semibold leading-relaxed text-coffee-700">
              Questions? Email{' '}
              <a href="mailto:hello@bloomscafe.in" className="underline decoration-2 underline-offset-2">
                hello@bloomscafe.in
              </a>{' '}
              or call the counter.
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <section
              key={section.title}
              id={`${kind}-${index + 1}`}
              className="scroll-mt-32 rounded-[26px] border-[3px] border-coffee-900/15 bg-white p-6 sm:p-7"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blush-100 font-display text-sm font-bold text-primary-700">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-coffee-900">{section.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-coffee-500">{section.body}</p>
                </div>
              </div>
            </section>
          ))}

          <div className="rounded-[26px] border-[3px] border-coffee-900 bg-[#FFE6F4] p-6 shadow-[0_7px_0_rgba(58,10,44,0.12)] sm:p-7">
            <p className="font-display text-xl font-semibold text-coffee-900">Still want to talk to a human?</p>
            <p className="mt-1.5 text-sm text-coffee-600">
              The counter phone is answered during opening hours, and email is read every morning.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a href="tel:+911352650127" className="cafe-btn cafe-btn-sm cafe-btn-dark">
                Call the cafe
              </a>
              <Link to="/register" className="cafe-btn cafe-btn-sm cafe-btn-mint">
                Join the Morning List
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
