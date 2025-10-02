module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
Fichier 5 : Créez app/layout.js (notez le app/) :
import './globals.css'

export const metadata = {
  title: 'Relevé Impacts Carrosserie',
  description: 'Application de relevé d\'impacts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
