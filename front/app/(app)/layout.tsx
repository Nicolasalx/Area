interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <main className="mx-auto h-full w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
}
