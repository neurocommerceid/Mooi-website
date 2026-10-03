export default function WhatsAppFab({ wa }: { wa: string }) {
  return (
    <a
      href={wa}
      target="_blank"
      rel="noopener"
      aria-label="Reservasi via WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-gold/40 bg-espresso/90 p-3.5 text-ivory shadow-[0_18px_50px_-15px_rgba(0,0,0,.7)] backdrop-blur-md transition-all duration-500 hover:border-gold lg:bottom-8 lg:right-8 lg:pr-6"
    >
      <span className="relative flex h-7 w-7 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:2.5s]" />
        <svg viewBox="0 0 24 24" className="relative h-6 w-6 fill-gold-light" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
        </svg>
      </span>
      <span className="hidden text-[11px] uppercase tracking-[0.22em] lg:inline">Reservasi</span>
    </a>
  );
}
