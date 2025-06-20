import { LoginForm } from "@/components/auth/login-form"
import { Activity } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Beswib</h1>
          <p className="text-gray-600">Connectez-vous à votre dashboard</p>
        </div>

        {/* Formulaire de connexion */}
        <LoginForm />

        {/* Lien vers inscription */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Beswib. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}