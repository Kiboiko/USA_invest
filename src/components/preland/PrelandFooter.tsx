import { prelandFooter } from '@/data/preland';

export function PrelandFooter() {
  return (
    <footer className="mt-14 border-t border-black bg-[#2b2b2b] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {['B', 'B', 'C'].map((letter, index) => <span key={`${letter}-${index}`} className="grid h-8 w-8 place-items-center bg-white text-lg font-black text-black">{letter}</span>)}
          <span className="ml-2 text-lg font-bold">BBC</span>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-sm font-bold">BBC in other languages</h2>
            <p className="mt-3 text-sm text-white/70">Find BBC News services in your language.</p>
          </div>

          {prelandFooter.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-bold tracking-[0.14em] text-white uppercase">
                {column.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/70 hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-10 border-t border-white/20 pt-6 text-xs leading-relaxed text-white/70">Terms of Use · About the BBC · Privacy Policy · Cookies · Accessibility Help · Contact the BBC</p>
        <p className="mt-3 text-xs text-white/60">{prelandFooter.copyright}</p>
      </div>
    </footer>
  );
}
