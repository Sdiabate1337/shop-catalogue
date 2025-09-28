import Link from "next/link";
import { ShoppingBag, Smartphone, Globe, Sparkles, ArrowRight, CheckCircle, TrendingUp, Users, Clock, Gift, Zap } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-orange-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-950 dark:to-orange-950">
      {/* Enhanced Desktop Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">ShopShap</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
              Tarifs
            </Link>
            <Link href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
              À propos
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ThemeToggle />
            </div>
<div className="flex items-center gap-3">
              <Link 
                href="#features" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors hidden lg:block"
              >
                Voir un exemple
              </Link>
              <Link 
                href="/auth/signin" 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 lg:px-8 lg:py-3 rounded-full text-sm lg:text-base font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Hero Content */}
      <main className="px-4 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Nouveau en Afrique</span>
                </div>
              </div>
              
              {/* Title */}
              <div className="mb-8">
                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 leading-tight">
                  <span className="text-blue-500">Vendez mieux,</span>
                  <br />
                  <span className="text-orange-500">plus vite,</span>
                  <br />
                  <span className="text-green-500">partout.</span>
                </h1>
                
                <p className="text-gray-600 dark:text-gray-400 text-base lg:text-xl leading-relaxed mb-4 lg:mb-6 max-w-2xl lg:max-w-none">
                  Créez votre catalogue, partagez votre lien unique, vendez via WhatsApp.
                </p>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 lg:mb-8">
                  <p className="text-green-700 dark:text-green-300 font-semibold text-center lg:text-left">
                    ⚡ Créez votre boutique en 2 minutes
                  </p>
                </div>
                
                {/* Process Flow */}
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-8 lg:mb-10">
                  <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Catalogue</span>
                  </div>
                  <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-lg">
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Lien</span>
                  </div>
                  <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-lg">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Ventes WhatsApp</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="space-y-3 lg:space-y-0 lg:space-x-4 lg:flex mb-8 lg:mb-0">
                <Link 
                  href="/auth/signin"
                  className="flex items-center justify-center gap-3 w-full lg:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  <TrendingUp className="w-6 h-6" />
                  Essai gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="#features"
                  className="flex items-center justify-center gap-3 w-full lg:w-auto bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 px-8 py-4 rounded-2xl text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Voir un exemple
                </Link>
              </div>
            </div>

            {/* Right Column - Visual/Demo */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 rounded-3xl p-8 lg:p-12">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 max-w-sm mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">Ma Boutique</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-24 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Produit 1</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-24 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Produit 2</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-24 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Produit 3</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-24 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Produit 4</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-500 text-white text-center py-3 rounded-xl text-sm font-medium">
                    Commander via WhatsApp
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" className="mt-16 lg:mt-24">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Une solution complète pour transformer vos ventes sociales en boutique professionnelle
              </p>
            </div>

            {/* Desktop Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-4 lg:mb-6">
                  <ShoppingBag className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Catalogue mobile
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Créez facilement votre catalogue produits avec photos, prix et descriptions optimisés pour mobile.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-orange-500 rounded-xl flex items-center justify-center mb-4 lg:mb-6">
                  <Globe className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Lien unique
                </h3>
                <div className="mb-4">
                  <span className="text-xs lg:text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-gray-600 dark:text-gray-400">{typeof window !== 'undefined' ? window.location.host : 'shopshap.africa'}/vous</span>
                </div>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Partagez facilement votre boutique sur TikTok, WhatsApp et réseaux sociaux.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-500 rounded-xl flex items-center justify-center mb-4 lg:mb-6">
                  <Smartphone className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Ventes WhatsApp
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Vos clients commandent directement via WhatsApp avec message pré-rempli. Simple et efficace !
                </p>
              </div>
            </div>
          </div>

          {/* Countries Social Proof */}
          <div className="mt-16 lg:mt-24">
            <div className="text-center mb-8">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Disponible dans toute l'Afrique
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Rejoignez les vendeurs de ces pays qui utilisent déjà ShopShap
              </p>
            </div>
            
            <div className="relative overflow-hidden">
              {/* First row - moving right */}
              <div className="flex animate-scroll-right mb-4">
                <div className="flex gap-6 whitespace-nowrap">
                  {/* First set */}
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇸🇳</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sénégal</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇨🇮</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Côte d'Ivoire</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇲🇦</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maroc</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇹🇳</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tunisie</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇳🇬</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nigeria</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇬🇭</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ghana</span>
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇸🇳</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sénégal</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇨🇮</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Côte d'Ivoire</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇲🇦</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Maroc</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇹🇳</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tunisie</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇳🇬</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nigeria</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇬🇭</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ghana</span>
                  </div>
                </div>
              </div>
              
              {/* Second row - moving left */}
              <div className="flex animate-scroll-left">
                <div className="flex gap-6 whitespace-nowrap">
                  {/* First set */}
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇰🇪</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kenya</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇪🇹</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Éthiopie</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇿🇦</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Afrique du Sud</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇨🇲</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cameroun</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇲🇱</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mali</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇧🇫</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Burkina Faso</span>
                  </div>
                  {/* Duplicate set for seamless loop */}
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇰🇪</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kenya</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇪🇹</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Éthiopie</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇿🇦</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Afrique du Sud</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇨🇲</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cameroun</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇲🇱</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mali</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">🇧🇫</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Burkina Faso</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div id="pricing" className="mt-16 lg:mt-24">
            <div className="bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 dark:from-green-950/30 dark:via-blue-950/30 dark:to-orange-950/30 rounded-3xl p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">100% Gratuit à vie</span>
                </div>
                
                <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Prêt à <span className="text-green-500">transformer</span> vos ventes ?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto mb-8">
                  Rejoignez les vendeurs qui font confiance à ShopShap pour développer leur business
                </p>
              </div>

              {/* Stats/Benefits Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Ventes simplifiées</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transformez vos visiteurs en clients avec WhatsApp</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">2 minutes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pour créer votre boutique et commencer à vendre</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">0€ pour toujours</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aucun frais caché, aucune limite de temps</p>
                </div>
              </div>

              {/* Main CTA */}
              <div className="text-center">
                <Link 
                  href="/auth/signin"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-2xl text-lg lg:text-xl font-bold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl mb-6"
                >
                  <TrendingUp className="w-6 h-6" />
                  Créer ma boutique maintenant
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Aucune carte requise
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Configuration instantanée
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Support inclus
                  </span>
                </div>
              </div>

              {/* Future features teaser */}
              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Prochainement : réponses automatiques aux questions, liens de paiement, analytiques avancées
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Native Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-12">
        <div className="px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">ShopShap</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            &copy; 2024 ShopShap. Fait avec passion pour l'Afrique.
          </p>
          <div className="flex justify-center gap-3 text-xs text-gray-400">
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
