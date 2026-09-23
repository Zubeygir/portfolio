// /studio lives outside [locale], so it needs its own root layout.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
