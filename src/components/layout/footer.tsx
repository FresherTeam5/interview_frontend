export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} MockInterview
      </div>
    </footer>
  )
}
