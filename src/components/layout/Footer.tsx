import Link from 'next/link'
import { Categoria } from '@/types'

export function Footer({ categorias }: { categorias: Categoria[] }) {
  return (
    <footer className="bg-[#0a0f1e] text-white/40 mt-12">
      <div className="max-w-[1240px] mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-white/5">
          <div>
            <div className="font-serif text-2xl font-black text-white mb-2">
              NEON<span className="text-blue-400">POP</span>
            </div>
            <p className="text-sm text-white/30 max-w-xs">
              A cultura pop europeia em português. Música, ecrã, estilo e muito mais.
            </p>
          </div>
          <div className="flex flex-wrap gap-10">
            <div>
              <h4 className="text-[0.65rem] font-bold uppercase tracking-widest text-white/50 mb-3">Editorias</h4>
              {categorias.map(cat => (
                <Link key={cat._id} href={`/categoria/${cat.slug.current}`} className="block text-sm text-white/30 hover:text-white py-0.5 transition-colors">
                  {cat.emoji} {cat.nome}
                </Link>
              ))}
            </div>
            <div>
              <h4 className="text-[0.65rem] font-bold uppercase tracking-widest text-white/50 mb-3">Portal</h4>
              {['Sobre nós', 'Redação', 'Anuncie', 'Newsletter', 'Contacto'].map(l => (
                <Link key={l} href="#" className="block text-sm text-white/30 hover:text-white py-0.5 transition-colors">{l}</Link>
              ))}
            </div>
            <div>
              <h4 className="text-[0.65rem] font-bold uppercase tracking-widest text-white/50 mb-3">Legal</h4>
              {['Privacidade', 'Termos', 'Cookies'].map(l => (
                <Link key={l} href="#" className="block text-sm text-white/30 hover:text-white py-0.5 transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-6 text-xs">
          <span>© {new Date().getFullYear()} NEONPOP · Todos os direitos reservados</span>
          <span>Hospedado em Cloudflare Pages</span>
        </div>
      </div>
    </footer>
  )
}
