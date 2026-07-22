import Link from "next/link";
import { cn } from "@/lib/utils";
import { PAYMENT_BRAND_ASSETS } from "@/lib/payment-brand-assets";

const DEFAULT_IYZICO_LOGO = PAYMENT_BRAND_ASSETS.iyzicoCheckoutTrHorizontal;
const DEFAULT_VISA_LOGO = PAYMENT_BRAND_ASSETS.visa;
const DEFAULT_MASTERCARD_LOGO = PAYMENT_BRAND_ASSETS.mastercardSymbol63;

export default function PaymentComplianceNote({
  iyzicoLogo,
  cardLogo,
  visaLogo,
  mastercardLogo,
  className,
  showHeading = true,
}: {
  iyzicoLogo?: string | null;
  cardLogo?: string | null;
  visaLogo?: string | null;
  mastercardLogo?: string | null;
  className?: string;
  /** Checkout’ta başlık gizlenebilir */
  showHeading?: boolean;
}) {
  const iyzico = iyzicoLogo || DEFAULT_IYZICO_LOGO;
  const visa = visaLogo || DEFAULT_VISA_LOGO;
  const mastercard = mastercardLogo || DEFAULT_MASTERCARD_LOGO;

  return (
    <section
      className={cn(
        "grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4",
        className,
      )}
      aria-labelledby="payment-trust-heading"
    >
      {showHeading ? (
        <h2 id="payment-trust-heading" className="text-xs font-medium uppercase tracking-wide text-white/50">
          Güvenli ödeme ve yasal bilgilendirme
        </h2>
      ) : null}
      <p className="text-xs leading-relaxed text-white/55">
        Kart bilgileriniz bu sitede işlenmez veya saklanmaz; ödeme, iyzico altyapısında 3D Secure ile tamamlanır.
        Tutarlar Türk Lirası (TRY) cinsindendir.
      </p>

      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">
        {iyzico ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iyzico} alt="iyzico ile Öde" className="h-8 w-auto rounded bg-white px-1.5 py-1" />
        ) : (
          <span className="text-xs font-medium text-white/65">iyzico ile Öde</span>
        )}
        {cardLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cardLogo} alt="Visa ve MasterCard" className="h-7 w-auto rounded bg-white px-1.5 py-1" />
        ) : (
          <>
            {visa ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={visa} alt="Visa" className="h-6 w-auto rounded bg-white px-1.5 py-1" />
            ) : null}
            {mastercard ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mastercard} alt="Mastercard" className="h-6 w-auto rounded bg-white px-1.5 py-1" />
            ) : null}
            {!visa && !mastercard ? <span className="text-xs text-white/50">Visa · MasterCard</span> : null}
          </>
        )}
        <span className="text-[11px] text-white/45">3D Secure</span>
      </div>

      <nav aria-label="Ödeme ile ilgili yasal sayfalar" className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-white/55">
        <Link href="/hakkimizda" className="hover:text-white/85 underline-offset-2 hover:underline">
          Hakkımızda
        </Link>
        <Link href="/gizlilik-politikasi" className="hover:text-white/85 underline-offset-2 hover:underline">
          Gizlilik Politikası
        </Link>
        <Link href="/teslimat-ve-iade-sartlari" className="hover:text-white/85 underline-offset-2 hover:underline">
          Teslimat ve İade
        </Link>
        <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-white/85 underline-offset-2 hover:underline">
          Mesafeli Satış
        </Link>
      </nav>
    </section>
  );
}

