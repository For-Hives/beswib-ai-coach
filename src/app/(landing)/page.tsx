"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Activity,
  Brain,
  Target,
  Calendar,
  BarChart3,
  Trophy,
  CheckCircle,
  Star,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Plus,
  Minus,
  MessageCircle,
} from "lucide-react"

export default function BeswibAIPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const features = [
    {
      icon: Target,
      title: "Plans d'entraînement sur-mesure",
      description:
        "Notre IA analyse votre profil complet : niveau actuel, objectifs, contraintes de temps, historique de blessures. Elle génère un programme 100% personnalisé qui évolue avec vos progrès.",
      example:
        "Exemple : Vous visez un semi-marathon en 1h45 ? L'IA créera un plan de 12 semaines avec 4 séances hebdomadaires, adaptées à vos disponibilités.",
    },
    {
      icon: Calendar,
      title: "Calendrier intelligent et rappels motivants",
      description:
        "Fini les séances oubliées ! Votre calendrier d'entraînement s'adapte automatiquement à votre emploi du temps. Recevez des rappels personnalisés et des conseils pré-séance pour optimiser chaque sortie.",
      example: "",
    },
    {
      icon: BarChart3,
      title: "Suivi et analyse en temps réel",
      description:
        "Après chaque séance, l'IA analyse vos performances, détecte vos points d'amélioration et ajuste automatiquement votre programme. Feedback constructif garanti après chaque effort.",
      example: "",
    },
    {
      icon: Trophy,
      title: "Recommandations de courses de préparation",
      description:
        "En route vers votre objectif principal ? L'IA vous propose des courses intermédiaires stratégiques pour tester votre forme, maintenir la motivation et affiner votre stratégie de course.",
      example: "",
    },
  ]

  const ecosystemFeatures = [
    "Vos courses cibles synchronisées avec votre plan d'entraînement",
    "Alertes automatiques si des dossards se libèrent pour vos courses de préparation",
    "Historique unifié : entraînements, courses passées, objectifs futurs",
  ]

  const dashboardFeatures = [
    "Vue d'ensemble de votre progression",
    "Statistiques détaillées et graphiques de performance",
    "Recommandations personnalisées",
    "Historique complet de vos entraînements",
  ]

  const faqs = [
    {
      question: "L'IA peut-elle vraiment remplacer un coach ?",
      answer:
        "Notre IA est conçue comme un complément intelligent à un suivi humain, pas comme un remplacement. Elle excelle dans la personnalisation algorithmique et le suivi quotidien, mais nous encourageons vivement le coaching professionnel pour un accompagnement complet. D'ailleurs, consultez nos coachs partenaires pour une approche hybride optimale !",
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer:
        "Absolument. Vos données d'entraînement restent privées et ne sont utilisées que pour améliorer votre expérience personnelle.",
    },
    {
      question: "Dois-je consulter un médecin ?",
      answer:
        "Oui, nous le recommandons fortement avant de débuter tout programme d'entraînement, surtout si vous reprenez le sport ou avez des antécédents médicaux.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Brain className="w-6 h-6" />
                  <span className="text-lg font-medium">BeswibAI</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  🏃‍♂️ Votre coach IA personnel, <span className="text-blue-400">disponible 24h/24</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Transformez votre passion en performance avec l'intelligence artificielle
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Chez Beswib, nous ne nous contentons pas de faciliter l'achat et la revente de dossards. Nous
                  révolutionnons votre approche de l'entraînement grâce à notre assistant IA d'entraînement
                  personnalisé, conçu spécialement pour les coureurs ambitieux.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                  <Zap className="w-5 h-5 mr-2" />
                  Commencer mon entraînement IA
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-4"
                >
                  Voir nos coachs partenaires
                </Button>
              </div>
            </div>

            <div className="lg:flex justify-center hidden">
              <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm max-w-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-600 text-white">Plan IA Actif</Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">12</div>
                        <div className="text-sm text-gray-400">semaines</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Semi-Marathon 1h45</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Objectif : 15 mars 2024</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progression</span>
                        <span className="text-blue-400 font-medium">68%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "68%" }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">24</div>
                        <div className="text-xs text-gray-400">Séances réalisées</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">4:52</div>
                        <div className="text-xs text-gray-400">Allure moyenne</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              🎯 Un entraînement intelligent, adapté à <span className="text-blue-400">VOUS</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                      {feature.example && (
                        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                          <p className="text-blue-200 text-sm italic">{feature.example}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">💡 L'écosystème complet du coureur moderne</h2>
            <p className="text-xl text-gray-300">Connecté à l'univers Beswib :</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {ecosystemFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300 text-lg">{feature}</p>
                </div>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-700/50">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Activity className="w-8 h-8 text-blue-400" />
                    <h3 className="text-2xl font-bold">Dashboard Unifié</h3>
                  </div>
                  <div className="space-y-4">
                    {dashboardFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-12">🏆 Témoignage</h2>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-12">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl text-gray-300 italic mb-8 leading-relaxed">
                "Grâce à l'IA Beswib, j'ai cassé ma barrière des 40 minutes au 10km ! Le plan s'adaptait parfaitement à
                mes semaines chargées et les conseils post-séance m'ont vraiment fait progresser."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Sarah</div>
                  <div className="text-gray-400 text-sm">Coureuse amateur devenue performeuse</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">🔒 Votre espace personnel sécurisé</h2>
            <p className="text-xl text-gray-300">
              Accédez à votre Dashboard IA directement depuis votre compte Beswib. Interface intuitive pensée pour les
              coureurs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardFeatures.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 text-center hover:border-blue-500/50 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-gray-300">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-20 bg-yellow-900/20 border-y border-yellow-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">⚠️ Avertissement et recommandations</h2>
          </div>

          <div className="space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed">
              Notre IA ne remplace pas un suivi médical ou un coaching professionnel. Elle constitue un outil d'aide à
              l'entraînement basé sur des algorithmes et des données générales.
            </p>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Nous recommandons fortement de :</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <span>Consulter un médecin avant de débuter tout programme d'entraînement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <span>Faire appel à un coach qualifié pour un suivi personnalisé approfondi</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <span>Écouter votre corps et adapter les recommandations selon vos sensations</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="mb-4">
                Envie d'aller plus loin ? Découvrez nos coachs partenaires certifiés pour un accompagnement humain
                complémentaire.
              </p>
              <Button variant="outline" className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/30">
                <Users className="w-4 h-4 mr-2" />
                Voir nos coachs partenaires
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">🚀 Prêt à révéler votre potentiel ?</h2>
          <p className="text-2xl text-blue-200 mb-8 leading-relaxed">
            L'intelligence artificielle au service de votre passion. Un compagnon d'entraînement qui ne dort jamais, ne
            juge jamais, et vous pousse toujours vers l'excellence.
          </p>

          <div className="space-y-4">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 text-xl px-12 py-6">
              <Brain className="w-6 h-6 mr-3" />
              Commencer mon entraînement IA
            </Button>
            <p className="text-blue-200">Créez votre compte Beswib et débloquez votre assistant personnel</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">❓ Questions fréquentes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    {openFaq === index ? (
                      <Minus className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <Separator className="mb-4 bg-gray-700" />
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl text-gray-300 mb-8">
            Rejoignez les milliers de coureurs qui ont déjà fait le choix de l'entraînement intelligent.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-xl px-12 py-6">
            <ArrowRight className="w-6 h-6 mr-3" />
            Commencer maintenant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Beswib</span>
              </div>
              <p className="text-gray-400">L'intelligence artificielle au service de votre passion pour la course.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    BeswibAI
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Coachs partenaires
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 Beswib. Tous droits réservés.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}