import Link from "next/link";
import { ShoppingBag, Smartphone, Globe, Sparkles, ArrowRight, CheckCircle, TrendingUp } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-slate-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md dark:bg-gray-900/95 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between max-w-sm mx-auto sm:max-w-none sm:container">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">ShopShap</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/auth/signin" 
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
            >
              Connexion
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile-First Hero Section */}
      <main className="px-4 py-12 max-w-sm mx-auto sm:max-w-none sm:container sm:py-20">
        <div className="text-center">
          {/* Mobile Hero */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 px-5 py-3 rounded-full mb-8 border border-blue-100 dark:border-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Nouveau en Afrique</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Vendez mieux,</span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">plus vite,</span>
              <br />
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">partout.</span>
            </h2>
            
            <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed px-2 max-w-3xl mx-auto">
              Créez votre catalogue, partagez votre lien unique, vendez via WhatsApp. 
              <span className="flex items-center justify-center gap-3 mt-4 font-semibold text-gray-800 dark:text-gray-200 text-base sm:text-lg">
                <span className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">Catalogue</span>
                <ArrowRight className="w-5 h-5 text-blue-500" />
                <span className="bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-lg">Lien</span>
                <ArrowRight className="w-5 h-5 text-orange-500" />
                <span className="bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg">Ventes WhatsApp</span>
              </span>
            </p>
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className="space-y-4 mb-16">
            <Link 
              href="/auth/signin"
              className="group block w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-5 rounded-2xl text-xl font-bold hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 active:scale-98 shadow-2xl hover:shadow-blue-500/25 border border-blue-500/20"
            >
              <span className="flex items-center justify-center gap-3">
                <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Commencer gratuitement
              </span>
            </Link>
            <Link 
              href="#features"
              className="group block w-full border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-5 rounded-2xl text-lg font-semibold hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20 transition-all duration-300 active:scale-98 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <span className="flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Voir comment ça marche
              </span>
            </Link>
          </div>

          {/* Enhanced Features Section */}
          <div id="features" className="space-y-6 sm:grid sm:grid-cols-3 sm:gap-8 sm:space-y-0">
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Catalogue mobile
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Créez votre catalogue avec photos HD, prix et descriptions. 
                <span className="font-semibold text-blue-600 dark:text-blue-400">Optimisé mobile</span>
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Lien unique
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="font-mono text-sm bg-gradient-to-r from-gray-100 to-orange-50 dark:from-gray-700 dark:to-orange-900/30 px-3 py-2 rounded-lg border">shopshap.africa/vous</span>
                <br className="mb-2" />Partagez partout : TikTok, Instagram, WhatsApp
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-green-200 dark:hover:border-green-700 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                WhatsApp direct
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Commandes automatiques via WhatsApp. 
                <span className="font-semibold text-green-600 dark:text-green-400">Message pré-rempli</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile-Optimized Footer */}
      <footer className="border-t bg-white/95 backdrop-blur-md dark:bg-gray-900/95 mt-16">
        <div className="px-4 py-6 max-w-sm mx-auto sm:max-w-none sm:container text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-1.5 rounded-lg">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">ShopShap</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; 2024 ShopShap. Fait avec passion pour l'Afrique.
          </p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
            <span>Sénégal</span>
            <span>•</span>
            <span>Côte d'Ivoire</span>
            <span>•</span>
            <span>Maroc</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
