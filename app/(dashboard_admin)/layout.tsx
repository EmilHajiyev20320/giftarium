// Admin dashboard layout - placeholder for future expansion
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Coming soon...</p>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

