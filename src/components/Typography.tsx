export function Title1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl md:text-4xl">{children}</h1>;
}

export function Title2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg md:text-xl lg:text-2xl mb-5">{children}</h2>;
}
