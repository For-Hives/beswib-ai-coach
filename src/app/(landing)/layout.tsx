import "../globals.css"

export const metadata = {
  title: "Beswib - Coach IA Running",
  description: "Landing page Beswib Coach IA Running",
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      {children}
    </div>
  )
}
